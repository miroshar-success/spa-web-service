import getUserAgent from './UserAgent';

const Horseman = require('node-horseman');
export default class HorsemanDownloader {
    static download = async (url: string): Promise<string> => {
        let horseman = new Horseman({loadImages: false, timeout: 10000, ignoreSSLErrors: true, webSecurity: false});
        const result = await horseman
            .userAgent(getUserAgent())
            .open(url)
            .on('resourceRequested', function(reqData, req){
                if (reqData.url.indexOf('someText') > -1) {
                    req.abort();
                }
            })
            .wait(5000)
            .html()
            .then(body => {
                return {res: body, ok: true};
            })
            .catch(error => {
                return {res: error, ok: false};
            })
            .finally(() => {
                return horseman.close();
            });
        if (!result.ok)
            throw result.error;
        return result.res;
    };
}
