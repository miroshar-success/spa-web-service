const jsdom = jest.genMockFromModule('jsdom');
const fs = require('fs');
const defaultHtml = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');
let assignedHTML = undefined;

function env(config) {
  const window = new Window({});
  window.close = () => {};
  config.done(null, window);
}

function __setMockHTML(html) {
  assignedHTML = html;
}

function serializeDocument(doc){
  return assignedHTML || defaultHtml;
}

jsdom.env = env;
jsdom.serializeDocument = serializeDocument;
jsdom.__setMockHTML = __setMockHTML;

module.exports = jsdom;