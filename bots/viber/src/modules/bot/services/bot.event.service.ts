import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import axios from 'axios';
import {AppLogger} from '../../../app.logger';
import {FetchDtoOut, ExploreDtoOut, PersonDtoOut, PersonInfo} from '../dto/bot.dto.out';
import * as urlRegex from 'url-regex';

@Injectable()
export class BotEventService {
    private readonly _logger: AppLogger = new AppLogger(BotEventService.name);

    public async messageReceivedHandler(message: viber.Message, response: viber.Response) {
        let exploreRegex = /^\/explore/i;
        let fetchRegex = /^\/fetch/i;
        let getRegex = /^\/get/i;
        let deleteRegex = /^\/delete/i;

        if (exploreRegex.test(message.text))
            this.commandExploreHandler(message, response);
        else if (fetchRegex.test(message.text))
            this.commandFetchHandler(message, response);
        else if (getRegex.test(message.text))
            this.commandGetHandler(message, response);
        else if (deleteRegex.test(message.text))
            this.commandDeleteHandler(message, response);
    }

    private async commandExploreHandler(message: viber.Message, response: viber.Response) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 1 ?
            this.commandExplorePost(new ExploreDtoOut(urls[0],
                new PersonDtoOut(response.userProfile.id,
                    new PersonInfo(
                        response.userProfile.id,
                        response.userProfile.name,
                        response.userProfile.country,
                        response.userProfile.language)
                )))
            :
            this._logger.warn('Ошибка! Используйте один валидный адрес');
    }

    private async commandFetchHandler(message: viber.Message, response: viber.Response) {
        let urls: string[] = message.text.match(urlRegex());

        this._logger.log(urls.toString());

        urls != null && urls.length == 2 ?
            this.commandFetchPost(new FetchDtoOut(urls[0],
                new PersonDtoOut(response.userProfile.id,
                    new PersonInfo(
                        response.userProfile.id,
                        response.userProfile.name,
                        response.userProfile.country,
                        response.userProfile.language)
                ),
                urls[1]))
            :
            this._logger.warn('Ошибка! Используйте валидный адрес страницы для анализа и адрес примера отслеживаемого товара');
    }

    private async commandGetHandler(message: viber.Message, response: viber.Response) {
        let personCoreDtoOut = new PersonDtoOut(response.userProfile.id,
            new PersonInfo(
                response.userProfile.id,
                response.userProfile.name,
                response.userProfile.country,
                response.userProfile.language)
        );

        this.commandGetPost(personCoreDtoOut);
    }

    private async commandDeleteHandler(message: viber.Message, response: viber.Response) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 1 ?
            this.commandDeletePost(new ExploreDtoOut(urls[0],
                new PersonDtoOut(response.userProfile.id,
                    new PersonInfo(
                        response.userProfile.id,
                        response.userProfile.name,
                        response.userProfile.country,
                        response.userProfile.language)
                )))
            :
            this._logger.warn('Ошибка! Используйте уже отслеживаемый адрес');
    }

    private async commandExplorePost(exploreDtoOut: ExploreDtoOut) {
        this._logger.log('/explore POST body: ' + JSON.stringify(exploreDtoOut));
        await axios.post('http://localhost:3000/fetch/explore', exploreDtoOut, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            this._logger.log('/explore request success');
        }).catch(error => {
            this._logger.error('/explore request error');
        });
    }

    private async commandFetchPost(fetchDtoOut: FetchDtoOut) {
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

    private async commandGetPost(personCoreDtoOut: PersonDtoOut) {
        await axios.post('http://localhost:3000/fetch/get', personCoreDtoOut, {
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

    private async commandDeletePost(exploreDtoOut: ExploreDtoOut) {
        await axios.delete('http://localhost:3000/fetch/get', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: exploreDtoOut
        }).then(response => {
            this._logger.log('/delete request success');
            this._logger.log(JSON.stringify(response.data));
        }).catch(error => {
            this._logger.log(JSON.stringify(error));
            this._logger.error('/delete request error');
        });
    }
}

//TODO сообщение об ошибках
//FIXME static url 'localhost'