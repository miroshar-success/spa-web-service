import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import {BotInitService} from './services/bot.init.service';
import {AppLogger} from '../../app.logger';
import {BotEventService} from './services/bot.event.service';
import {BotMessageService} from './services/bot.message.service';

@Injectable()
export class BotEventHandler {
    private readonly _logger: AppLogger = new AppLogger(BotEventHandler.name);
    private readonly _bot: viber.Bot;

    constructor(private readonly botInitService: BotInitService,
                private readonly botEventService: BotEventService) {
        this._bot = this.botInitService.bot;
        this.initEventListener();
    }

    private initEventListener(){
        this.eventSubscribe();
        this.eventMsgReceived();
    }

    private eventSubscribe() {
        this._bot.on(viber.Events.SUBSCRIBED, response => {
            this.botEventService.subscribedHandler(response);
        });
    }


    private eventMsgReceived() {
        this._bot.on(viber.Events.MESSAGE_RECEIVED, (message, response) => {
            this.botEventService.messageReceivedHandler(message, response);
        });
    }
}

//TODO subscribe event handler