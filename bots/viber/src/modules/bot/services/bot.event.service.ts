import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import * as config from '../../../../config';
import axios from 'axios';
import {AppLogger} from '../../../app.logger';
import {FetchDtoOut, FetchExploreDtoOut, Person, PersonCoreDtoOut, PersonInfo} from '../dto/fetch.dto.out';
import urlRegexp from 'url-regex';

@Injectable()
export class BotEventService {
    private readonly _logger: AppLogger = new AppLogger(BotEventService.name);

    messageReceivedHandler(message: viber.Message, response: viber.Response) {
        let exploreRegex = /^\/explore/i;
        let fetchRegex = /^\/fetch/i;
        let getRegex = /^\/get/i;

        if (exploreRegex.test(message.text))
            this.exploreHandler(message, response);
        else if (fetchRegex.test(message.text))
            this.fetchHandler(message, response);
        else if (getRegex.test(message.text))
            this.getHandler(message, response);
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
        this.fetchPost(fetchDtoOut);
    }

    private exploreHandler(message: viber.Message, response: viber.Response) {
        let url = message.text.replace(config.EXPLORE_COMMAND, '').trim();
        let fetchExploreDtoOut = new FetchExploreDtoOut(url,
            new Person(response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ));
        this._logger.log('EXPLORE OBJECT: ' + JSON.stringify(fetchExploreDtoOut));
        this.fetchExplorePost(fetchExploreDtoOut);
    }

    private getHandler(message: viber.Message, response: viber.Response) {
        let personCoreDtoOut = new PersonCoreDtoOut(response.userProfile.id,
            new PersonInfo(
                response.userProfile.id,
                response.userProfile.name,
                response.userProfile.country,
                response.userProfile.language)
        );

        this.fetchGetPost(personCoreDtoOut);
    }

    //TODO url
    private async fetchPost(fetchDtoOut: FetchDtoOut) {
        await axios.post('http://localhost:3000/fetch', fetchDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this._logger.log('/fetch request success');
        }).catch(error => {
            this._logger.error('/fetch request error');
        });
    }

    //TODO url
    private async fetchExplorePost(fetchExploreDtoOut: FetchExploreDtoOut) {
        await axios.post('http://localhost:3000/fetch/explore', fetchExploreDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this._logger.log('/explore request success');
        }).catch(error => {
            this._logger.error('/explore request error');
        });
    }

    private async fetchGetPost(personCoreDtoOut: PersonCoreDtoOut) {
        await axios.post('http://localhost:3000/fetch/get', PersonCoreDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this._logger.log('/get request success');
            this._logger.log(JSON.stringify(response.data));
        }).catch(error => {
            this._logger.log(JSON.stringify(error));
            this._logger.error('/get request error');
        });
    }
}