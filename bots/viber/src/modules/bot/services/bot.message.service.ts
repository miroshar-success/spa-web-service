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
        let urlTitle = 'Test URL title';
        let urlImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStIRwDJnchMxep0AQQOkY6kB6aAf3ulRmRIl1CWU2PR5YDAyR6';

        this._bot.sendMessage(new viber.UserProfile(fetchExploreResultDto.person.personKey),
            fetchExploreResultDto.sampleUrls.map((url, index) => {
                return this.createFetchExploreMessage(index + 1, url, urlTitle, urlImage, fetchExploreResultDto.fetchUrl);
            })
        );
    }

    public async sendCommandFetchMessage(fetchResultDto: FetchResultDto) {
        let urlTitle = 'Test URL title';
        let urlImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStIRwDJnchMxep0AQQOkY6kB6aAf3ulRmRIl1CWU2PR5YDAyR6';
        let groupTitle = 'Test group URL title';

        this._bot.sendMessage(new viber.UserProfile(fetchResultDto.person.personKey),
            fetchResultDto.resultUrls.map(url => {
                return this.createFetchMessage(url, urlTitle, urlImage, groupTitle);
            })
        );
    }

    //TODO create DTO for /get
    public async sendCommandGetMessage(activeFetches: { clientName: ClientName, person: PersonCoreDto, fetchUrl: string }[]) {
        let groupTitle = 'Test group URL title';

        this._bot.sendMessage(new viber.UserProfile(activeFetches[0].person.personKey),
            activeFetches.map((activeFetch, index) => {
                return this.createCommandGetMessage(index + 1, activeFetch.fetchUrl, groupTitle);
            })
        );
    }

    public async sendTextMessage(userId: string, text: string) {
        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text(text));
    }

    public async sendRichMessage(userId: string, title: string, text: string) {
        let messageTemplate = {
            'Type': 'rich_media',
            'ButtonsGroupColumns': 6,
            'ButtonsGroupRows': 3,
            'BgColor': '#FFFFFF',
            'Buttons': [
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#FFFFFF">${title}</font>`,
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
                    'BgColor': '#665CAC',
                },
                {
                    'Columns': 6,
                    'Rows': 2,
                    'ActionType': 'none',
                    'Text': `${text}`,
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'center',
                }
            ]
        };

        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.RichMedia(messageTemplate));
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

    private createFetchExploreMessage(num: number, url: string, urlTitle: string, urlImage: string, groupUrl: string): viber.Message.RichMedia {
        let fetchExploreMessageTemplate = {
            'Type': 'rich_media',
            'ButtonsGroupColumns': 6,
            'ButtonsGroupRows': 7,
            'BgColor': '#FFFFFF',
            'Buttons': [
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#FFFFFF">№${num}: ${urlTitle}</font>`,
                    'TextSize': 'regular',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
                    'BgColor': '#665CAC',
                },
                {
                    'Columns': 6,
                    'Rows': 4,
                    'ActionType': 'none',
                    'Image': `${urlImage}`,
                    'BgColor': '#FFFFFF',
                },
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#212121">${url}</font>`,
                    'TextSize': 'small',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
                    'BgColor': '#FFFFFF',
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
                    'Silent': 'true',
                    'BgColor': '#665CAC',

                },
                {
                    'Columns': 3,
                    'Rows': 1,
                    'ActionType': 'reply',
                    'ActionBody': `/fetch ${groupUrl} ${url}`,
                    'Text': '<font color="#FFFFFF">FETCH</font>',
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'middle',
                    'Silent': 'true',
                    'BgColor': '#665CAC',
                }
            ]
        };

        return new viber.Message.RichMedia(fetchExploreMessageTemplate);
    }

    private createFetchMessage(url: string, urlTitle: string, urlImage: string, groupTitle: string): viber.Message.RichMedia {
        let fetchMessageTemplate = {
            'Type': 'rich_media',
            'ButtonsGroupColumns': 6,
            'ButtonsGroupRows': 7,
            'BgColor': '#FFFFFF',
            'Buttons': [
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#FFFFFF">${groupTitle}</font>`,
                    'TextSize': 'regular',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
                    'BgColor': '#665CAC',
                },
                {
                    'Columns': 6,
                    'Rows': 4,
                    'ActionType': 'none',
                    'BgColor': '#FFFFFF',
                    'Image': `${urlImage}`,
                },
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#212121">${urlTitle}</font>`,
                    'TextSize': 'small',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
                    'BgColor': '#FFFFFF',
                },
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'open-url',
                    'ActionBody': `${url}`,
                    'Text': '<font color="#FFFFFF">OPEN</font>',
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'middle',
                    'BgColor': '#665CAC',
                    'Silent': 'true'
                }
            ]
        };

        return new viber.Message.RichMedia(fetchMessageTemplate);
    }

    private createCommandGetMessage(num: number, url: string, groupTitle: string): viber.Message.RichMedia {
        let getMessageTemplate = {
            'Type': 'rich_media',
            'ButtonsGroupColumns': 6,
            'ButtonsGroupRows': 5,
            'BgColor': '#FFFFFF',
            'Buttons': [
                {
                    'Columns': 6,
                    'Rows': 1,
                    'ActionType': 'none',
                    'Text': `<font color="#FFFFFF">#${num}: ${groupTitle}</font>`,
                    'TextSize': 'small',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
                    'BgColor': '#665CAC',
                },
                {
                    'Columns': 6,
                    'Rows': 3,
                    'ActionType': 'none',
                    'Text': `${url}`,
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'left',
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
                    'TextHAlign': 'center',
                    'BgColor': '#665CAC',
                    'Silent': 'true'
                },
                {
                    'Columns': 3,
                    'Rows': 1,
                    'ActionType': 'reply',
                    'ActionBody': `/delete ${url}`,
                    'Text': '<font color="#FFFFFF">CANCEL</font>',
                    'TextSize': 'large',
                    'TextVAlign': 'middle',
                    'TextHAlign': 'center',
                    'BgColor': '#EF6062',
                    'Silent': 'true'
                }
            ]
        };
        return new viber.Message.RichMedia(getMessageTemplate);
    }
}

//TODO ! multilang