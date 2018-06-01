import getUserAgent from './UserAgent';

const jsdom = require("jsdom/lib/old-api.js");

export default class JSDOMDownloader {
    static download = async (url: string): Promise<string> => {
        const jar = jsdom.createCookieJar();
        const domHtml = await (new Promise((resolve, reject) => {
            jsdom.env({
                url,
                cookieJar: jar,
                userAgent: getUserAgent(),
                features: {
                    FetchExternalResources: ['script'],
                    ProcessExternalResources: ['script'],
                    SkipExternalResources: false
                },
                headers: {
                    "User-Agent": getUserAgent()
                },
                // proxy: 'https://api.enthought.com/',
                done: function (err, window) {
                    if (err) {
                        reject(err);
                    } else {
                        const output = jsdom.serializeDocument(window.document);
                        setTimeout(() => window.close(), 100);
                        resolve(output);
                    }
                },
            });
        }));
        return domHtml;
    };
}
