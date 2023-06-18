/**
 * Doviz.dev Generator Script
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const fs = require('fs');

const outputDir = __dirname + '/../public/v1/';
const generators = ['try', 'eur', 'usd', 'aud'];

let exchangeData = {};

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {

    for (let i in generators) {

        const generator = require('./generators/' + generators[i]);

        try {
            const output = await generator();
            exchangeData = { ...output, ...exchangeData };

            fs.writeFileSync(outputDir + generators[i] + '.json', JSON.stringify(output));

        } catch (error) {
            console.error(error);
        }
    }

    exchangeData['_meta'] = { 'created_at': new Date().toISOString() };
    fs.writeFileSync(outputDir + '_all.json', JSON.stringify(exchangeData));

    console.log('[OK] Exchange rates has been updated!');
    process.exit(0);

})();
