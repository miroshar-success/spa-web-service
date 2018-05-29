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
import isMqProducer = MqGwGuards.isMqProducer;
import isMqConsumer = MqGwGuards.isMqConsumer;
const chalk = require('chalk');
const warn = chalk.keyword('orange');


class MqGwProxyService {

    protected readonly root: string;
    protected readonly rootClients: string[];
    protected readonly components: Function[];
    protected readonly connectionConfig: ConnectionConfig;
    protected readonly routes: string[];
    protected scanResultsMap: {[uuid: string]: MqGwScanResult};
    protected scanResultsArr: MqGwScanResult[];
    protected connection: Connection;

    constructor({root, clients, components, connection}: MqGwConfigType){
        this.root = root;
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
            else if (isMqProducer(method)) this.producer(method).then(proxyFn => prototype[key] = proxyFn);
            else if (isMqConsumer(method)) this.consumer(method).then(proxyFn => prototype[key] = proxyFn);
        });
    }

    protected channel(){
        return Promise.resolve(this.connection.createChannel());
    }
    protected async producer(target: Function) {
        const channel = await this.channel();
        const root = this.root;
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetGwKey = this.scanResultsMap[targetUuid].gwKey && this.scanResultsMap[targetUuid].gwKey.split('.');
        const targetClient = this.scanResultsMap[targetUuid].client;
        const targetMethodRoute = this.scanResultsMap[targetUuid].mRoute;
        const targetRoutes = this.routes.filter(route => route.indexOf(`.${targetMethodRoute}`) > 0);
        const proxyFn = function () {
            const result: any = target.apply(this, arguments);
            if (result) console.log(chalk.yellow(`[mq-gw-api] - [producer] ${targetMethodRoute} [return] `), result.fields);
            else {
                console.log(warn(`[mq-gw-api] - [producer] ${targetMethodRoute} [ WARNING ] Message rejected! Producer result is null.`));
                return result;
            }
            if (result.then && typeof result.then === 'function') {
                return result.then(data => {
                    if(!data){
                        console.log(warn(`[mq-gw-api] - [producer] [ WARNING ] Message rejected! Can not send null.`));
                        return Promise.resolve(data);
                    }
                    console.log(chalk.yellow(`[mq-gw-api] - [producer] ${targetMethodRoute} [resolved] `), data.fields);
                    if(typeof targetGwKey !== 'undefined'){
                        const msgGateway = targetGwKey.reduce((msg,key)=>msg && msg[key],data);
                        if (msgGateway) {
                            return Promise.resolve(targetRoutes
                                .filter(route => msgGateway === route.split('.')[1])
                                .map(route => console.log(chalk.blue(`[mq-gw-api] - [mq-gw-producer] ${targetMethodRoute} [route] send to ${route}`)) || route)
                                .map(route => channel.sendToQueue(route, Buffer.from(JSON.stringify(data), 'utf8'), {durable:true})))
                        }
                        console.log(warn(`[mq-gw-api] - [mq-gw-producer] ${targetMethodRoute} [ WARNING ] Message rejected! Missing gateway property ${targetGwKey}.`));
                        return Promise.resolve(data);
                    } else if (targetClient) {
                        const route = `${root}.${targetClient}.${targetMethodRoute}`;
                        console.log(chalk.blue(`[mq-gw-api] - [mq-producer] ${targetMethodRoute} [route] send to ${route}`))
                        return Promise.resolve(channel.sendToQueue(route, Buffer.from(JSON.stringify(data), 'utf8'), {durable:true}));
                    }
                });
            }
            if(targetGwKey){
                const msgGateway = targetGwKey.reduce((msg,key)=>msg && msg[key],result);
                if (msgGateway){
                    return targetRoutes
                        .filter(route => msgGateway === route.split('.')[1])
                        .map(route => console.log(chalk.blue(`[mq-gw-api] - [mq-gw-producer] ${targetMethodRoute} [route] send to ${route}`)) || route)
                        .map(route => channel.sendToQueue(route, Buffer.from(JSON.stringify(result),'utf8'),{durable:true}));
                }
                console.log(warn(`[mq-gw-api] - [mq-gw-producer] ${targetMethodRoute} [ WARNING ]  Message rejected! Missing gateway property ${targetGwKey}.`));
                return Promise.resolve(result);
            } else if (targetClient) {
                const route = `${root}.${targetClient}.${targetMethodRoute}`;
                console.log(chalk.blue(`[mq-gw-api] - [mq-producer] ${targetMethodRoute} [route] send to ${route}`))
                return Promise.resolve(channel.sendToQueue(route, Buffer.from(JSON.stringify(result), 'utf8'),{durable:true}));
            }
            return Promise.resolve(result);
        };
        return proxyFn;
    }
    protected async consumer(target: Function) {
        const channel = await this.channel();
        const root = this.root;
        const targetUuid = MqGwScanService.scanKey(target)(MQ_GW_METHOD_UUID_METADATA);
        const targetGwKey = this.scanResultsMap[targetUuid].gwKey && this.scanResultsMap[targetUuid].gwKey.split('.');
        const targetMethodRoute = this.scanResultsMap[targetUuid].mRoute;
        const targetClient = this.scanResultsMap[targetUuid].client;
        const targetClass: any = this.scanResultsMap[targetUuid].prototype.constructor;
        const proxyFn = function (message){

            if(message) console.log(chalk.yellow(`[mq-gw-api] - [consumer] ${targetMethodRoute} [message] `), message.fields);
            else {
                console.log(warn(`[mq-gw-api] - [consumer] ${targetMethodRoute} [ WARNING ] Message rejected! Can not consume null.`));
                return Promise.resolve(message);
            }

            let content;
            try {
                content = JSON.parse(message.content);
            } catch (error){
                console.log(chalk.red(`[mq-gw-api] - [consumer] ${targetMethodRoute} [message-content] Can not parse json object `), error);
                return Promise.reject(error);
            }
            if(!content){
                console.log(warn(`[mq-gw-api] - [consumer] ${targetMethodRoute} [ WARNING ] Message rejected! Content is null.`));
                return Promise.resolve(content);
            }
            content && console.log(chalk.yellow(`[mq-gw-api] - [consumer] ${targetMethodRoute} [message-content] `), content);
            if (targetGwKey){
                const msgGateway = targetGwKey.reduce((msg,key)=>msg && msg[key],content);
                if (!msgGateway) {
                    console.log(warn(`[mq-gw-api] - [mq-gw-consumer] ${targetMethodRoute} [ WARNING ] Message rejected! Missing gateway property ${targetGwKey}.`));
                    return Promise.resolve(content);
                }
            }
            try {
                target.call(targetClass.THIS, content);
                channel.ack(message);
                console.log(warn(`[mq-gw-api] - [consumer] ${targetMethodRoute} [ SUCCESS ] Message consumed.`));
                return Promise.resolve(content);
            } catch (error){
                console.log(chalk.red(`[mq-gw-api] - [consumer] ${targetMethodRoute} [error] `), error);
                channel.nack(message);
                return Promise.reject(error);
            }
        };
        if(targetGwKey){
            this.routes
                .filter(route => route.indexOf(`.${targetMethodRoute}`) > 0 )
                .map(route => console.log(chalk.blue(`[mq-gw-api] - [mq-gw-consumer] ${targetMethodRoute} [route] consume from ${route}`)) || route)
                .forEach(route => channel.consume(route, proxyFn));
        }
        else if (targetClient){
            const route = `${root}.${targetClient}.${targetMethodRoute}`;
            console.log(chalk.blue(`[mq-gw-api] - [mq-consumer] ${targetMethodRoute} [route] consume from ${route}`));
            channel.consume(route, proxyFn);
        }
        return target;
    }
}

export default MqGwProxyService;


