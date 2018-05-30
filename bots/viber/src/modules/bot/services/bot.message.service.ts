import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import {BotInitService} from './bot.init.service';
import {
    FetchExploreDto, FetchExploreResultDto,
    FetchResultDto
} from '../../../../../../api/src/modules/fetch/dto/fetch.dto';
import {ClientName} from '../../../../../../api/src/modules/clients/clients.enums';
import PersonCoreDto from '../../../../../../api/src/modules/person/person.dto';
import * as translations from '../translator/translations.json';
import {LangEnum} from '../translator/lang.enum';

@Injectable()
export class BotMessageService {
    private readonly _bot: viber.Bot;

    constructor(private readonly botInitService: BotInitService) {
        this._bot = this.botInitService.bot;
    }

    public async sendCommandExploreMessage(fetchExploreResultDto: FetchExploreResultDto) {
        let lang = 'en';

        if (fetchExploreResultDto.person.personInfo && fetchExploreResultDto.person.personInfo['language'] in LangEnum) {
            lang = fetchExploreResultDto.person.personInfo['language'];
        }


        this._bot.sendMessage(new viber.UserProfile(fetchExploreResultDto.person.personKey),
            fetchExploreResultDto.samples
                .map((sample, index) => {
                    if (index < 5)
                        return this.createFetchExploreMessage(index + 1, sample.url, sample.meta.title, sample.meta.image, fetchExploreResultDto.fetchUrl, lang);
                })
        );
    }

    public async sendCommandFetchMessage(fetchResultDto: FetchResultDto) {
        let lang = 'en';

        if (fetchResultDto.person.personInfo && fetchResultDto.person.personInfo['language'] in LangEnum) {
            lang = fetchResultDto.person.personInfo['language'];
        }

        this._bot.sendMessage(new viber.UserProfile(fetchResultDto.person.personKey),
            fetchResultDto.resultUrls.map(result => {
                return this.createFetchMessage(result.url, result.meta.title, result.meta.image, fetchResultDto.meta.title, lang);
            })
        );
    }

    public async sendCommandGetMessage(fetchExploreDtos: FetchExploreDto[]) {
        let lang = 'en';

        if (fetchExploreDtos[0].person.personInfo && fetchExploreDtos[0].person.personInfo['language'] in LangEnum) {
            lang = fetchExploreDtos[0].person.personInfo['language'];
        }

        this._bot.sendMessage(new viber.UserProfile(fetchExploreDtos[0].person.personKey),
            fetchExploreDtos.map((activeFetch, index) => {
                return this.createCommandGetMessage(index + 1, activeFetch.fetchUrl, activeFetch.meta.title, lang);
            })
        );
    }

    public async sendSimpleRichMessage(userId: string, title: string, text: string, error?: boolean) {
        let titleBgColor = '#665CAC';
        if (error) {
            titleBgColor = '#EF6062';
        }
        let messageTemplate = {
            'Type': 'rich_media',
            'ButtonsGroupColumns': 6,
            'ButtonsGroupRows': 4,
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
                    'BgColor': `${titleBgColor}`,
                },
                {
                    'Columns': 6,
                    'Rows': 3,
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

    public async sendHelpMessage(userId: string, lang: string) {
        let text = translations[lang]['message.help'];

        this._bot.sendMessage(new viber.UserProfile(userId),
            new viber.Message.Text(text));
    }


    private createFetchExploreMessage(num: number, url: string, urlTitle: string, urlImage: string, groupUrl: string, lang: string): viber.Message.RichMedia {
        let openButton = translations[lang]['button.open'];
        let fetchButton = translations[lang]['button.fetch'];

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
                    'Text': `<font color="#FFFFFF">${openButton}</font>`,
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
                    'Text': `<font color="#FFFFFF">${fetchButton}</font>`,
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

    private createFetchMessage(url: string, urlTitle: string, urlImage: string, groupTitle: string, lang: string): viber.Message.RichMedia {
        let openButton: string = translations[lang]['button.open'];

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
                    'Text': `<font color="#FFFFFF">${openButton}</font>`,
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

    private createCommandGetMessage(num: number, url: string, groupTitle: string, lang: string): viber.Message.RichMedia {
        let openButton: string = translations[lang]['button.open'];
        let stopButton = translations[lang]['button.stop'];

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
                    'Text': `<font color="#FFFFFF">№${num}: ${groupTitle}</font>`,
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
                    'Text': `<font color="#FFFFFF">${openButton}</font>`,
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
                    'Text': `<font color="#FFFFFF">${stopButton}</font>`,
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