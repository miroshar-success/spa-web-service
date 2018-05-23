const jsdom = jest.genMockFromModule('jsdom');
const fs = require('fs');
const defaultHtml = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');

function env(config) {
  console.log(require('jsdom'));
  config.done(null, {
    document: require('jsdom').jsdom(defaultHtml, config).defaultView, close: () => {
    }
  });
}

jsdom.env = env;

module.exports = jsdom;