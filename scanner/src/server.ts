import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import MqGwScannerConfig from "./modules/config/scanner.mq.gw.config";
// import MqGwApi from "./modules/config/mq.gw.api.config";


async function bootstrap() {

    new MqGwScannerConfig().enable();

    const app = await NestFactory.create(ApplicationModule);

    await app.listen(2999);
}

let context = require('request');

let proxied = context.Request;
context.Request = function (options) {
    options.timeout = 10000;
    let result;
    try {
        result = proxied.apply(this, [options]);
    }
    catch (e) {
        console.log(e);
    }
};
context.Request.prototype = proxied.prototype;
context.Request.prototype.costructor = proxied;

bootstrap();




