import {Configuration} from "./configurations/mq.api.configuration";
import {Connection} from "amqplib";
import {MqDecorators} from "./decorators/mq.api.decorators";
import MqConsumer = MqDecorators.MqConsumer;
import MqProducer = MqDecorators.MqProducer;



new Configuration({} as Connection).run();



export class Service {
    constructor(public bar: string){
        console.log('INIT: ', bar);
    }
    @MqConsumer({name:'fetch', gateway:'clientKey'})
    call1(req: string){
        return "MQ 2-1: " + req;
    }
    @MqProducer({name:'fetch', gateway:'clintKey'})
    call2(req: string){
        return "MQ 2-2: " + req;
    }
    foo(){
        console.log('foo')
        return 'foo';
    }
}