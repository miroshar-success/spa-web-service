import {MqApiTypes} from "../types/mq.api.types";
import {MqApiConstants} from "../constants/mq.api.constants";
import MqMethod = MqApiTypes.MqMethodType;
import MqConsumer = MqApiTypes.MqConsumerType;
import MqConsumerType = MqApiTypes.MqConsumerType;
import MqProducerType = MqApiTypes.MqProducerType;
import MQ_METHOD_GATEWAY_METADATA = MqApiConstants.MQ_METHOD_GATEWAY_METADATA;
import MQ_METHOD_NAME_METADATA = MqApiConstants.MQ_METHOD_NAME_METADATA;
import MQ_METHOD_CONSUMER_METADATA = MqApiConstants.MQ_METHOD_CONSUMER_METADATA;
import MQ_METHOD_PRODUCER_METADATA = MqApiConstants.MQ_METHOD_PRODUCER_METADATA;


export namespace MqApiGuards {

    export function isMqMethod(target: any): target is MqMethod {
        return typeof target === 'function' && Reflect.hasMetadata(MQ_METHOD_NAME_METADATA, target) && Reflect.hasMetadata(MQ_METHOD_GATEWAY_METADATA, target)
    }

    export function isMqConsumer(target: any): target is MqConsumerType {
        return Reflect.hasMetadata(MQ_METHOD_CONSUMER_METADATA, target) && Reflect.getMetadata(MQ_METHOD_CONSUMER_METADATA, target);
    }

    export function isMqProducer(target: any): target is MqProducerType {
        return Reflect.hasMetadata(MQ_METHOD_PRODUCER_METADATA, target) && Reflect.getMetadata(MQ_METHOD_PRODUCER_METADATA, target);
    }

}