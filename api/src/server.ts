import {NestFactory} from '@nestjs/core';
import * as bodyParser from 'body-parser';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {ApplicationModule} from './app.module';
import {ValidationPipe} from './validation.pipe';
import MqGwApi from "./modules/config/mq.gw.api.config";


async function bootstrap() {

    new MqGwApi().enable();

    const app = await NestFactory.create(ApplicationModule);

    // VALIDATION CONFIG
    app.use(bodyParser.json());
    app.useGlobalPipes(new ValidationPipe());
    // app.setGlobalPrefix('/');

    // SWAGGER CONFIG
    const options = new DocumentBuilder()
        .setTitle('Swagger example')
        .setDescription('Swagger description')
        .setVersion('1.0')
        .addTag('mytag')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/swagger', app, document);


    await app.listen(3000);
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

bootstrap();




