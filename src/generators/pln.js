/**
 * Obtain PLN currency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Meta = require('../meta');

const sourceCurrency = 'PLN';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://www.nbp.pl/kursy/xml/lasta.xml',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
            'Referer': 'https://www.nbp.pl'
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

    if (typeof jObj?.tabela_kursow?.pozycja === 'undefined') {
        throw Error('Unexpected response.');
    }

    jObj.tabela_kursow.pozycja.map(currency => {
        if (typeof currency?.kod_waluty !== 'string' || currency.kod_waluty.length !== 3) {
            return;
        }
        const targetCurrency = currency.kod_waluty;

        if (typeof currency?.kurs_sredni === 'undefined' || !currency.kurs_sredni) {
            return;
        }

        let exchangeRate = parseFloat(currency.kurs_sredni.replace(',', '.'));
        if (!exchangeRate || isNaN(exchangeRate)) {
            return;
        }

        if (typeof currency?.przelicznik === 'number' && currency.przelicznik > 1) {
            exchangeRate = exchangeRate / currency.przelicznik;
        }

        exchangeData[targetCurrency.concat(sourceCurrency)] = exchangeRate;
        exchangeData[sourceCurrency.concat(targetCurrency)] = 1 / exchangeRate;
    });

    // Add metadata
    const meta = new Meta(sourceCurrency, 'nbp.pl');
    if (typeof jObj.tabela_kursow?.data_publikacji === 'string') {
        meta.setUpdatedAt(jObj.tabela_kursow.data_publikacji.concat(' 12:00:00 GMT+0100'));
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
