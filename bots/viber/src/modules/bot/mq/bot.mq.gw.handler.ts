import {Injectable} from '@nestjs/common';
import {BotMessageService} from '../services/bot.message.service';

@Injectable()
export class BotMqGwHandler {

    constructor(private readonly botMessageService: BotMessageService) {
    }

    async MqFetchExploreHandler(message) {
        this.botMessageService.sendCommandExploreMessage(message);
    }

    async MqFetchResultHandler(message) {
        this.botMessageService.sendCommandFetchMessage(message);
    }

    //TODO mq message receiving
    async MqMessageHandler(message) {
        console.log('message' + JSON.stringify(message));
    }
}