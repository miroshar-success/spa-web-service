import {Injectable} from '@nestjs/common';
import * as viber from 'viber-bot';
import axios from 'axios';
import {AppLogger} from '../../../app.logger';

@Injectable()
export class BotMessageService {
    private readonly _logger: AppLogger = new AppLogger(BotMessageService.name);

    async fetch(messageText: string) {

    }
}