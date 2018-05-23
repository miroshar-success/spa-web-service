import "reflect-metadata";
import { connect } from 'amqplib';
import {MqGwTypes} from "../types/mq.gw.types";
import MqGwConfig = MqGwTypes.MqGwConfig;
import {MqGwGuards} from "../guards/mq.gw.guards";
import isMqMethod = MqGwGuards.isMqGwMethod;
import MqMethodType = MqGwTypes.MqGwMethodType;
import MqConsumerType = MqGwTypes.MqGwConsumerType;
import MqProducerType = MqGwTypes.MqGwProducerType;
import isMqGwConsumer = MqGwGuards.isMqGwConsumer;
import isMqGwProducer = MqGwGuards.isMqGwProducer;
import MqGwMethodType = MqGwTypes.MqGwMethodType;
import ConnectionConfig = MqGwTypes.ConnectionConfig;
import MqGwProxyService from "../services/mq.gw.proxy.service";


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

     constructor() {
        this.proxyService = new MqGwProxyService((this as any).config);
        this.proxyService.proxify();
        this.proxyService.connect();
    }


    /**
     * Implemented in decorator @EnableMqGw.
     */
    protected abstract get config(): MqGwConfig
}


