import {Component,OnModuleInit} from "@nestjs/common";
import {ModuleRef} from "@nestjs/core";
import {MqGwDecorators} from "../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
import {ScannerService} from "./scanner.service";
import MqProducer = MqGwDecorators.MqProducer;
import MqConsumer = MqGwDecorators.MqConsumer;


@Component()
export class ApiClient implements OnModuleInit {
    private static THIS;
    private scannerService: ScannerService;

    constructor(private readonly moduleRef: ModuleRef){
        this.onModuleInit();
        ApiClient.THIS = this;
        // setTimeout(() => this.produceFetchMessage({clientName:'scanner',payload:"Hello",status:0}), 5000);
    }

    onModuleInit() {
        this.scannerService = this.moduleRef.get<ScannerService>(ScannerService);
    }

    @MqProducer({client:'scanner', name: 'fetchExploreResult' })
    async produceFetchExploreResult(message: any){
        // console.log('produceFetchExploreResult', message);
        return message;
    }

    @MqProducer({client:'scanner', name: 'fetchResult' })
    async produceFetchResult(message: any){
        // console.log('produceFetchResult', message);
        return message;
    }

    @MqProducer({client:'scanner', name: 'fetchMessage' })
    async produceFetchMessage(message: any){
        // console.log('produceFetchMessage', message);
        return message;
    }

    @MqConsumer({client: 'scanner', name: 'fetchExplore'})
    async consumeFetchExplore(message: any){
        // console.log('consumeFetchExplore', message);
        this.scannerService.fetchAll(message);
    }

    @MqConsumer({client: 'scanner', name:'fetch', prefetch:1})
    async consumeFetch(message: any){
        // console.log('consumeFetch', message);
        this.scannerService.fetchOne(message);
    }

    @MqConsumer({client: 'scanner', name: 'fetchMessage'})
    async consumeFetchMessage(message: any){
        // console.log('consumeFetchMessage', message);
    }

}