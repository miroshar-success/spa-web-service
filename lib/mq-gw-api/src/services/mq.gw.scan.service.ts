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

    static scan = (components: Function[]): {[uuid:string]: MqGwScanResult} => {
        return components
            .map(component => MqGwScanService.scanObject(component.prototype))
            .reduce((prev, cur) => [...prev, ...cur], [])
            .reduce((result, {uuid,target}) => ({...result, [uuid]: target}), {});
    }

    static scanObject = (prototype: object): {uuid:string, target: MqGwScanResult}[] => Object.getOwnPropertyNames(prototype)
        .filter(key => key !== 'constructor' && isMqGwMethod(prototype[key]))
        .map(key => ({
                uuid: MqGwScanService.scanKey(prototype[key])(MQ_GW_METHOD_UUID_METADATA),
                target: {
                    key,
                    prototype,
                    method: prototype[key],
                    methodName: `${MqGwScanService.scanKey(prototype[key])(MQ_GW_METHOD_NAME_METADATA)}`,
                    gw: `${MqGwScanService.scanKey(prototype[key])(MQ_GW_METHOD_GATEWAY_METADATA)}`
                }
            })
        );

    static scanKey = (target: Function) => (key: string) => Reflect.getMetadata(key, target);
    static hasKey = (target: Function) => (key: string) => Reflect.hasMetadata(key, target);

}

export default MqGwScanService