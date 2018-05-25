import {connect, Connection} from 'amqplib';
import {MqGwTypes} from "../types/mq.gw.types";

import MqGwScanService from './mq.gw.scan.service';
import {MqGwGuards} from "../guards/mq.gw.guards";
import isMqGwConsumer = MqGwGuards.isMqGwConsumer;
import isMqGwProducer = MqGwGuards.isMqGwProducer;
import MqGwScanResult = MqGwTypes.MqGwScanResult;
import {MqGwConstants} from "../constants/mq.gw.constants";
import MQ_GW_METHOD_UUID_METADATA = MqGwConstants.MQ_GW_METHOD_UUID_METADATA;
import MqGwConfigType = MqGwTypes.MqGwConfigType;
import ConnectionConfig = MqGwTypes.ConnectionConfig;
import Bluebird = require("bluebird");
const chalk = require('chalk');
const warn = chalk.keyword('orange');


class MqGwProxyService {

    protected readonly rootClients: string[];
    protected readonly components: Function[];
    protected readonly connectionConfig: ConnectionConfig;
    protected readonly routes: string[];
    protected scanResultsMap: {[uuid: string]: MqGwScanResult};
    protected scanResultsArr: MqGwScanResult[];
    protected connection: Connection;

    constructor({root, clients, components, connection}: MqGwConfigType){
        this.components = components;
        this.rootClients = clients.map(client => `${root}.${client}`);
        this.scanResultsMap = MqGwScanService.scan(this.components);
        this.scanResultsArr = Object.keys(this.scanResultsMap).map(uuid => this.scanResultsMap[uuid]);

        this.connectionConfig = connection;
        this.routes = this.rootClients
            .map(rootClient => Array.from(new Set(this.scanResultsArr.map(({mRoute})=>mRoute)))
                                     .map(uniqueRoute =>`${rootClient}.${uniqueRoute}`))
            .reduce((prev, cur) => [...prev, ...cur], []);
    }

    async connect(){
        try {
            this.connection =  await Promise.resolve(connect(this.connectionConfig));
            console.log(chalk.green(`[mq-gw-api] - [connect] success ${this.connection}`));
        } catch (err){
            console.log(chalk.red(err));
        }

        try {
            let channel = await Promise.resolve(this.connection.createChannel());
            console.log(chalk.green(`[mq-gw-api] - [routes] ${this.routes.join(' ')}`));
            return Promise.all(this.routes.map(queueName => channel.assertQueue(queueName)).map(bp => Promise.resolve(bp)));
        } catch (err){
            console.log(chalk.red(err));
        }
    }
    proxify(){

        console.log(chalk.green(`[mq-gw-api] - [scan-components] ${this.components.map(cmp=>cmp.name)} [methods] `), this.scanResultsArr);

        this.scanResultsArr.forEach(({key, method, prototype}) => {
            if (isMqGwConsumer(method)) this.consumer(method).then(proxyFn => prototype[key] = proxyFn);
            else if (isMqGwProducer(method)) this.producer(method).then(proxyFn => prototype[key] = proxyFn);
        });
    }

    protected channel(){
        return Promise.resolve(this.connection.createChannel());
    }
    protected async producer(target: Function) {
        const channel = await this.channel();
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetGwKey = this.scanResultsMap[targetUuid].gwKey;
        const targetMethodRoute = this.scanResultsMap[targetUuid].mRoute;
        const targetRoutes = this.routes.filter(route => route.indexOf(`.${targetMethodRoute}`) > 0);
        const proxyFn = function () {
            const result: any = target.apply(this, arguments);
            if (result) console.log(chalk.yellow(`[mq-gw-api] - [producer] ${targetMethodRoute} [return] `), result);
            else {
                console.log(warn(`[mq-gw-api] - [producer] ${targetMethodRoute} [ WARNING ] Message rejected! Producer result is null.`));
                return result;
            }
            if (result.then && typeof result.then === 'function') {
                return result.then(data => {
                    if (data && data[targetGwKey]) console.log(chalk.yellow(`[mq-gw-api] - [producer] ${targetMethodRoute} [resolved] `), data);
                    else if (data && !(data[targetGwKey])){
                        console.log(warn(`[mq-gw-api] - [producer] [ WARNING ] Message rejected! Missing gateway property ${targetGwKey}.`));
                        return Promise.resolve(data);
                    }
                    else {
                        console.log(warn(`[mq-gw-api] - [producer] [ WARNING ] Message rejected! Can not send null.`));
                        return Promise.resolve(data);
                    }
                    return Promise.resolve(targetRoutes
                        .filter(route => data[targetGwKey] === route.split('.')[1])
                        .map(route => console.log(chalk.blue(`[mq-gw-api] - [producer] ${targetMethodRoute} [route] send to ${route}`)) || route)
                        .map(route => channel.sendToQueue(route, new Buffer(JSON.stringify(data), 'utf8'))))
                });
            }
            if (result[targetGwKey]){
                return targetRoutes
                    .filter(route => result[targetGwKey] === route.split('.')[1])
                    .map(route => console.log(chalk.blue(`[mq-gw-api] - [producer] ${targetMethodRoute} [route] send to ${route}`)) || route)
                    .map(route => channel.sendToQueue(route, new Buffer(JSON.stringify(result), 'utf8')));

            }
            console.log(warn(`[mq-gw-api] - [producer] [ WARNING ]  Message rejected! Missing gateway property ${targetGwKey}.`));
            return Promise.resolve(result);

        };
        return proxyFn;
    }
    protected async consumer(target: Function) {
        const channel = await this.channel();
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetGwKey = this.scanResultsMap[targetUuid].gwKey;
        const targetMethodRoute = this.scanResultsMap[targetUuid].mRoute;
        const targetClient = this.scanResultsMap[targetUuid].client;
        const targetClass: any = this.scanResultsMap[targetUuid].prototype.constructor;
        const proxyFn = function (message){

            if(message) console.log(chalk.yellow(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [message] `), message);
            else {
                console.log(warn(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [ WARNING ] Message rejected! Can not consume null.`));
                return Promise.resolve(message);
            }

            let content;
            try {
                content = JSON.parse(message.content);
            } catch (error){
                console.log(chalk.red(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [message-content] Can not parse json object `), error);
                return Promise.reject(error);
            }
            if(content && content[targetGwKey]) console.log(chalk.yellow(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [message-content] `), content);
            else if (content && !(content[targetGwKey])) {
                console.log(warn(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [ WARNING ] Message rejected! Missing gateway property ${targetGwKey}.`));
                return Promise.resolve(content);
            }
            else {
                console.log(warn(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [ WARNING ] Message rejected! Content is null.`));
                return Promise.resolve(content);
            }
            try{
                target.call(targetClass.THIS, content);
                channel.ack(message);
                return Promise.resolve(content);
            } catch (error){
                console.log(chalk.red(`[mq-gw-api] - [consumer] ${targetClient||''}.${targetMethodRoute} [error] `), error);
                channel.nack(message);
                return Promise.reject(error);
            }
        };
        this.routes
            .filter(route => route.indexOf(`.${targetMethodRoute}`) > 0 )
            .filter(route => {
                if(targetClient) return targetClient === route.split('.')[1];
                else return true;
            })
            .map(route => console.log(chalk.blue(`[mq-gw-api] - [consumer] ${targetMethodRoute} [route] consume from ${route}`)) || route)
            .forEach(route => channel.consume(route, proxyFn));
        return target;
    }
}

export default MqGwProxyService;


