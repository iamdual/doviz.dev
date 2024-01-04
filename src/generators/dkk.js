/**
 * Obtain DKK currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Meta = require('../meta');

const sourceCurrency = 'DKK';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://www.nationalbanken.dk/api/currencyratesxml?lang=en',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'https://www.nationalbanken.dk'
        },
        responseType: 'text',
        httpsAgent: new https.Agent({
            rejectUnauthorized: true,
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        })
    });

    if (response.status !== 200) {
        throw Error('Invalid status code.');
    }

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });
    let jObj = parser.parse(response.data);

    if (typeof jObj?.exchangerates?.dailyrates?.currency === 'undefined') {
        throw Error('Unexpected response.');
    }

    jObj.exchangerates.dailyrates.currency.map(currency => {
        if (typeof currency?.['@_code'] !== 'string' || currency['@_code'].length !== 3) {
            return;
        }
        const targetCurrency = currency['@_code'];

        if (typeof currency?.['@_rate'] === 'undefined' || !currency['@_rate']) {
            return;
        }
        let exchangeRate = parseFloat(currency['@_rate']);
        if (!exchangeRate || isNaN(exchangeRate)) {
            return;
        }
        exchangeRate = exchangeRate / 100;

        exchangeData[targetCurrency.concat(sourceCurrency)] = exchangeRate;
        exchangeData[sourceCurrency.concat(targetCurrency)] = 1 / exchangeRate;
    });

    // Add metadata
    const meta = new Meta(sourceCurrency, 'nationalbanken.dk');
    if (typeof jObj.exchangerates.dailyrates?.['@_id'] === 'string') {
        meta.setUpdatedAt(jObj.exchangerates.dailyrates['@_id'].concat(' 14:15:00 GMT+0200'));
    }
    exchangeData['_meta'] = meta;

    return exchangeData;
}

if (require.main === module) {
    (async () => {
        const output = await Generator();
        console.log(output);
    })();
}

module.exports = Generator;
