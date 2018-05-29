import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import {BotInitService} from './services/bot.init.service';
import {AppLogger} from '../../app.logger';
import {BotEventService} from './services/bot.event.service';

@Injectable()
export class BotEventHandler {
    private readonly _logger: AppLogger = new AppLogger(BotEventHandler.name);
    private readonly _bot: viber.Bot;

    constructor(private readonly botInitService: BotInitService,
                private readonly botEventService: BotEventService) {
        this._bot = this.botInitService.bot;
        //  this.eventSubscribe();
        this.eventMsgReceived();
    }

    /*private eventSubscribe() {
        this._bot.on(viber.Events.CONVERSATION_STARTED, response => {
            this.sendTextMessage('Thanks for subscribe!', response);
            this.sendHelpMessage(response);
        });
    }*/


    private eventMsgReceived() {
        //Wqp88ccqY9fgk9lIH0y5LQ==

        this._bot.on(viber.Events.MESSAGE_RECEIVED, (message, response) => {
            /*this._bot.sendMessage(new viber.UserProfile('Wqp88ccqY9fgk9lIH0y5LQ=='),
                new viber.Message.RichMedia(''));*/
            this.botEventService.messageReceivedHandler(message, response);
        });
    }
}

//TODO subscribe event handler