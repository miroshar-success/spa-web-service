"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mq_api_constants_1 = require("../constants/mq.api.constants");
var MQ_METHOD_GATEWAY_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_GATEWAY_METADATA;
var MQ_METHOD_NAME_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_NAME_METADATA;
var MQ_METHOD_CONSUMER_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_CONSUMER_METADATA;
var MQ_METHOD_PRODUCER_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_PRODUCER_METADATA;
var MqApiGuards;
(function (MqApiGuards) {
    function isMqMethod(target) {
        return typeof target === 'function' && Reflect.hasMetadata(MQ_METHOD_NAME_METADATA, target) && Reflect.hasMetadata(MQ_METHOD_GATEWAY_METADATA, target);
    }
    MqApiGuards.isMqMethod = isMqMethod;
    function isMqConsumer(target) {
        return Reflect.hasMetadata(MQ_METHOD_CONSUMER_METADATA, target) && Reflect.getMetadata(MQ_METHOD_CONSUMER_METADATA, target);
    }
    MqApiGuards.isMqConsumer = isMqConsumer;
    function isMqProducer(target) {
        return Reflect.hasMetadata(MQ_METHOD_PRODUCER_METADATA, target) && Reflect.getMetadata(MQ_METHOD_PRODUCER_METADATA, target);
    }
    MqApiGuards.isMqProducer = isMqProducer;
})(MqApiGuards = exports.MqApiGuards || (exports.MqApiGuards = {}));
