import "reflect-metadata";
import {Connection} from "amqplib";
import {MqApiTypes} from "../types/mq.api.types";
import {MqApiConstants} from "../constants/mq.api.constants";
import {MqApiConfiguration} from "../configurations/mq.api.configuration";
import DecoratorParam = MqApiTypes.DecoratorParam;
import ConfigurationParam = MqApiTypes.ConfigurationParam;
import MQ_METHOD_NAME_METADATA = MqApiConstants.MQ_METHOD_NAME_METADATA;
import MQ_METHOD_GATEWAY_METADATA = MqApiConstants.MQ_METHOD_GATEWAY_METADATA;
import MQ_METHOD_CONSUMER_METADATA = MqApiConstants.MQ_METHOD_CONSUMER_METADATA;
import MQ_METHOD_PRODUCER_METADATA = MqApiConstants.MQ_METHOD_PRODUCER_METADATA;



export namespace MqApiDecorators {

    export function EnableMqApi(value: ConfigurationParam): Function {
        return function(target: any): Function {
            console.log('EnableMqApi: ', value);
            Object.defineProperty(target.prototype,`config`, {value});
            return (class extends MqApiConfiguration {
                constructor(connection:Connection){
                    super(connection);
                }
                get proxyConfig() {
                    const { root, clients }  = value;
                    return {root, clients, connection: this.connection};
                }
                get components() {
                    return value.components;
                }
            } as Function)
        }
    }

    export function MqConsumer({name, gateway = 'clientKey'}: DecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log('MQ_CONSUMER: ', methodName);
            Reflect.defineMetadata(MQ_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
        };
    }

    export function MqProducer({name, gateway = 'clientKey'}: DecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log('MQ_PRODUCER: ', methodName);
            Reflect.defineMetadata(MQ_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
        };
    }

}




