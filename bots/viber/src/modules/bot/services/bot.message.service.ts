import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import {BotInitService} from './bot.init.service';
import {FetchExploreResultDto, FetchResultDto} from '../../../../../../api/src/modules/fetch/dto/fetch.dto';
import {ClientName} from '../../../../../../api/src/modules/clients/clients.enums';
import PersonCoreDto from '../../../../../../api/src/modules/person/person.dto';

@Injectable()
export class BotMessageService {
    private readonly _bot: viber.Bot;

    constructor(private readonly botInitService: BotInitService) {
        this._bot = this.botInitService.bot;
    }

    //TODO /explore message
    public async sendCommandExploreMessage(fetchExploreResultDto: FetchExploreResultDto) {
        console.log('sendExploreMessage');
    }

    public async sendCommandFetchMessage(fetchResultDto: FetchResultDto) {
        this._bot.sendMessage(new viber.UserProfile(fetchResultDto.person.personKey),
            fetchResultDto.resultUrls.map(url => {
                return new viber.Message.Text(`Новое объявление: \n${url}`);
            })
        );
    }

    //TODO create DTO for /get
    public async sendCommandGetMessage(activeFetches: { clientName: ClientName, person: PersonCoreDto, fetchUrl: string }[]) {
        this._bot.sendMessage(new viber.UserProfile(activeFetches[0].person.personKey),
            activeFetches.map((activeFetch, index) => {
                return this.createCommandGetMessage(index + 1, activeFetch.fetchUrl);
            })
        );
    }

    private createCommandGetMessage(number: number, url: string): viber.Message.RichMedia {
        let getMessageTemplate = {
            'Type': 'rich_media',
            'ButtonsGroupColumns': 6,
            'ButtonsGroupRows': 6,
            'BgColor': '#FFFFFF',
            'Buttons': [
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#FFFFFF">Отслеживание №${number}</font>`,
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'center',
                    'BgColor': '#512DA8',
                },
                {
                    'Columns': 6,
                    'Rows': 4,
                    'ActionType': 'none',
                    'Text': `${url}`,
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'center',
                    'BgColor': '#FFFFFF'
                },
                {
                    'Columns': 3,
                    'Rows': 1,
                    'ActionType': 'open-url',
                    'ActionBody': `${url}`,
                    'Text': '<font color="#FFFFFF">OPEN</font>',
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'middle',
                    'BgColor': '#7C4DFF',
                },
                {
                    'Columns': 3,
                    'Rows': 1,
                    'ActionType': 'reply',
                    'ActionBody': `/delete ${url}`,
                    'Text': '<font color="#FFFFFF">STOP</font>',
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'middle',
                    'BgColor': '#512DA8'
                }
            ]
        };
        return new viber.Message.RichMedia(getMessageTemplate);
    }

    public async sendTextMessage(userId: string, text: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text(text));
    }

    public async sendCommandExploreError(userId: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text('Ошибка! Используйте один валидный адрес'));
    }

    public async sendCommandFetchError(userId: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text('Ошибка! Используйте валидный адрес страницы для анализа и адрес примера отслеживаемого товара'));
    }

    public async sendCommandDeleteError(userId: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text('Ошибка! Используйте валидный адрес'));
    }

    public async sendHelpMessage(userId: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text(
                '/explore [explore url] - исследовать ссылку' +
                '\n/fetch [explore url] [fetch url] - отслеживать ссылки данного типа' +
                '\n/get - получить список активных отсеживаний' +
                '\n/delete [explore url] - остановить отслеживание' +
                '\n/help - помощь'));
    }

    public async sendNotCommandMessage(userId: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text('Неизвестная команда. Введите /help для получения информации'));
    }
}

//TODO ! multilang