import {Injectable} from '@nestjs/common';
import {MqGwDecorators} from '../../../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators';
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
import {BotMqGwHandler} from './bot.mq.gw.handler';

@Injectable()
export class BotMqGw {
    static THIS: BotMqGw;

    constructor(private readonly botMqGwHandler: BotMqGwHandler) {
        BotMqGw.THIS = this;
    }

    @MqGwConsumer({name: 'fetchExplore', gateway: 'person.clientName'})
    async consumeFetchExplore(message: object) {
        BotMqGw.THIS.botMqGwHandler.MqFetchExploreHandler(message);
    }

    @MqGwConsumer({name: 'fetchResult', gateway: 'person.clientName'})
    async consumeFetchResult(message: object) {
        BotMqGw.THIS.botMqGwHandler.MqFetchResultHandler(message);
    }

    @MqGwConsumer({name: 'fetchMessage', gateway: 'person.clientName'})
    async consumeMessage(message: object) {
        BotMqGw.THIS.botMqGwHandler.MqMessageHandler(message);
    }
}
