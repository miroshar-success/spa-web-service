import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';
// import { ValidationPipe } from './validation.pipe';

// import { ScannerService } from './modules/scanner/scanner.service';

async function bootstrap() {

  const app = await NestFactory.create(ApplicationModule);

  // VALIDATION CONFIG
  app.use(bodyParser.json());
  // app.useGlobalPipes(new ValidationPipe());
  // app.setGlobalPrefix('/');

  // SWAGGER CONFIG
  // const options = new DocumentBuilder()
  //   .setTitle('Swagger example')
  //   .setDescription('Swagger description')
  //   .setVersion('1.0')
  //   .addTag('mytag')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('/swagger', app, document);

  await app.listen(3001);
}

bootstrap();
