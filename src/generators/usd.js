/**
 * Obtain USD currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Meta = require('../meta');

const sourceCurrency = 'USD';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'http://www.floatrates.com/daily/USD.xml',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'http://www.floatrates.com'
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

    const parser = new XMLParser();
    let jObj = parser.parse(response.data);

    if (typeof jObj?.channel?.item === 'undefined') {
        throw Error('Unexpected response.');
    }

    jObj.channel.item.map(currency => {
        if (typeof currency?.targetCurrency !== 'string' || currency.targetCurrency.length !== 3) {
            return;
        }
        const targetCurrency = currency.targetCurrency;

        if (typeof currency?.exchangeRate === 'undefined' || !currency.exchangeRate) {
            return;
        }
        const exchangeRate = parseFloat(currency.exchangeRate);
        if (!exchangeRate || isNaN(exchangeRate)) {
            return;
        }

        exchangeData[targetCurrency.concat(sourceCurrency)] = 1 / exchangeRate;
        exchangeData[sourceCurrency.concat(targetCurrency)] = exchangeRate;
    });

    // Add metadata
    const meta = new Meta(sourceCurrency, 'floatrates.com');
    if (typeof jObj?.channel?.pubDate === 'string') {
        meta.setUpdatedAt(jObj.channel.pubDate);
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
