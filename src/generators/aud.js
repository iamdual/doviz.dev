/**
 * Obtain AUD currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Meta = require('../meta');

const sourceCurrency = 'AUD';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://www.rba.gov.au/rss/rss-cb-exchange-rates.xml',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'https://www.rba.gov.au'
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

    if (typeof jObj?.['rdf:RDF']?.item === 'undefined') {
        throw Error('Unexpected response.');
    }

    jObj['rdf:RDF'].item.map(currency => {
        const rate = currency?.['cb:statistics']?.['cb:exchangeRate'];
        if (!rate || rate?.['cb:baseCurrency'] !== sourceCurrency) {
            return;
        }

        if (typeof rate?.['cb:targetCurrency'] !== 'string' || rate['cb:targetCurrency'].length !== 3) {
            return;
        }
        const targetCurrency = rate['cb:targetCurrency'];
        if (targetCurrency === 'XXX') {
            return;
        }

        if (typeof rate?.['cb:observation']?.['cb:value'] === 'undefined' || !rate['cb:observation']['cb:value']) {
            return;
        }
        const exchangeRate = parseFloat(rate['cb:observation']['cb:value']);
        if (!exchangeRate || isNaN(exchangeRate)) {
            return;
        }

        exchangeData[targetCurrency.concat(sourceCurrency)] = 1 / exchangeRate;
        exchangeData[sourceCurrency.concat(targetCurrency)] = exchangeRate;
    });

    // Add metadata
    const meta = new Meta(sourceCurrency, 'rba.gov.au');
    if (typeof jObj?.['rdf:RDF']?.['channel']?.['dc:date'] === 'string') {
        meta.setUpdatedAt(jObj['rdf:RDF']['channel']['dc:date']);
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
