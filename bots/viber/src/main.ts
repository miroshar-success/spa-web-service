import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {AppLogger} from './app.logger';
import * as config from '../config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new AppLogger('Main')
    });
    await app.listen(config.SERVER_PORT);
}

bootstrap();
