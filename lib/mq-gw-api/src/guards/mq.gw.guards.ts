import {MqGwTypes} from "../types/mq.gw.types";
import {MqGwConstants} from "../constants/mq.gw.constants";
import MqMethod = MqGwTypes.MqMethodType;
import MqConsumer = MqGwTypes.MqGwConsumerType;
import MqGwConsumerType = MqGwTypes.MqGwConsumerType;
import MqGwProducerType = MqGwTypes.MqGwProducerType;
import MQ_GW_METHOD_GATEWAY_METADATA = MqGwConstants.MQ_GW_METHOD_GATEWAY_METADATA;
import MQ_GW_METHOD_NAME_METADATA = MqGwConstants.MQ_GW_METHOD_NAME_METADATA;
import MQ_GW_METHOD_CONSUMER_METADATA = MqGwConstants.MQ_GW_METHOD_CONSUMER_METADATA;
import MQ_GW_METHOD_PRODUCER_METADATA = MqGwConstants.MQ_GW_METHOD_PRODUCER_METADATA;
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;
import MQ_GW_METHOD_CLIENT_METADATA = MqGwConstants.MQ_GW_METHOD_CLIENT_METADATA;
import MqGwScanService from "../services/mq.gw.scan.service";
import MqConsumerType = MqGwTypes.MqConsumerType;
import MqProducerType = MqGwTypes.MqProducerType;


export namespace MqGwGuards {

    export function isMqMethod(target: any): target is MqMethod {
        return typeof target === 'function' &&
            MqGwScanService.hasKey(target)(MQ_GW_METHOD_NAME_METADATA) &&
            MqGwScanService.hasKey(target)(MQ_GW_METHOD_UUID_METADATA);
    }

    export function isMqGwConsumer(target: any): target is MqGwConsumerType {
        return MqGwScanService.hasKey(target)(MQ_GW_METHOD_GATEWAY_METADATA) &&
               MqGwScanService.hasKey(target)(MQ_GW_METHOD_CONSUMER_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_CONSUMER_METADATA);
    }

    export function isMqGwProducer(target: any): target is MqGwProducerType {
        return MqGwScanService.hasKey(target)(MQ_GW_METHOD_GATEWAY_METADATA) &&
               MqGwScanService.hasKey(target)(MQ_GW_METHOD_PRODUCER_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_PRODUCER_METADATA);
    }

    export function isMqConsumer(target: any): target is MqConsumerType {
        return MqGwScanService.hasKey(target)(MQ_GW_METHOD_CLIENT_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_CLIENT_METADATA) &&
               MqGwScanService.hasKey(target)(MQ_GW_METHOD_CONSUMER_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_CONSUMER_METADATA);
    }

    export function isMqProducer(target: any): target is MqProducerType {
        return MqGwScanService.hasKey(target)(MQ_GW_METHOD_CLIENT_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_CLIENT_METADATA) &&
               MqGwScanService.hasKey(target)(MQ_GW_METHOD_PRODUCER_METADATA) &&
               MqGwScanService.scanKey(target)(MQ_GW_METHOD_PRODUCER_METADATA);
    }

}