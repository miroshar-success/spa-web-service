import {Module} from '@nestjs/common';
import {BotInitService} from './services/bot.init.service';
import {BotController} from './bot.controller';
import {BotEventHandler} from './bot.event.handler';
import {BotEventService} from './services/bot.event.service';

@Module({
    imports: [],
    controllers: [],
    providers: [BotInitService, BotEventHandler, BotEventService],
})
export class BotModule {
}
