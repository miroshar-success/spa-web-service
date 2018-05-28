import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import axios from 'axios';
import {AppLogger} from '../../../app.logger';
import {
    FetchDtoOut, FetchExploreDtoOut, PersonCoreDtoOut, PersonInfo
} from '../dto/bot.dto.out';
import * as urlRegex from 'url-regex';
import {BotMessageService} from './bot.message.service';

@Injectable()
export class BotEventService {
    private readonly _logger: AppLogger = new AppLogger(BotEventService.name);

    constructor(private readonly botMessageService: BotMessageService) {
    }

    public async messageReceivedHandler(message: viber.Message, response: viber.Response) {
        let exploreRegex = /^\/explore/i;
        let fetchRegex = /^\/fetch/i;
        let getRegex = /^\/get/i;
        let deleteRegex = /^\/delete/i;
        let helpRegex = /^\/help/i;

        if (exploreRegex.test(message.text))
            this.commandExploreHandler(message, response);
        else if (fetchRegex.test(message.text))
            this.commandFetchHandler(message, response);
        else if (getRegex.test(message.text))
            this.commandGetHandler(message, response);
        else if (deleteRegex.test(message.text))
            this.commandDeleteHandler(message, response);
        else if (helpRegex.test(message.text))
            this.botMessageService.sendHelpMessage(response.userProfile.id);
        else
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                'Ошибка!', 'Неизвестная команда. Введите \n/help для получения информации', true);
    }

    private async commandExploreHandler(message: viber.Message, response: viber.Response) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 1 ?
            this.commandExplorePost(new FetchExploreDtoOut(new PersonCoreDtoOut(
                response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ), urls[0]))
            :
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                'Ошибка!', 'Используйте один валидный адрес', true);
    }

    private async commandFetchHandler(message: viber.Message, response: viber.Response) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 2 ?
            this.commandFetchPost(new FetchDtoOut(
                new PersonCoreDtoOut(response.userProfile.id,
                    new PersonInfo(
                        response.userProfile.id,
                        response.userProfile.name,
                        response.userProfile.country,
                        response.userProfile.language)
                ), urls[0], urls[1]))
            :
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                'Ошибка!', 'Используйте валидный адрес страницы для анализа и адрес примера отслеживаемого товара', true);
    }

    private async commandGetHandler(message: viber.Message, response: viber.Response) {
        let personCoreDtoOut = new PersonCoreDtoOut(response.userProfile.id,
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
            this.commandDeletePost(new FetchExploreDtoOut(new PersonCoreDtoOut(
                response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ), urls[0]))
            :
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                'Ошибка!', 'Используйте валидный адрес', true);
    }

    private async commandExplorePost(fetchExploreDtoOut: FetchExploreDtoOut) {
        await axios.post('http://localhost:3000/fetch/explore',
            fetchExploreDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this._logger.log('/explore request success');
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(fetchExploreDtoOut.person.personKey,
                    'Ошибка!', 'Не удалось получить примеры. Попробуйте еще раз', true);
                this._logger.error('/explore request error');
            });
    }

    private async commandFetchPost(fetchDtoOut: FetchDtoOut) {
        await axios.post('http://localhost:3000/fetch',
            fetchDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this._logger.log('/fetch request success');
                this.botMessageService.sendSimpleRichMessage(fetchDtoOut.person.personKey,
                    'Информация', 'Отслеживание активировано');
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(fetchDtoOut.person.personKey,
                    'Ошибка!', 'Не удалось начать отслеживание. Попробуйте еще раз', true);
                this._logger.error('/fetch request error');
            });
    }

    private async commandGetPost(personCoreDtoOut: PersonCoreDtoOut) {
        await axios.post('http://localhost:3000/fetch/get',
            personCoreDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                response.data.length != 0 ?
                    this.botMessageService.sendCommandGetMessage(response.data) :
                    this.botMessageService.sendSimpleRichMessage(personCoreDtoOut.personKey, 'Информация', 'У вас нет активных отслеживаний');
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(personCoreDtoOut.personKey,
                    'Ошибка!', 'Не удалось получить список активных отслеживаний. Попробуйте еще раз', true);
                this._logger.error('/get request error - ' + error, error.stack);
            });
    }

    private async commandDeletePost(fetchExploreDtoOut: FetchExploreDtoOut) {
        await axios.post('http://localhost:3000/fetch/delete',
            fetchExploreDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this._logger.log('/delete request success');
                this.botMessageService.sendSimpleRichMessage(fetchExploreDtoOut.person.personKey,
                    'Информация', 'Отслеживание остановлено');
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(fetchExploreDtoOut.person.personKey,
                    'Ошибка!', 'Не удалось остановить отслеживание. Попробуйте еще раз', true);
                this._logger.error('/delete request error - ' + error, error.stack);
            });
    }
}

//FIXME static url 'localhost'