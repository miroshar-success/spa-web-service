import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import axios from 'axios';
import {BotInitService} from './bot.init.service';
import {AppLogger} from '../../../app.logger';
import {BotMessageService} from './bot.message.service';
import {Person, PersonInfo} from '../dto/person';
import {FetchExploreDtoOut} from '../dto/fetch.dto.out';
import {async} from 'rxjs/internal/scheduler/async';

@Injectable()
export class BotEventService {
    private readonly _logger: AppLogger = new AppLogger(BotEventService.name);

    constructor(private readonly botInitService: BotInitService,
                private readonly botMessageService: BotMessageService) {
        this.eventSubscribe();
    }

    private async eventSubscribe() {
        let bot: viber.Bot = this.botInitService.bot;

        bot.on(viber.Events.MESSAGE_RECEIVED, (message, response) => {
            //this._logger.log(JSON.stringify(response.userProfile));

            let fetchExploreDtoOut = new FetchExploreDtoOut(message.text,
                new Person(response.userProfile.id,
                    new PersonInfo(
                        response.userProfile.id,
                        response.userProfile.name,
                        response.userProfile.country,
                        response.userProfile.language)
                ));

            this.fetchExplorePost(fetchExploreDtoOut);

            //this._logger.log(JSON.stringify(fetchExploreDtoOut));

            let me = new viber.UserProfile(response.userProfile.id);
            let urlMsg = new viber.Message.Text('http://viber.com');

            bot.sendMessage(me, [
                message,
                urlMsg
            ]);

            // /this.botMessageService.fetch(message);
            // Echo's back the message to the client.
            //response.send(message);
        });
    }

    async fetchExplorePost(fetchExploreDtoOut: FetchExploreDtoOut) {
        this._logger.log(JSON.stringify(fetchExploreDtoOut));
        await axios.post('http://localhost:3000/fetch/explore', fetchExploreDtoOut, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
}