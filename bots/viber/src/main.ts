import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {AppLogger} from './app.logger';
import * as config from '../config';
import {MqGwViberConfig} from './modules/bot/config/mq.gw.viber.config';

async function bootstrap() {
    new MqGwViberConfig().enable();

    const app = await NestFactory.create(AppModule, {
        logger: new AppLogger('Main')
    });
    await app.listen(config.SERVER_PORT);
}

bootstrap();
