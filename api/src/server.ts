import {NestFactory} from '@nestjs/core';
import * as bodyParser from 'body-parser';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {ApplicationModule} from './app.module';
import {ValidationPipe} from './validation.pipe';

import {ScannerService} from './modules/scanner/scanner.service';

async function bootstrap() {

    const scanner: ScannerService = new ScannerService();
    //https://www.ebay.com/sch/Laptops-Netbooks-/175672/i.html;
    //https://allegro.pl/kategoria/samochody-osobowe-4029?order=n';
    //https://cars.av.by/infiniti?sort=date&order=desc
    const url = 'https://allegro.pl/kategoria/samochody-osobowe-4029?order=n';
    const allExamples = await scanner.fetchAll(url);
    const promises = allExamples.map(async example =>  {
        return scanner.fetchOne(url, example.selector);
    });
    //const test = await scanner.fetchOne(url,'html > body > div > div > main > div > div > div > div > div > div > div > div > div > h4 > a[href]');
    //const allDetails = await Promise.all(promises);
    //const news = await scanner.fetchOne(url,allExamples.sample[2].selector,'https://news.tut.by/world/593004.html');
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

bootstrap();
