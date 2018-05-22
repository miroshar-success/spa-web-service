import {Connection} from "amqplib";
import {FetchController} from "../fetch/fetch.controller";
import MqGwDecorators from '../../../../lib/mq-gw-api/src/decorators/mq.api.decorators';
MqGwDecorators.


@EnableMqGw({
         root: 'root',
         clients:['telegram'],
         components:[FetchController]
})
class MqGwStarter {

    constructor(connection: Connection){}
}
export default MqGwStarter;