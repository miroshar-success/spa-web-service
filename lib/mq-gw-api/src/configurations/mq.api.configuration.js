"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var mq_api_guards_1 = require("../guards/mq.api.guards");
var isMqConsumer = mq_api_guards_1.MqApiGuards.isMqConsumer;
var isMqProducer = mq_api_guards_1.MqApiGuards.isMqProducer;
var mq_api_proxy_service_1 = require("../services/mq.api.proxy.service");
var mq_api_scan_service_1 = require("../services/mq.api.scan.service");
/**
 *
 * Example:
 *
 * @EnableMqApi({
 *      root: 'root',
 *      clients:['telegram'],
 *      components:[Service, Number]
 * })
 * class Test {
 *
 *   constructor(connection: Connection){}
 *
 * }
 *
 *
 */
var MqApiConfiguration = (function () {
    function MqApiConfiguration(connection) {
        this.connection = connection;
        this.proxyService = new mq_api_proxy_service_1.default(this.proxyConfig);
        this.run();
    }
    MqApiConfiguration.prototype.run = function () {
        var _this = this;
        this.components
            .map(function (component) { return component.prototype; })
            .forEach(function (prototype) {
            var mqMethods = mq_api_scan_service_1.default.scan(prototype);
            console.log("SCAN(" + prototype.constructor.name + "):", mqMethods);
            mqMethods.forEach(function (_a) {
                var key = _a.key, method = _a.method;
                if (isMqConsumer(method))
                    prototype[key] = _this.proxyService.consume(method);
                else if (isMqProducer(method))
                    prototype[key] = _this.proxyService.produce(method);
            });
        });
    };
    return MqApiConfiguration;
}());
exports.MqApiConfiguration = MqApiConfiguration;
