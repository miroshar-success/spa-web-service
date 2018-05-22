const fs = require('fs');

function needle(url) {
  // Get userID from supplied url string
  // Load user json data from a file in de subfolder for mock data
  let data = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');
  return {body: data};
}

module.exports = needle;