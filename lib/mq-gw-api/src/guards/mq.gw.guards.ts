import {MqGwTypes} from "../types/mq.gw.types";
import {MqGwConstants} from "../constants/mq.gw.constants";
import MqGwMethod = MqGwTypes.MqGwMethodType;
import MqConsumer = MqGwTypes.MqGwConsumerType;
import MqGwConsumerType = MqGwTypes.MqGwConsumerType;
import MqGwProducerType = MqGwTypes.MqGwProducerType;
import MQ_GW_METHOD_GATEWAY_METADATA = MqGwConstants.MQ_GW_METHOD_GATEWAY_METADATA;
import MQ_GW_METHOD_NAME_METADATA = MqGwConstants.MQ_GW_METHOD_NAME_METADATA;
import MQ_GW_METHOD_CONSUMER_METADATA = MqGwConstants.MQ_GW_METHOD_CONSUMER_METADATA;
import MQ_GW_METHOD_PRODUCER_METADATA = MqGwConstants.MQ_GW_METHOD_PRODUCER_METADATA;
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;


export namespace MqGwGuards {

    export function isMqGwMethod(target: any): target is MqGwMethod {
        return typeof target === 'function' &&
            Reflect.hasMetadata(MQ_GW_METHOD_NAME_METADATA, target) &&
            Reflect.hasMetadata(MQ_GW_METHOD_GATEWAY_METADATA, target) //&&
            // Reflect.hasMetadata(MQ_GW_METHOD_UUID_METADATA, target);
    }

    export function isMqGwConsumer(target: any): target is MqGwConsumerType {
        return Reflect.hasMetadata(MQ_GW_METHOD_CONSUMER_METADATA, target) &&
               Reflect.getMetadata(MQ_GW_METHOD_CONSUMER_METADATA, target);
    }

    export function isMqGwProducer(target: any): target is MqGwProducerType {
        return Reflect.hasMetadata(MQ_GW_METHOD_PRODUCER_METADATA, target) &&
               Reflect.getMetadata(MQ_GW_METHOD_PRODUCER_METADATA, target);
    }

}