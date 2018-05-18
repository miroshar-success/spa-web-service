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
        if (message.text.startsWith(config.FETCH_COMMAND)) {
            this.fetchHandler(message, response);
        }
        else if (message.text.startsWith(config.EXPLORE_COMMAND)) {
            this.fetchExploreHandler(message, response);
        }
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

    //TODO url
    private async fetchPost(fetchDtoOut: FetchDtoOut) {
        await axios.post('http://localhost:3000/fetchmq/fetch', fetchDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
            })
            .catch(error => {
            });
    }

    private fetchExploreHandler(message: viber.Message, response: viber.Response) {
        let url = message.text.replace(config.EXPLORE_COMMAND, '').trim();
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

    //TODO url
    private async fetchExplorePost(fetchExploreDtoOut: FetchExploreDtoOut) {
        await axios.post('http://localhost:3000/fetchmq/explore', fetchExploreDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
            })
            .catch(error => {
            });
    }
}