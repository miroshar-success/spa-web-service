import {MqGwTypes} from "../types/mq.gw.types";
import MqGwConfig = MqGwTypes.MqGwConfigType;
import MqGwProxyService from "../services/mq.gw.proxy.service";
const chalk = require('chalk');


/**
 *
 * Example:
 *
 * @MqGwConfig({
 *      root: 'beagle',
 *      clients:['telegram'],
 *      components:[Service, Number],
 *      connection:{
 *         hostname: "beagle-rabbit-mq",
 *         username: "rabbitmq",
 *         password: "rabbitmq"
 *      }
 * })
 * class MyConfig extends MqGwConfiguration {}
 *
 * new MyConfig().enable();
 *
 *
 */

export class MqGwConfiguration {

    private readonly proxyService: MqGwProxyService;
    private readonly config: MqGwConfig;

    constructor() {
        this.proxyService = new MqGwProxyService(this.config);
    }


    enable(){
         this.proxyService.connect()
             .catch(error => console.log(chalk.red(`[mq-gw-api] - [connection-error] `, error)))
             .then(_ => this.proxyService.proxify())
             .catch(error => console.log(chalk.red(`[mq-gw-api] - [proxy-error] `, error)));
    }

}


