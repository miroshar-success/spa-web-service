const jsdom = jest.genMockFromModule('jsdom');
const fs = require('fs');
const defaultHtml = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');

function env(config) {
  const window = new Window({});
  window.close = () => {};

  config.done(null, window);
}

function serializeDocument(doc){
  return defaultHtml;
}

jsdom.env = env;
jsdom.serializeDocument = serializeDocument;

module.exports = jsdom;