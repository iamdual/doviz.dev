/**
 * Obtain EUR currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const sourceCurrency = 'EUR';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'https://www.ecb.europa.eu'
        },
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
    //console.log(jObj['gesmes:Envelope'].Cube.Cube.Cube);

    if (typeof jObj['gesmes:Envelope'].Cube.Cube.Cube === 'undefined') {
        throw Error('Invalid response.');
    }

    jObj['gesmes:Envelope'].Cube.Cube.Cube.map(currency => {
        //console.log(currency);

        if (typeof currency['@_currency'] !== 'string' || currency['@_currency'].length !== 3) {
            return;
        }
        const targetCurrency = currency['@_currency'];

        if (typeof currency['@_rate'] === 'undefined' || !currency['@_rate']) {
            return;
        }
        const exchangeRate = parseFloat(currency['@_rate']);
        if (!exchangeRate || isNaN(exchangeRate)) {
            return;
        }

        exchangeData[targetCurrency.concat(sourceCurrency)] = 1 / exchangeRate;
        exchangeData[sourceCurrency.concat(targetCurrency)] = exchangeRate;
    });

    // Add metadata
    exchangeData['_meta'] = { created_at: new Date().toISOString() };

    return exchangeData;
}

if (require.main === module) {
    (async () => {
        const output = await Generator();
        console.log(output);
    })();
}

module.exports = Generator;
