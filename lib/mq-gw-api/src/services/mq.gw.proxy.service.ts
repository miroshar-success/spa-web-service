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
    protected readonly routes: string[];
    protected scanResultsMap: {[uuid: string]: MqGwScanResult};
    protected scanResultsArr: MqGwScanResult[];
    protected connection: Connection;

    constructor({root, clients, components, connection}: MqGwConfig){
        this.components = components;
        this.rootClients = clients.map(client => `${root}.${client}`);
        this.scanResultsMap = MqGwScanService.scan(this.components);
        this.scanResultsArr = Object.keys(this.scanResultsMap).map(uuid => this.scanResultsMap[uuid]);

        this.connectionConfig = connection;
        this.routes = this.rootClients
            .map(rootClient => Array.from(new Set(this.scanResultsArr.map(({mRoute})=>mRoute)))
                                     .map(uniqueRoute =>`${rootClient}.${uniqueRoute}`))
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
            console.log(chalk.green(`MQ_GW_ROUTES: `) + chalk.yellow(`${this.routes.join(', ')}`));
            this.routes.forEach(queueName => channel.assertQueue(queueName));
        } catch (err){
            console.log(chalk.red(err));
        }
    }

    protected proxify(){

        console.log(chalk.green(`MQ_GW_SCAN(${this.components.map(c=>c.name)}): `), this.scanResultsArr);

        this.scanResultsArr.forEach(({key, method, prototype}) => {
            if (isMqGwConsumer(method)) this.consumer(method).then(proxyFn => prototype[key] = proxyFn);
            else if (isMqGwProducer(method)) this.producer(method).then(proxyFn => prototype[key] = proxyFn);
        });
    }

    protected async producer(target: Function) {
        const proxyThis = this;
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetMethodRoute = this.scanResultsMap[targetUuid].mRoute;
        const channel = await Promise.resolve(this.connection.createChannel());
        const proxyFn = function () {
            const result: any = target.apply(this, arguments);
            console.log(chalk.yellow(`MQ_GW_PRODUCER_RESULT: ${result}`));
            if (result && result.then && typeof result.then === 'function') {
                return result.then(data => console.log('PUBLISH_RESOLVED: ',data) || data && Promise.resolve(proxyThis.routes
                    .filter(route => route.indexOf(`.${targetMethodRoute}`) > 0)
                    .map(route => channel.sendToQueue(route, new Buffer(JSON.stringify(data), 'utf8')))));
            }
            console.log(chalk.yellow(`PUBLISH: ${result}`));
            return result && proxyThis.routes
                    .filter(route => route.indexOf(`.${targetMethodRoute}`) > 0)
                    .map(route => channel.sendToQueue(route, new Buffer(JSON.stringify(result), 'utf8')));
        };
        return proxyFn;
    }
    protected async consumer(target: Function) {
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetMethodRoute = this.scanResultsMap[targetUuid].mRoute;
        const channel = await Promise.resolve(this.connection.createChannel());
        const proxyFn = function (message){
            console.log(chalk.yellow(`MQ_GW_CONSUMER_MESSAGE: ${message.content}`));
            try{
                message && target.call(null, message);
                message && channel.ack(message);
                return Promise.resolve(message);
            } catch (error){
                message && channel.nack(message);
                console.log(chalk.red(error));
                return Promise.reject(error);
            }
        };
        this.routes
            .filter(route => route.indexOf(`.${targetMethodRoute}`) > 0 )
            .forEach(route => channel.consume(route, proxyFn));
        return target;
    }
}

export default MqGwProxyService;


