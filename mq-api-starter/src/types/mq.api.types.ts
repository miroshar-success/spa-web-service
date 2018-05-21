import {Connection} from "amqplib";

export namespace MqApiTypes {

    export declare type MqApiProducer = Producable<MqProducerType, Function>;
    export declare type MqApiConsumer = Consumable<MqConsumerType, Function>;

    export interface Runnable{
        run():void
    }
    export interface Producable<T, R> {
        produce(target: T): R
    }
    export interface Consumable<T, R> {
        consume(target: T): R
    }

    export interface ProxyConfig{
        root: string;
        clients: string[],
        connection: Connection
    }
    export interface DecoratorParam {
        name: string
        gateway: string
    }
    export interface ConfigurationParam{
        root: string
        clients: string[],
        components: Function[]
    }

    export interface MqMethodType extends Function{
        (...args: any[]): any
    }
    export interface MqConsumerType extends MqMethodType{}
    export interface MqProducerType extends MqMethodType{}

}