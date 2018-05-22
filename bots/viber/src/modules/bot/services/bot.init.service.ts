import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import * as ngrok from 'ngrok';
import * as http from 'http';
import {AppLogger} from '../../../app.logger';
import * as config from '../../../../config';

@Injectable()
export class BotInitService {
    private readonly _logger: AppLogger = new AppLogger(BotInitService.name);
    private readonly _bot: viber.Bot;

    constructor() {
        this._bot = new viber.Bot({
            authToken: config.VIBER_AUTH_TOKEN,
            name: config.VIBER_BOT_NAME,
            avatar: config.VIBER_BOT_AVATAR_URL
        });
        this.setBotTunnel();
    }

    public get bot(): viber.Bot {
        return this._bot;
    }

    private async setBotTunnel() {
        try {
            let url: string = await ngrok.connect(config.VIBER_BOT_PORT);
            http.createServer(this._bot.middleware()).listen(config.VIBER_BOT_PORT, () => this._bot.setWebhook(url));
            this._logger.log('Tunnel URL: ' + url);

        } catch (error) {
            this._logger.error('Failed creating ngrok tunnel', error.stack);
        }
    }
}
