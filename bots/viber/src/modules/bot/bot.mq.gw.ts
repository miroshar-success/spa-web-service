import {Injectable} from '@nestjs/common';
import {MqGwDecorators} from '../../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators';
import MqGwConsumer = MqGwDecorators.MqGwConsumer;

@Injectable()
export class BotMqGw {
    constructor() {}

    @MqGwConsumer({name:'fetchExplore', gateway:'clientKey'})
    async publishFetchExplore(message: object) {
        console.log("publishFetchExplore: " + JSON.stringify(message))
    }

    @MqGwConsumer({name:'fetchResult', gateway:'clientKey'})
    async publishFetchResult(message: object) {
        console.log("publishFetchResult"+ JSON.stringify(message))
    }

    @MqGwConsumer({name:'fetchMessage', gateway:'clientKey'})
    async publishMessage(message: object) {
        console.log("message"+ JSON.stringify(message))
    }
}

//TODO отправка пользователю
