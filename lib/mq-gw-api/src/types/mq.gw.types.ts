import {Connection} from "amqplib";

export namespace MqGwTypes {

    export declare type MqGwProducer = Producable<MqGwProducerType, Function>;
    export declare type MqGwConsumer = Consumable<MqGwConsumerType, Function>;

    export interface Runnable{
        run():void
    }
    export interface Producable<T, R> {
        produce(target: T): R
    }
    export interface Consumable<T, R> {
        consume(target: T): R
    }

    export interface ConfigurationParam{
        root: string
        clients: string[],
        components: Function[]
    }
    export interface ProxyConfig extends ConfigurationParam {
        connection: Connection
    }
    export interface DecoratorParam {
        name: string
        gateway?: string
    }
    export interface MqGwScanResult {
        key: string,
        value: {prototype: object,
                method: MqGwMethodType,
                gw: string}
    }

    export interface MqGwMethodType extends Function{
        (...args: any[]): any
    }
    export interface MqGwConsumerType extends MqGwMethodType{}
    export interface MqGwProducerType extends MqGwMethodType{}

}