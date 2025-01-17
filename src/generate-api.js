/**
 * Doviz.dev API Generator Script
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const fs = require('fs');
const axios = require('axios');

const outputDir = __dirname + '/../public/v1/';
const generators = ['try', 'eur', 'usd', 'aud', 'dkk', 'cad', 'pln', 'btc'];

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

generators.map(name => {

    const generator = require('./generators/' + name);

    generator().then(output => {
        fs.writeFileSync(outputDir + name + '.json', JSON.stringify(output));
        console.log('[OK] Exchange rates for ' + name.toUpperCase() + ' has been updated!');
    }).catch(error => {
        console.log('[ERROR] An error occurred while fetching data from ' + name.toUpperCase() + '!');
        console.log(error);

        // Use cached response
        axios(`https://doviz.dev/v1/${name}.json`).then(response => {
            fs.writeFileSync(outputDir + name + '.json', JSON.stringify(response.data));
        });
    });

});
