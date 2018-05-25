import "reflect-metadata";
// const uuid = require('uuid/v4');
const chalk = require('chalk');
const warn = chalk.keyword('orange');
import { MqGwTypes } from "../types/mq.gw.types";
import { MqGwConstants } from "../constants/mq.gw.constants";
import { MqGwConfiguration } from "../configuration/mq.gw.configuration";
import DecoratorParam = MqGwTypes.DecoratorParam;
import ConfigurationParam = MqGwTypes.MqGwConfig;
import MQ_GW_METHOD_NAME_METADATA = MqGwConstants.MQ_GW_METHOD_NAME_METADATA;
import MQ_GW_METHOD_GATEWAY_METADATA = MqGwConstants.MQ_GW_METHOD_GATEWAY_METADATA;
import MQ_GW_METHOD_CONSUMER_METADATA = MqGwConstants.MQ_GW_METHOD_CONSUMER_METADATA;
import MQ_GW_METHOD_PRODUCER_METADATA = MqGwConstants.MQ_GW_METHOD_PRODUCER_METADATA;
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;

export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = (c === 'x') ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export namespace MqGwDecorators {

    export function EnableMqGw(value: ConfigurationParam): Function {
        return function (target: any): Function {

            console.log(chalk.green(`@ENABLE_MQ_GW(class ${target.name}): `), value);
            if (value.components.length < 1) console.log(warn('WARNING: No components to scan specified!'));

            Object.defineProperty(target.prototype, `config`, { value });
            return (class extends MqGwConfiguration {
                get config() {
                    return value;
                }
            } as Function)
        }
    }

    export function MqGwConsumer({ name, gateway = 'clientKey' }: DecoratorParam) {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor): void {
            if (target && target.then && typeof target.then === 'function') {
                console.log(chalk.green(`@MQ_GW_CONSUMER(method ${methodName})`));
            } else {
                console.log(warn(`@MQ_GW_CONSUMER(method ${methodName}) must return Promise`));
            }
            Reflect.defineMetadata(MQ_GW_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

    export function MqGwProducer({ name, gateway = 'clientKey' }: DecoratorParam) {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log(chalk.green(`@MQ_GW_PRODUCER(method ${methodName})`));
            Reflect.defineMetadata(MQ_GW_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

}




