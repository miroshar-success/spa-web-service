import {MqApiTypes} from "../types/mq.api.types";
import {Connection} from "amqplib";
import MqConsumerType = MqApiTypes.MqConsumerType;
import MqProducerType = MqApiTypes.MqProducerType;
import ConfigurationParam = MqApiTypes.ConfigurationParam;
import Consumable = MqApiTypes.Consumable;
import Producable = MqApiTypes.Producable;
import MqApiProducer = MqApiTypes.MqApiProducer;
import MqApiConsumer = MqApiTypes.MqApiConsumer;
import ProxyConfig = MqApiTypes.ProxyConfig;



class MqApiProxyService implements MqApiProducer, MqApiConsumer {

    private readonly root: string;
    private readonly clients: string[];
    private readonly connection: Connection;

    constructor({root, clients, connection}: ProxyConfig){
        this.root = root;
        this.clients = clients;
        this.connection = connection;
    }

    produce(target: Function) {
        const proxy = this;
        return function (...args: any[]) {
            console.log(`Produce to ${proxy.root}.${proxy.clients} with connection ${proxy.connection}`);
            const result = target.apply(this, args);
            console.log("DATA:", result)
            return result;
        };
    }
    consume(target: Function) {
        const proxy = this;
        return function (...args: any[]) {
            console.log(`Consume from ${proxy.root}.${proxy.clients} with connection ${proxy.connection}`);
            const result = target.apply(this, args);
            console.log("DATA:", result)
            return result;
        };
    }
}

export default MqApiProxyService;