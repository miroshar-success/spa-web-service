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
import MqMethodType = MqApiTypes.MqMethodType;
import {MqApiGuards} from "../../dist/guards/mq.api.guards";
import isMqMethod = MqApiGuards.isMqMethod;



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
        return  function () {
            console.log(`Produce to ${proxy.root}.${proxy.clients} with connection ${proxy.connection}`);
            const result = target.apply(this, arguments);
            console.log("DATA:", result);
            return result;
        };
    }
    consume(target: Function) {
        const proxy = this;
        return function () {
            console.log(`Consume from ${proxy.root}.${proxy.clients} with connection ${proxy.connection}`);
            const result = target.apply(this, arguments);
            console.log("DATA:", result);
            return result;
        };
    }
    scan = (prototype: object): {key: string, method: MqMethodType}[] => Object.keys(prototype)
        .map(key => ({key, method: prototype[key]}))
        .filter(entry => isMqMethod(entry.method));

}

export default MqApiProxyService;


