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

            //this.sendKeybord(bot, response);

            this.sendTextMessages(['one', 'two', 'three'], response.userProfile);
            this._logger.log('msg');


            //this.botEventService.messageReceivedHandler(message, response);
        });
    }

    private sendKeybord(bot, response): void {
        const SAMPLE_KEYBOARD = {
            'Type': 'keyboard',
            'DefaultHeight': true,
            'Buttons': [
                {
                    'ActionType': 'reply',
                    'ActionBody': 'reply to me',
                    'Text': 'Key text',
                    'TextSize': 'regular'
                }
            ]
        };

        bot.sendMessage(response.userProfile, [
            new viber.Message.Keyboard(SAMPLE_KEYBOARD)
        ]);
    }

    private sendHelpMessage(response): void {
        this._logger.log('HELP MSG');
        this._bot.sendMessage(response.userProfile, [
            new viber.Message.Text('HELP')
        ]);
    }


    private sendTextMessages(messages: Array<string>, userProfile): void {
        this._bot.sendMessage(userProfile, messages.map((key, value) => {
                new viber.Message.Text(value)
            })
        );
    }
}