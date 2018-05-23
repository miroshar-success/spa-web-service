import { connect } from 'amqplib';
import {MqGwTypes} from "../types/mq.gw.types";

import MqGwScanService from './mq.gw.scan.service';
import {MqGwGuards} from "../guards/mq.gw.guards";
import isMqGwConsumer = MqGwGuards.isMqGwConsumer;
import isMqGwProducer = MqGwGuards.isMqGwProducer;
import MqGwScanResult = MqGwTypes.MqGwScanResult;
import {MqGwConstants} from "../constants/mq.gw.constants";
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;
import MqGwConfig = MqGwTypes.MqGwConfig;
import ConnectionConfig = MqGwTypes.ConnectionConfig;
const chalk = require('chalk');



class MqGwProxyService {// implements MqGwProducer, MqGwConsumer, Runnable {

    private readonly queueNames: string[];
    private readonly rootClients: string[];
    private readonly components: Function[];
    private readonly connection: ConnectionConfig;
    private readonly scanResultsMap: {[uuid: string]:MqGwScanResult};
    public readonly scanResultsArr: MqGwScanResult[];

    constructor({root, clients, components, connection}: MqGwConfig){
        this.components = components;
        this.connection = connection;
        this.rootClients = clients.map(client => `${root}.${client}`)
        this.scanResultsMap = MqGwScanService.scan(components);
        this.scanResultsArr = Object.keys(this.scanResultsMap).map(uuid => this.scanResultsMap[uuid]);
        this.queueNames = this.rootClients
            .map(rootClient => this.scanResultsArr.map(({methodName}) => `${rootClient}.${methodName}`))
            .reduce((prev, cur) => [...prev, ...cur], []);
    }

    connect(){

        console.log(chalk.green(`MQ_GW_QUEUES: `) + chalk.yellow(`${this.queueNames}`));
        connect(this.connection)
            .then(connection => connection.createChannel()
                .then(channel => this.queueNames.forEach(queueName => channel.assertQueue(queueName)))
                .catch(err => console.log(chalk.red(err))))
            .catch(err => console.log(chalk.red(err)));

    }

    proxify(){
        console.log(chalk.green(`MQ_GW_SCAN(${this.components.map(c=>c.name)}): `), this.scanResultsArr);

        this.scanResultsArr
            .forEach(({key, method, prototype}) => {
                if (isMqGwConsumer(method)) prototype[key] = this.consume(method);
                else if (isMqGwProducer(method)) prototype[key] = this.produce(method);
            });
    }

    protected produce(target: Function) {
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        return function () {
            console.log(`Produce to `, targetUuid);
            const result = target.apply(this, arguments);
            console.log("DATA:", result);
            return result;
        };
    }
    protected consume(target: Function) {
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        return function () {
            console.log(`Consume from `, targetUuid);
            const result = target.apply(this, arguments);
            console.log("DATA:", result);
            return result;
        };
    }
}

export default MqGwProxyService;


