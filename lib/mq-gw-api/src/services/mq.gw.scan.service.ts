import {MqGwGuards} from "../guards/mq.gw.guards";
import isMqGwMethod = MqGwGuards.isMqGwMethod;
import MqGwMethodType = MqGwTypes.MqGwMethodType;
import {MqGwTypes} from "../types/mq.gw.types";
import MqGwScanResult = MqGwTypes.MqGwScanResult;
import {MqGwConstants} from "../constants/mq.gw.constants";
import MQ_GW_METHOD_GATEWAY_METADATA = MqGwConstants.MQ_GW_METHOD_GATEWAY_METADATA;
import MQ_GW_METHOD_NAME_METADATA = MqGwConstants.MQ_GW_METHOD_NAME_METADATA;
import MQ_GW_METHOD_CONSUMER_METADATA = MqGwConstants.MQ_GW_METHOD_CONSUMER_METADATA;
import MQ_GW_METHOD_PRODUCER_METADATA = MqGwConstants.MQ_GW_METHOD_PRODUCER_METADATA;
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;



class MqGwScanService {

    static scan = (components: Function[]): MqGwScanResult[] => {
        return components
            .map(component => component.prototype)
            .map(prototype => MqGwScanService.scanObject(prototype))
            .reduce((prev, cur) => [...prev, ...cur], []);
    }

    static scanObject = (prototype: object): MqGwScanResult[] => Object.keys(prototype)
        .filter(key => isMqGwMethod(prototype[key]))
        .map(key => ({
                key,
                value: {
                    prototype,
                    method: prototype[key],
                    gw: MqGwScanService.buildGwPath(prototype[key])
                }
            })
        );

    static buildGwPath = (target: Function): string => [`${Reflect.getMetadata(MQ_GW_METHOD_NAME_METADATA,target)}`,
                                                        `${Reflect.getMetadata(MQ_GW_METHOD_GATEWAY_METADATA,target)}`].join('.')

}

export default MqGwScanService