import "reflect-metadata";
import {Connection} from "amqplib";
import uuid from 'uuid/v4';
import {MqGwTypes} from "../types/mq.gw.types";
import {MqGwConstants} from "../constants/mq.gw.constants";
import {MqGwConfiguration} from "../configuration/mq.gw.configuration";
import DecoratorParam = MqGwTypes.DecoratorParam;
import ConfigurationParam = MqGwTypes.ConfigurationParam;
import MQ_GW_METHOD_NAME_METADATA = MqGwConstants.MQ_GW_METHOD_NAME_METADATA;
import MQ_GW_METHOD_GATEWAY_METADATA = MqGwConstants.MQ_GW_METHOD_GATEWAY_METADATA;
import MQ_GW_METHOD_CONSUMER_METADATA = MqGwConstants.MQ_GW_METHOD_CONSUMER_METADATA;
import MQ_GW_METHOD_PRODUCER_METADATA = MqGwConstants.MQ_GW_METHOD_PRODUCER_METADATA;
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;



export namespace MqGwDecorators {

    export function EnableMqGw(value: ConfigurationParam): Function {
        return function(target: any): Function {
            console.log(`EnableMqGw(${target.name}): `, value);
            if (value.components.length < 1) console.log('No components specified');
            Object.defineProperty(target.prototype,`config`, {value});
            return (class extends MqGwConfiguration {
                constructor(connection:Connection){
                    super(connection);
                }
                get config() {
                    return value;
                }
            } as Function)
        }
    }

    export function MqGwConsumer({name, gateway = 'clientKey'}: DecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log('MQ_CONSUMER: ', methodName);
            Reflect.defineMetadata(MQ_GW_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            // Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

    export function MqGwProducer({name, gateway = 'clientKey'}: DecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log('MQ_PRODUCER: ', methodName);
            Reflect.defineMetadata(MQ_GW_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            // Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

}




