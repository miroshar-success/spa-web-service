import {connect, Connection} from 'amqplib';
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
import Bluebird = require("bluebird");
const chalk = require('chalk');



class MqGwProxyService {

    protected readonly rootClients: string[];
    protected readonly components: Function[];
    protected readonly connectionConfig: ConnectionConfig;
    protected readonly queueNames: string[];
    protected scanResultsMap: {[uuid: string]: MqGwScanResult};
    protected scanResultsArr: MqGwScanResult[];
    protected connection: Connection;

    constructor({root, clients, components, connection}: MqGwConfig){
        this.components = components;
        this.rootClients = clients.map(client => `${root}.${client}`);
        this.scanResultsMap = MqGwScanService.scan(this.components);
        this.scanResultsArr = Object.keys(this.scanResultsMap).map(uuid => this.scanResultsMap[uuid]);

        this.connectionConfig = connection;
        this.queueNames = this.rootClients
            .map(rootClient => this.scanResultsArr.map(({methodName}) => `${rootClient}.${methodName}`))
            .reduce((prev, cur) => [...prev, ...cur], []);

        this.connect().then(_ => this.proxify());
    }

    protected async connect(){
        try {
            this.connection =  await Promise.resolve(connect(this.connectionConfig));
            console.log(chalk.green(`MQ_GW_CONNECTED: `) + chalk.yellow(`${this.connection}`));
        } catch (err){
            console.log(chalk.red(err));
        }

        try {
            let channel = await Promise.resolve(this.connection.createChannel());
            console.log(chalk.green(`MQ_GW_QUEUES: `) + chalk.yellow(`${this.queueNames.join(', ')}`));
            this.queueNames.forEach(queueName => channel.assertQueue(queueName));
        } catch (err){
            console.log(chalk.red(err));
        }
    }

    protected proxify(){

        console.log(chalk.green(`MQ_GW_SCAN(${this.components.map(c=>c.name)}): `), this.scanResultsArr);

        this.scanResultsArr.forEach(({key, method, prototype}) => {
            if (isMqGwConsumer(method)) prototype[key] = this.consumer(method);
            else if (isMqGwProducer(method)) prototype[key] = this.producer(method);
        });
    }

    protected async producer(target: Function) {
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        return function () {
            console.log(`Produce to `, targetUuid);
            const result = target.apply(this, arguments);
            console.log("DATA:", result);
            return result;
        };
    }
    protected async consumer(target: Function) {
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetMethodName = this.scanResultsMap[targetUuid].methodName;
        const channel = await Promise.resolve(this.connection.createChannel());
        this.queueNames
            .map(queueName => queueName.split('.'))
            .filter(([root, client, methodName]) => methodName === targetMethodName)
            .map(array => array.join('.'))
            .forEach(queueName => channel.consume(queueName, target))

        // return function () {
        //     console.log(`Consume from `, targetUuid);
        //     const result = target.apply(this, arguments);
        //     console.log("DATA:", result);
        //     return result;
        // };
    }
}

export default MqGwProxyService;


