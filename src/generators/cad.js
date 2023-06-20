/**
 * Obtain CAD currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');

const sourceCurrency = 'CAD';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json?recent=1',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'https://www.bankofcanada.ca'
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: true,
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        })
    });

    if (response.status !== 200) {
        throw Error('Invalid status code.');
    }

    if (typeof response.data.observations === 'undefined') {
        throw Error('Unexpected response.');
    }

    const currentYear = new Date().getFullYear().toString();
    let lastDate = null;

    response.data.observations.map(obj => {
        if (typeof obj.d !== 'string') {
            throw Error('Unexpected object.');
        }

        if (!obj.d.startsWith(currentYear)) {
            return;
        }
        lastDate = obj.d;

        Object.keys(obj).forEach(key => {
            if (!key.startsWith('FX') || !key.endsWith('CAD') || key.length !== 8) {
                return;
            }

            const targetCurrency = key.substring(2, 5);

            if (typeof typeof obj[key]?.v === 'undefined' || !obj[key].v) {
                return;
            }
            const exchangeRate = parseFloat(obj[key].v);
            if (!exchangeRate || isNaN(exchangeRate)) {
                return;
            }

            exchangeData[targetCurrency.concat(sourceCurrency)] = 1 / exchangeRate;
            exchangeData[sourceCurrency.concat(targetCurrency)] = exchangeRate;
        });

    });

    // Add metadata
    exchangeData['_meta'] = { generated_at: new Date().toISOString() };
    if (lastDate !== null) {
        exchangeData['_meta'] = { ...exchangeData['_meta'], updated_at: new Date(lastDate.concat(' 16:30:00 GMT-0400')).toISOString() };
    }

    return exchangeData;
}

if (require.main === module) {
    (async () => {
        const output = await Generator();
        console.log(output);
    })();
}

module.exports = Generator;
