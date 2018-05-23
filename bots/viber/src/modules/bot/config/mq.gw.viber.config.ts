import {Injectable} from '@nestjs/common';
import {MqGwDecorators} from '../../../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators';
import EnableMqGw = MqGwDecorators.EnableMqGw;
import {BotMqGw} from '../bot.mq.gw';


@Injectable()
@EnableMqGw({
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