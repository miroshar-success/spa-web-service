import {Module} from '@nestjs/common';
import {BotInitService} from './services/bot.init.service';
import {BotController} from './bot.controller';
import {BotEventService} from './services/bot.event.service';
import {BotMessageService} from './services/bot.message.service';

@Module({
    imports: [],
    controllers: [BotController],
    providers: [BotInitService, BotEventService, BotMessageService],
})
export class BotModule {
}
