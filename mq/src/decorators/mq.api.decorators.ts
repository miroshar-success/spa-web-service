import "reflect-metadata";
import {MqApiTypes} from "../types/mq.api.types";
import DecoratorParam = MqApiTypes.DecoratorParam;
import {MqApiConstants} from "../constants/mq.api.constants";
import ConfigurationParam = MqApiTypes.ConfigurationParam;
import ScanParam = MqApiTypes.ScanParam;
import MQ_NAME_METADATA = MqApiConstants.MQ_NAME_METADATA;
import MQ_GATEWAY_METADATA = MqApiConstants.MQ_GATEWAY_METADATA;
import MQ_METHOD_METADATA = MqApiConstants.MQ_METHOD_METADATA;



export namespace MqDecorators {

    export function EnableMqConfiguration(value: ConfigurationParam){
        return function(target: any){
            console.log('EnableMqConfiguration: ', value);
            Object.defineProperty(target.prototype,`config`, {value});
        }
    }

    export function ComponentScan({components: value}: ScanParam){
        return function(target: any){
            console.log('ComponentScan: ', value);
            Object.defineProperty(target.prototype,`components`, {value});
        }
    }

    export function MqConsumer({name, gateway = 'clientKey'}: DecoratorParam){
        return function(target: any, methodName: string, descriptor: PropertyDescriptor){
            console.log('MQ_CONSUMER: ', methodName);
            Reflect.defineMetadata(MQ_METHOD_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GATEWAY_METADATA, gateway, descriptor.value);
        };
    }

    export function MqProducer({name, gateway = 'clientKey'}: DecoratorParam){
        return function(target: any, methodName: string, descriptor: PropertyDescriptor){
            console.log('MQ_PRODUCER: ', methodName);
            Reflect.defineMetadata(MQ_METHOD_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GATEWAY_METADATA, gateway, descriptor.value);
        };
    }

}




