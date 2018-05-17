import {ScannerService} from './scanner.service';
const fs = require('fs');

describe('scanner test', () => {
    let scannerService: ScannerService;
    const page: string = fs.readFileSync('./src/modules/scanner/test/example.html');
    beforeEach(() => {
        scannerService = new ScannerService();
    });
    describe('parse', () => {
        it('should return cheerio object from HTML', async () => {
            const result = ['test'];
            const output = scannerService.parse(page);
            console.log(typeof output);
            expect(await output).toBe(result);
        });
    });
});