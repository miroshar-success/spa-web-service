import {Module} from '@nestjs/common';
import {BotInitService} from './services/bot.init.service';
import {BotEventHandler} from './bot.event.handler';
import {BotEventService} from './services/bot.event.service';
import {BotMqGw} from './mq/bot.mq.gw';
import {BotMessageService} from './services/bot.message.service';
import {BotMqGwHandler} from './mq/bot.mq.gw.handler';

@Module({
    imports: [],
    controllers: [],
    providers: [
        BotInitService,
        BotEventHandler,
        BotEventService,
        BotMessageService,
        BotMqGw,
        BotMqGwHandler
    ]
})
export class BotModule {
}
