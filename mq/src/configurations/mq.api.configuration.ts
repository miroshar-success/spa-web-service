import "reflect-metadata";
import {MqApiTypes} from "../types/mq.api.types";
import ConfigurationParam = MqApiTypes.ConfigurationParam;
import {MqApiConstants} from "../constants/mq.api.constants";
import MQ_NAME_METADATA = MqApiConstants.MQ_NAME_METADATA;
import MQ_GATEWAY_METADATA = MqApiConstants.MQ_GATEWAY_METADATA;
import {Connection} from "amqplib";
import {MqDecorators} from "../decorators/mq.api.decorators";
import ComponentScan = MqDecorators.ComponentScan;
import EnableMqConfiguration = MqDecorators.EnableMqConfiguration;
import {MqApiGuards} from "../guards/mq.api.guards";
import isMqMethod = MqApiGuards.isMqMethod;
import MqMethodType = MqApiTypes.MqMethod;
import MqWrapper = MqApiTypes.MqWrapper;
import MqConsumerType = MqApiTypes.MqConsumerType;
import MqProducerType = MqApiTypes.MqProducerType;
import isMqConsumer = MqApiGuards.isMqConsumer;
import isMqProducer = MqApiGuards.isMqProducer;
import MqConsumer = MqDecorators.MqConsumer;
import MqProducer = MqDecorators.MqProducer;
import {MqApiConfig} from "../../../api/src/modules/fetch/mq";
import {Service} from "../index";





@EnableMqConfiguration({
    root: 'root',
    clients:['telegram']
})
@ComponentScan({components: [Service, Number]})
export class Configuration {

    // private readonly wrap: MqWrapper<MqMethodType> = connect => target => connect(target);
    private connectConsumer: MqWrapper<MqConsumerType>;
    private connectProducer: MqWrapper<MqProducerType>;


    constructor(private readonly connection: Connection){
        this.connectConsumer = this.consume(this.config)(this.connection);
        this.connectProducer = this.produce(this.config)(this.connection);
    }

    run(){
        this.components
            .map(component => component.prototype)
            .forEach(prototype => {
                const mqMethods = this.scan(prototype);
                console.log('SCAN: ', mqMethods);
                mqMethods.filter(mqMethod => isMqConsumer(mqMethod)).forEach(({key,method}) => prototype[key] = this.connectConsumer(method));
                mqMethods.filter(mqMethod => isMqProducer(mqMethod)).forEach(({key,method}) => prototype[key] = this.connectProducer(method));
        });
    }

    private get config(): MqApiConfig {
        return (this as any).config;
    }
    private get components(): Function[]{
        return (this as any).root;
    }


    private produce = (config: MqApiConfig) => (connection: Connection) => (target: MqProducerType) => (...args: any[]) => {
        console.log("Publish with connection ...");
        const result = target.apply(this, args);
        console.log("DATA:", result)
        return result;
    };
    private consume = (config: MqApiConfig) => (connection: Connection) => (target: MqConsumerType) => (...args: any[]) => {
        console.log("Consume with connection ...");
        const result = target.apply(this, args);
        console.log("DATA:", result)
        return result;
    };
    private scan = (prototype: object): {key: string, method: MqMethodType}[] => Object.keys(prototype)
                                                                                  .map(key => ({key, method: prototype[key]}))
                                                                                  .filter(entry => isMqMethod(entry.method));

}







// new Configuration({root:'root',clients:['telegram'],connection:{}}, [MqGwConfiguration]);