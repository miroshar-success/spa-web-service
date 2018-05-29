import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import axios from 'axios';
import {AppLogger} from '../../../app.logger';
import {FetchDtoOut, FetchExploreDtoOut, PersonCoreDtoOut, PersonInfo} from '../dto/bot.dto.out';
import * as urlRegex from 'url-regex';
import {BotMessageService} from './bot.message.service';
import {LangEnum} from '../translator/lang.enum';
import * as translations from '../translator/translations.json';

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

        let lang = 'en';

        if (response.userProfile.language in LangEnum) {
            lang = response.userProfile.language;
        }

        if (exploreRegex.test(message.text))
            this.commandExploreHandler(message, response, lang);
        else if (fetchRegex.test(message.text))
            this.commandFetchHandler(message, response, lang);
        else if (getRegex.test(message.text))
            this.commandGetHandler(message, response, lang);
        else if (deleteRegex.test(message.text))
            this.commandDeleteHandler(message, response, lang);
        else if (helpRegex.test(message.text))
            this.botMessageService.sendHelpMessage(response.userProfile.id, lang);
        /*else
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                'Ошибка!', 'Неизвестная команда. Введите \n/help для получения информации', true);*/
    }

    private async commandExploreHandler(message: viber.Message, response: viber.Response, lang: string) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 1 ?
            this.commandExplorePost(new FetchExploreDtoOut(new PersonCoreDtoOut(
                response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ), urls[0]), lang)
            :
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                translations[lang]['error'], translations[lang]['message.explore.error'], true);
    }

    private async commandFetchHandler(message: viber.Message, response: viber.Response, lang: string) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 2 ?
            this.commandFetchPost(new FetchDtoOut(
                new PersonCoreDtoOut(response.userProfile.id,
                    new PersonInfo(
                        response.userProfile.id,
                        response.userProfile.name,
                        response.userProfile.country,
                        response.userProfile.language)
                ), urls[0], urls[1]), lang)
            :
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                translations[lang]['error'], translations[lang]['message.fetch.error'], true);
    }

    private async commandGetHandler(message: viber.Message, response: viber.Response, lang: string) {
        let personCoreDtoOut = new PersonCoreDtoOut(response.userProfile.id,
            new PersonInfo(
                response.userProfile.id,
                response.userProfile.name,
                response.userProfile.country,
                response.userProfile.language)
        );

        this.commandGetPost(personCoreDtoOut, lang);
    }

    private async commandDeleteHandler(message: viber.Message, response: viber.Response, lang: string) {
        let urls: string[] = message.text.match(urlRegex());

        urls != null && urls.length == 1 ?
            this.commandDeletePost(new FetchExploreDtoOut(new PersonCoreDtoOut(
                response.userProfile.id,
                new PersonInfo(
                    response.userProfile.id,
                    response.userProfile.name,
                    response.userProfile.country,
                    response.userProfile.language)
            ), urls[0]), lang)
            :
            this.botMessageService.sendSimpleRichMessage(response.userProfile.id,
                translations[lang]['error'], translations[lang]['"message.delete.error'], true);
    }

    private async commandExplorePost(fetchExploreDtoOut: FetchExploreDtoOut, lang: string) {
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
                    translations[lang]['error'], translations[lang]['message.explore.request.error'], true);
                this._logger.error('/explore request error');
            });
    }

    private async commandFetchPost(fetchDtoOut: FetchDtoOut, lang: string) {
        await axios.post('http://localhost:3000/fetch',
            fetchDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this._logger.log('/fetch request success');
                this.botMessageService.sendSimpleRichMessage(fetchDtoOut.person.personKey,
                    translations[lang]['info'], translations[lang]['message.fetch.request.info']);
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(fetchDtoOut.person.personKey,
                    translations[lang]['error'], translations[lang]['message.fetch.request.error'], true);
                this._logger.error('/fetch request error');
            });
    }

    //TODO /get meta in response
    private async commandGetPost(personCoreDtoOut: PersonCoreDtoOut, lang: string) {
        await axios.post('http://localhost:3000/fetch/get',
            personCoreDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                response.data.length != 0 ?
                    this.botMessageService.sendCommandGetMessage(response.data) :
                    this.botMessageService.sendSimpleRichMessage(personCoreDtoOut.personKey,
                        translations[lang]['info'], translations[lang]['message.get.request.info']);
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(personCoreDtoOut.personKey,
                    translations[lang]['error'], translations[lang]['message.get.request.error'], true);
                this._logger.error('/get request error - ' + error, error.stack);
            });
    }

    private async commandDeletePost(fetchExploreDtoOut: FetchExploreDtoOut, lang: string) {
        await axios.post('http://localhost:3000/fetch/delete',
            fetchExploreDtoOut, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this._logger.log('/delete request success');
                this.botMessageService.sendSimpleRichMessage(fetchExploreDtoOut.person.personKey,
                    translations[lang]['info'], translations[lang]['message.delete.request.info']);
            }).catch(error => {
                this.botMessageService.sendSimpleRichMessage(fetchExploreDtoOut.person.personKey,
                    translations[lang]['error'], translations[lang]['message.delete.request.error'], true);
                this._logger.error('/delete request error - ' + error, error.stack);
            });
    }
}
//TODO /explore - check if fetchUrl exists
//FIXME static url 'localhost'