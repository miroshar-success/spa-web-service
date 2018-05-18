import {MqApiTypes} from "../types/mq.api.types";
import {MqApiConstants} from "../constants/mq.api.constants";
import MqMethod = MqApiTypes.MqMethod;
import MQ_GATEWAY_METADATA = MqApiConstants.MQ_GATEWAY_METADATA;
import MQ_NAME_METADATA = MqApiConstants.MQ_NAME_METADATA;
import MqConsumer = MqApiTypes.MqConsumerType;
import MqConsumerType = MqApiTypes.MqConsumerType;
import MqProducerType = MqApiTypes.MqProducerType;


export namespace MqApiGuards {

    export function isMqMethod(arg: any): arg is MqMethod {
        return typeof arg === 'function' && Reflect.hasMetadata(MQ_NAME_METADATA, arg) && Reflect.hasMetadata(MQ_GATEWAY_METADATA, arg)
    }
    export function isMqConsumer(arg: any): arg is MqConsumerType {
        return Reflect.hasMetadata(MQ_GATEWAY_METADATA, arg)
    }

    export function isMqProducer(arg: any): arg is MqProducerType {
        return Reflect.hasMetadata(MQ_GATEWAY_METADATA, arg)
    }

}