const original = new (require('./scanner.service')).ScannerService();
const defaultHtml = fs.readFileSync('./__mocks__/__mockData__/scanner.html', 'utf8');

export const mockPlaySoundFile = jest.fn();
const mock = jest.fn().mockImplementation(() => {
  return {
    ...original,
    download: () => {
      return {body: defaultHtml}
    },
  };
});

export default mock;