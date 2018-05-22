const fs = require('fs');

function request(url) {
  // Get userID from supplied url string
  // Load user json data from a file in de subfolder for mock data
  let data = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');
  console.log('+');
  return {body: data};
}

module.exports = request;