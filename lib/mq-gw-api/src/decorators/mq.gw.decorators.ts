import "reflect-metadata";
const uuid = require('uuid/v4');
const chalk = require('chalk');
const warn = chalk.keyword('orange');
import {MqGwTypes} from "../types/mq.gw.types";
import {MqGwConstants} from "../constants/mq.gw.constants";
import {MqGwConfiguration} from "../configuration/mq.gw.configuration";
import DecoratorParam = MqGwTypes.DecoratorParam;
import MqGwConfigType = MqGwTypes.MqGwConfigType;
import MQ_GW_METHOD_NAME_METADATA = MqGwConstants.MQ_GW_METHOD_NAME_METADATA;
import MQ_GW_METHOD_GATEWAY_METADATA = MqGwConstants.MQ_GW_METHOD_GATEWAY_METADATA;
import MQ_GW_METHOD_CONSUMER_METADATA = MqGwConstants.MQ_GW_METHOD_CONSUMER_METADATA;
import MQ_GW_METHOD_PRODUCER_METADATA = MqGwConstants.MQ_GW_METHOD_PRODUCER_METADATA;
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;
import MqGwDecoratorParam = MqGwTypes.MqGwDecoratorParam;
import MqDecoratorParam = MqGwTypes.MqDecoratorParam;
import MQ_GW_METHOD_CLIENT_METADATA = MqGwConstants.MQ_GW_METHOD_CLIENT_METADATA;
import MQ_GW_METHOD_PREFETCH_METADATA = MqGwConstants.MQ_GW_METHOD_PREFETCH_METADATA;


export namespace MqGwDecorators {


    export function MqGwConfig(value: MqGwConfigType): Function {
        return function(target: any) {
            // console.log(chalk.green(`[mq-gw-api] - [decorator-enable-mq-gw] class ${target.name} [config] `), value);
            if (value.components.length < 1) console.log(warn('[mq-gw-api] WARNING! No components to scan specified!'));
            Object.defineProperty(target.prototype, `config`, {value});

        }
    }

    export function MqGwConsumer({name, gateway = 'clientKey'}: MqGwDecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            // console.log(chalk.green(`[mq-gw-api] - [decorator-mq-gw-consumer] method ${methodName} [params] `), {name,gateway});
            Reflect.defineMetadata(MQ_GW_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

    export function MqGwProducer({name, gateway = 'clientKey'}: MqGwDecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            // console.log(chalk.green(`[mq-gw-api] - [decorator-mq-gw-producer] method ${methodName} [params] `), {name,gateway});
            Reflect.defineMetadata(MQ_GW_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

    export function MqProducer({name, client}: MqDecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            // console.log(chalk.green(`[mq-gw-api] - [decorator-mq-producer] method ${methodName} [params] `), {name, client});
            Reflect.defineMetadata(MQ_GW_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_CLIENT_METADATA, client, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

    export function MqConsumer({name, client, prefetch = 0}: MqDecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log(chalk.green(`[mq-gw-api] - [decorator-mq-consumer] method ${methodName} [params] `), {name, client, prefetch});
            Reflect.defineMetadata(MQ_GW_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_CLIENT_METADATA, client, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_PREFETCH_METADATA, prefetch, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

}




