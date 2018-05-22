"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MqApiProxyService = (function () {
    function MqApiProxyService(_a) {
        var root = _a.root, clients = _a.clients, connection = _a.connection;
        this.root = root;
        this.clients = clients;
        this.connection = connection;
    }
    MqApiProxyService.prototype.produce = function (target) {
        var _this = this;
        var proxy = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("Produce to " + proxy.root + "." + proxy.clients + " with connection " + proxy.connection);
            var result = target.apply(_this, args);
            console.log("DATA:", result);
            return result;
        };
    };
    MqApiProxyService.prototype.consume = function (target) {
        var _this = this;
        var proxy = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("Consume from " + proxy.root + "." + proxy.clients + " with connection " + proxy.connection);
            var result = target.apply(_this, args);
            console.log("DATA:", result);
            return result;
        };
    };
    return MqApiProxyService;
}());
exports.default = MqApiProxyService;
