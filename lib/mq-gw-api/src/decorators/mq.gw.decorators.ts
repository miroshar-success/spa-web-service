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



export namespace MqGwDecorators {

    import MQ_GW_METHOD_CLIENT_METADATA = MqGwConstants.MQ_GW_METHOD_CLIENT_METADATA;
    export function MqGwConfig(value: MqGwConfigType): Function {
        return function(target: any) {
            console.log(chalk.green(`[mq-gw-api] - [decorator-enable-mq-gw] class ${target.name} [config] `), value);
            if (value.components.length < 1) console.log(warn('[mq-gw-api] WARNING! No components to scan specified!'));
            Object.defineProperty(target.prototype, `config`, {value});

        }
    }

    export function MqGwConsumer({name, gateway = 'clientKey', client = null}: DecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log(chalk.green(`[mq-gw-api] - [decorator-mq-gw-consumer] method ${methodName} [params] `), {name,gateway,client});
            Reflect.defineMetadata(MQ_GW_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
            client && Reflect.defineMetadata(MQ_GW_METHOD_CLIENT_METADATA, client, descriptor.value);
        };
    }

    export function MqGwProducer({name, gateway = 'clientKey'}: DecoratorParam) {
        return function(target: any, methodName: string, descriptor: PropertyDescriptor): void {
            console.log(chalk.green(`[mq-gw-api] - [decorator-mq-gw-consumer] method ${methodName} [params] `), {name,gateway});
            Reflect.defineMetadata(MQ_GW_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
            Reflect.defineMetadata(MQ_GW_METHOD_UUID_METADATA, uuid(), descriptor.value);
        };
    }

}




