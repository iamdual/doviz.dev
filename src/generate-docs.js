/**
 * Doviz.dev Documentation Generator Script
 * @link https://github.com/iamdual/doviz.dev
 * @author Ekin Karadeniz <iamdual@icloud.com>
 */

const fs = require('fs');

const outputDir = __dirname + '/../public/';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const showdown = require('showdown');
showdown.setFlavor('github');
const converter = new showdown.Converter({
  tables: true
});

const head = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>Doviz.dev API</title>
<style>
body {
  margin: 0;
  padding: 2em;
  max-width: 800px;
  background: #eee;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

h1 {
  margin-top: 50px;
}

h1:first-child {
  margin-top: 0px !important;
}

h2, h3 {
  margin-top: 30px;
}

table {
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #c1c1c1;
}

th, td {
  padding: 8px 20px;
}

a {
  color: blue;
}

pre {
  overflow-x: auto;
}

pre::-webkit-scrollbar {
  background: #b3bccc;
}

pre::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 5px;
}

pre {
  background: #414449;
  color: #b3bccc;
  padding: 15px;
  tab-size: 4;
  -webkit-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, .75);
}
</style>
</head><body>`;

const foot = `<a href="https://github.com/iamdual/doviz.dev"><img style="position: fixed; top: 0; right: 0; border: 0;"
src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
</body></html>`;

fs.readFile(__dirname + '/../README.md', 'utf8', function (err, data) {
  const html = head + converter.makeHtml(data) + foot;
  fs.writeFileSync(__dirname + '/../public/index.html', html);
  console.log('[OK] index.html has been updated!');
  process.exit(0);
});
