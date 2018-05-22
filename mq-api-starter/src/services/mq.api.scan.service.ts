import {MqApiGuards} from "../guards/mq.api.guards";
import isMqMethod = MqApiGuards.isMqMethod;
import MqMethodType = MqApiTypes.MqMethodType;
import {MqApiTypes} from "../types/mq.api.types";


class MqApiScanService {

    static scan = (prototype: object): {key: string, method: MqMethodType}[] => Object.keys(prototype)
        .map(key => ({key, method: prototype[key]}))
        .filter(entry => isMqMethod(entry.method));

}

export default MqApiScanService