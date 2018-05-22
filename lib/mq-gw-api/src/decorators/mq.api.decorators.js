"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var mq_api_constants_1 = require("../constants/mq.api.constants");
var mq_api_configuration_1 = require("../configurations/mq.api.configuration");
var MQ_METHOD_NAME_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_NAME_METADATA;
var MQ_METHOD_GATEWAY_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_GATEWAY_METADATA;
var MQ_METHOD_CONSUMER_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_CONSUMER_METADATA;
var MQ_METHOD_PRODUCER_METADATA = mq_api_constants_1.MqApiConstants.MQ_METHOD_PRODUCER_METADATA;
var MqApiDecorators;
(function (MqApiDecorators) {
    function EnableMqApi(value) {
        return function (target) {
            console.log('EnableMqApi: ', value);
            Object.defineProperty(target.prototype, "config", { value: value });
            return (function (_super) {
                __extends(class_1, _super);
                function class_1(connection) {
                    return _super.call(this, connection) || this;
                }
                Object.defineProperty(class_1.prototype, "proxyConfig", {
                    get: function () {
                        var root = value.root, clients = value.clients;
                        return { root: root, clients: clients, connection: this.connection };
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1.prototype, "components", {
                    get: function () {
                        return value.components;
                    },
                    enumerable: true,
                    configurable: true
                });
                return class_1;
            }(mq_api_configuration_1.MqApiConfiguration));
        };
    }
    MqApiDecorators.EnableMqApi = EnableMqApi;
    function MqConsumer(_a) {
        var name = _a.name, _b = _a.gateway, gateway = _b === void 0 ? 'clientKey' : _b;
        return function (target, methodName, descriptor) {
            console.log('MQ_CONSUMER: ', methodName);
            Reflect.defineMetadata(MQ_METHOD_CONSUMER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
        };
    }
    MqApiDecorators.MqConsumer = MqConsumer;
    function MqProducer(_a) {
        var name = _a.name, _b = _a.gateway, gateway = _b === void 0 ? 'clientKey' : _b;
        return function (target, methodName, descriptor) {
            console.log('MQ_PRODUCER: ', methodName);
            Reflect.defineMetadata(MQ_METHOD_PRODUCER_METADATA, true, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_NAME_METADATA, name, descriptor.value);
            Reflect.defineMetadata(MQ_METHOD_GATEWAY_METADATA, gateway, descriptor.value);
        };
    }
    MqApiDecorators.MqProducer = MqProducer;
})(MqApiDecorators = exports.MqApiDecorators || (exports.MqApiDecorators = {}));
