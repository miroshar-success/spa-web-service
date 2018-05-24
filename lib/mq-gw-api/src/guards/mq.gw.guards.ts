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
import MqGwScanService from "../services/mq.gw.scan.service";


export namespace MqGwGuards {

    export function isMqGwMethod(target: any): target is MqGwMethod {
        return typeof target === 'function' &&
            MqGwScanService.scanKey(target)(MQ_GW_METHOD_NAME_METADATA) &&
            MqGwScanService.scanKey(target)(MQ_GW_METHOD_GATEWAY_METADATA) &&
            MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
    }

    export function isMqGwConsumer(target: any): target is MqGwConsumerType {
        return MqGwScanService.hasKey(target)(MQ_GW_METHOD_CONSUMER_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_CONSUMER_METADATA);
    }

    export function isMqGwProducer(target: any): target is MqGwProducerType {
        return MqGwScanService.hasKey(target)(MQ_GW_METHOD_PRODUCER_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_PRODUCER_METADATA);
    }

}