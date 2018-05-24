import {Injectable} from '@nestjs/common';
import {MqGwDecorators} from '../../../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators';
import MqGwConfig = MqGwDecorators.MqGwConfig;
import {BotMqGw} from '../mq/bot.mq.gw';


@Injectable()
@MqGwConfig({
         root: 'beagle',
         clients:['viber'],
         components:[BotMqGw],
         connection: {
             hostname: "beagle-rabbit-mq",
             username: "rabbitmq",
             password: "rabbitmq"
         }
})
export class MqGwViberConfig {}