"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mq_api_guards_1 = require("../guards/mq.api.guards");
var isMqMethod = mq_api_guards_1.MqApiGuards.isMqMethod;
var MqApiScanService = (function () {
    function MqApiScanService() {
    }
    return MqApiScanService;
}());
MqApiScanService.scan = function (prototype) { return Object.keys(prototype)
    .map(function (key) { return ({ key: key, method: prototype[key] }); })
    .filter(function (entry) { return isMqMethod(entry.method); }); };
exports.default = MqApiScanService;
