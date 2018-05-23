import {Module} from '@nestjs/common';
import {BotInitService} from './services/bot.init.service';
import {BotEventHandler} from './bot.event.handler';
import {BotEventService} from './services/bot.event.service';
import {BotMqGw} from './bot.mq.gw';

@Module({
    imports: [],
    controllers: [],
    providers: [BotInitService, BotEventHandler, BotEventService, BotMqGw],
})
export class BotModule {
}
