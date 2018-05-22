import "reflect-metadata";
import {Connection} from "amqplib";
import {MqApiTypes} from "../types/mq.api.types";
import ConfigurationParam = MqApiTypes.ConfigurationParam;
import {MqApiDecorators} from "../decorators/mq.api.decorators";
import EnableMqApi = MqApiDecorators.EnableMqApi;
import {MqApiGuards} from "../guards/mq.api.guards";
import isMqMethod = MqApiGuards.isMqMethod;
import MqMethodType = MqApiTypes.MqMethodType;
import MqConsumerType = MqApiTypes.MqConsumerType;
import MqProducerType = MqApiTypes.MqProducerType;
import isMqConsumer = MqApiGuards.isMqConsumer;
import isMqProducer = MqApiGuards.isMqProducer;
import MqConsumer = MqApiDecorators.MqConsumer;
import MqProducer = MqApiDecorators.MqProducer;
import MqApiProxyService from '../services/mq.api.proxy.service';
import MqApiScanService from '../services/mq.api.scan.service';
import Producable = MqApiTypes.Producable;
import Consumable = MqApiTypes.Consumable;
import MqApiProducer = MqApiTypes.MqApiProducer;
import MqApiConsumer = MqApiTypes.MqApiConsumer;
import Runnable = MqApiTypes.Runnable;
import ProxyConfig = MqApiTypes.ProxyConfig;


/**
 *
 * Example:
 *
 * @EnableMqApi({
 *      root: 'root',
 *      clients:['telegram'],
 *      components:[Service, Number]
 * })
 * class Test {
 *
 *   constructor(connection: Connection){}
 *
 * }
 *
 *
 */

export abstract class MqApiConfiguration implements Runnable {

    protected readonly proxyService: MqApiProducer & MqApiConsumer;

    constructor(protected readonly connection: Connection) {
        this.proxyService = new MqApiProxyService((this as any).proxyConfig);
        this.run();
    }


    run(){
        this.components
            .map(component => component.prototype)
            .forEach(prototype => {
                const mqMethods = MqApiScanService.scan(prototype);

                console.log(`SCAN(${prototype.constructor.name}):`, mqMethods);

                mqMethods.forEach(({key,method}) => {
                        if (isMqConsumer(method)) prototype[key] = this.proxyService.consume(method);
                        else if (isMqProducer(method)) prototype[key] = this.proxyService.produce(method);
                });
            });
    }

    /**
     * Implemented in decorator @EnableMqApi.
     */
    protected abstract get proxyConfig(): ProxyConfig
    protected abstract get components(): Function[]
}


