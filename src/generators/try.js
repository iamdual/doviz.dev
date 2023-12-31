/**
 * Obtain TRY currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Meta = require('../meta');

const sourceCurrency = 'TRY';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://www.tcmb.gov.tr/kurlar/today.xml',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'https://www.tcmb.gov.tr'
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

    if (typeof jObj?.Tarih_Date?.Currency === 'undefined') {
        throw Error('Unexpected response.');
    }

    jObj.Tarih_Date.Currency.map(currency => {
        if (typeof currency?.['@_CurrencyCode'] !== 'string' || currency['@_CurrencyCode'].length !== 3) {
            return;
        }
        const targetCurrency = currency['@_CurrencyCode'];

        if (typeof currency?.BanknoteSelling === 'undefined' || !currency.BanknoteSelling) {
            return;
        }

        let exchangeRate = parseFloat(currency.BanknoteSelling);
        if (!exchangeRate || isNaN(exchangeRate)) {
            return;
        }

        if (typeof currency?.Unit === 'number' && currency.Unit > 1) {
            exchangeRate = exchangeRate / currency.Unit;
        }

        exchangeData[targetCurrency.concat(sourceCurrency)] = exchangeRate;
        exchangeData[sourceCurrency.concat(targetCurrency)] = 1 / exchangeRate;
    });

    // Add metadata
    const meta = new Meta(sourceCurrency, 'tcmb.gov.tr');
    if (typeof jObj.Tarih_Date?.['@_Date'] === 'string') {
        meta.setUpdatedAt(jObj.Tarih_Date['@_Date'].concat(' 15:30:00 GMT+0300'));
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
