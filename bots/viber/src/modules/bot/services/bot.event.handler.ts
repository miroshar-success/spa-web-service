import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import {BotInitService} from './bot.init.service';
import {AppLogger} from '../../../app.logger';
import {BotEventService} from './bot.event.service';

@Injectable()
export class BotEventHandler {
    private readonly _logger: AppLogger = new AppLogger(BotEventHandler.name);

    constructor(private readonly botInitService: BotInitService,
                private readonly botEventService: BotEventService) {
        this.eventSubscribe();
    }

    private eventSubscribe() {
        let bot: viber.Bot = this.botInitService.bot;

        bot.on(viber.Events.MESSAGE_RECEIVED, (message, response) => {
            this.botEventService.messageReceivedHandler(message, response);
        });
    }
}