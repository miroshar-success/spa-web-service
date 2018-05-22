import "reflect-metadata";
import {Connection} from "amqplib";
import {MqGwTypes} from "../types/mq.gw.types";
import ConfigurationParam = MqGwTypes.ConfigurationParam;
import {MqGwGuards} from "../guards/mq.gw.guards";
import isMqMethod = MqGwGuards.isMqGwMethod;
import MqMethodType = MqGwTypes.MqGwMethodType;
import MqConsumerType = MqGwTypes.MqGwConsumerType;
import MqProducerType = MqGwTypes.MqGwProducerType;
import isMqGwConsumer = MqGwGuards.isMqGwConsumer;
import isMqGwProducer = MqGwGuards.isMqGwProducer;
import MqGwProxyService from '../services/mq.gw.proxy.service';
import MqGwProducer = MqGwTypes.MqGwProducer;
import MqGwConsumer = MqGwTypes.MqGwConsumer;
import ProxyConfig = MqGwTypes.ProxyConfig;
import MqGwMethodType = MqGwTypes.MqGwMethodType;
import Runnable = MqGwTypes.Runnable;


/**
 *
 * Example:
 *
 * @EnableMqGw({
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

export abstract class MqGwConfiguration {

    protected proxyService: MqGwProxyService;

    constructor(protected readonly connection: Connection) {
        this.proxyService = new MqGwProxyService({...(this as any).config,...{connection}});
        this.proxyService.run();
    }


    /**
     * Implemented in decorator @EnableMqGw.
     */
    protected abstract get config(): ConfigurationParam
}


