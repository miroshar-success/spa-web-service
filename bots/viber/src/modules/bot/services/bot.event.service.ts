import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import * as config from '../../../../config';
import axios from 'axios';
import {AppLogger} from '../../../app.logger';
import {FetchDtoOut, FetchExploreDtoOut, Person, PersonInfo} from '../dto/fetch.dto.out';

@Injectable()
export class BotEventService {
    private readonly _logger: AppLogger = new AppLogger(BotEventService.name);

    messageReceivedHandler(message: viber.Message, response: viber.Response) {
        message.text.startsWith(config.FETCH_COMMAND) ?
            this.fetchHandler(message, response) :
            this.fetchExploreHandler(message, response);
    }

    private fetchHandler(message: viber.Message, response: viber.Response) {
        let textWithoutCommand = message.text.replace(config.FETCH_COMMAND, '').trim();
        let url = textWithoutCommand.slice(0, textWithoutCommand.indexOf(',')).trim();
        let sampleUrl = textWithoutCommand.replace(url, '').replace(',', '').trim();

        let fetchDtoOut = new FetchDtoOut(url,
            new Person(response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ),
            sampleUrl);
        this._logger.log(JSON.stringify(fetchDtoOut));
        this.fetchPost(fetchDtoOut);
    }

    private async fetchPost(fetchDtoOut: FetchDtoOut) {
        await axios.post('http://localhost:3000/fetch', fetchDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            /*.then(response => {
                this._logger.log('POST /fetch :' + JSON.stringify(fetchDtoOut));
            })
            .catch(error => {
            });*/
    }

    private fetchExploreHandler(message: viber.Message, response: viber.Response) {
        let url = message.text.replace(config.FETCH_EXPLORE_COMMAND, '').trim();
        let fetchExploreDtoOut = new FetchExploreDtoOut(url,
            new Person(response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ));
        this.fetchExplorePost(fetchExploreDtoOut);
    }

    private async fetchExplorePost(fetchExploreDtoOut: FetchExploreDtoOut) {
        await axios.post('http://localhost:3000/fetch/explore', fetchExploreDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                this._logger.log('POST /fetch/explore :' + JSON.stringify(fetchExploreDtoOut));
            })
            .catch(error => {
            });
    }
}