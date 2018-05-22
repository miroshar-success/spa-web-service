import {Channel, connect, Connection} from 'amqplib';
import {MqGwTypes} from "../types/mq.gw.types";
import MqGwProducer = MqGwTypes.MqGwProducer;
import MqGwConsumer = MqGwTypes.MqGwConsumer;
import ProxyConfig = MqGwTypes.ProxyConfig;
import MqGwScanService from './mq.gw.scan.service';
import Runnable = MqGwTypes.Runnable;
import {MqGwGuards} from "../guards/mq.gw.guards";
import isMqGwConsumer = MqGwGuards.isMqGwConsumer;
import isMqGwProducer = MqGwGuards.isMqGwProducer;
import MqGwScanResult = MqGwTypes.MqGwScanResult;




class MqGwProxyService {// implements MqGwProducer, MqGwConsumer, Runnable {

    private readonly root: string;
    private readonly clients: string[];
    private readonly components: Function[];
    private readonly connection: Connection;
    private readonly scanResults: MqGwScanResult[];

    constructor({root, clients, components, connection}: ProxyConfig){
        this.root = root;
        this.clients = clients;
        this.components = components;
        this.connection = connection;
        this.scanResults = MqGwScanService.scan(this.components);
    }

    async run(){

        console.log(`SCAN(${this.components.map(c=>c.name)}): `, this.scanResults);

        this.scanResults.forEach(({key, value: {prototype, method}}) => {
            if (isMqGwConsumer(method)) prototype[key] = this.consume(method);
            else if (isMqGwProducer(method)) prototype[key] = this.produce(method);
        });


        const queueNames: string[] = this.clients
            .map(client => `${this.root}.${client}`)
            .map(rootClient => this.scanResults.map(({value:{gw}}) => `${rootClient}.${gw}`))
            .reduce((prev, cur) => [...prev,...cur], []);

        this.connection.createChannel().then(channel => queueNames.forEach(queueName => channel.assertQueue(queueName)));

    }



    produce(target: Function) {
        const proxy = this;
        const proxyFunction =  function () {
            console.log(`Produce to ${proxy.root}.${proxy.clients} with connection ${proxy.connection}`);
            const result = target.apply(this, arguments);
            console.log("DATA:", result);
            return result;
        };
        (proxyFunction as any).mqApiProxyTarget = target;
        return proxyFunction;
    }
    consume(target: Function) {
        const proxy = this;
        const proxyFunction =  function () {
                console.log(`Consume from ${proxy.root}.${proxy.clients} with connection ${proxy.connection}`);
                const result = target.apply(this, arguments);
                console.log("DATA:", result);
                return result;
        };
        (proxyFunction as any).mqApiProxyTarget = target;
        return proxyFunction;
    }
}

export default MqGwProxyService;


