/**
 * Obtain cryptocurrency rates
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const Meta = require('../meta');

const sourceCurrency = 'BTC';
let exchangeData = {};

const Generator = async () => {

    const response = await axios({
        method: 'GET',
        url: 'https://api.binance.com/api/v3/ticker/price',
        httpsAgent: new https.Agent({
            rejectUnauthorized: true,
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        })
    });

    if (response.status !== 200) {
        throw Error('Invalid status code.');
    }

    if (typeof response.data === 'undefined') {
        throw Error('Unexpected response.');
    }

    response.data.forEach(obj => {
        exchangeData[obj.symbol] = parseFloat(obj.price);
    });;

    // Add metadata
    exchangeData['_meta'] = new Meta(sourceCurrency, 'binance.com', new Date().toISOString());

    return exchangeData;
}

if (require.main === module) {
    (async () => {
        const output = await Generator();
        console.log(output);
    })();
}

module.exports = Generator;
