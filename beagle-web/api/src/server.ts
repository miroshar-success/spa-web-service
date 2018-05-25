import { NestFactory, FastifyAdapter } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';
import { resolve } from 'path';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { MqGwConfig } from './config/mq.gw.api.config';

const proxy = require('http-proxy-middleware');

const path = require('path');

async function bootstrap() {

  new MqGwConfig();

  //const app = await NestFactory.create(ApplicationModule, new FastifyAdapter());
  const app = await NestFactory.create(ApplicationModule);

  app.use('/data', proxy({
    target: 'http://localhost:3000',
    changeOrigin: true,
  }))

  // VALIDATION CONFIG
  app.use(bodyParser.json());
  // app.useStaticAssets({
  //   root: resolve(__dirname + '../../../ui/dist/')
  // })

  // SWAGGER CONFIG
  const options = new DocumentBuilder()
    .setTitle('Swagger example')
    .setDescription('Swagger description')
    .setVersion('1.0')
    .addTag('mytag')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(3001);
}

bootstrap();