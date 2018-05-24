import {Injectable} from '@nestjs/common';
import {FetchExploreResultDto, FetchResultDto} from '../../../../../../api/src/modules/fetch/dto/fetch.dto';
import {BotMessageService} from '../services/bot.message.service';

@Injectable()
export class BotMqGwHandler {

    constructor(private readonly botMessageService: BotMessageService) {
    }

    async MqFetchExploreHandler(message) {
        let fetchExploreResultDto: FetchExploreResultDto = JSON.parse(message.content.toString('utf8'));
        this.botMessageService.sendCommandExploreMessage(fetchExploreResultDto);
    }

    async MqFetchResultHandler(message) {
        let fetchResultDto: FetchResultDto = JSON.parse(message.content.toString('utf8'));
        this.botMessageService.sendCommandFetchMessage(fetchResultDto);
    }

    //TODO mq message receiving
    async MqMessageHandler(message) {
        console.log('message' + JSON.stringify(message));
    }
}