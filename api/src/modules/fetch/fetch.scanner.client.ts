import { FetchExploreSamplesDto } from "./dto/fetch.dto";
import {Component, OnModuleInit} from "@nestjs/common";
import {FetchService} from "./fetch.service";
import {ModuleRef} from "@nestjs/core";
import {
    FetchExploreScannerDto, FetchExploreScannerResultDto, FetchScannerDto,
    FetchScannerResultDto
} from "./dto/scanner.dto";
import {MqGwDecorators} from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
import MqConsumer = MqGwDecorators.MqConsumer;
import MqProducer = MqGwDecorators.MqProducer;



@Component()
export class ScannerClient implements OnModuleInit {

    private static THIS;
    private fetchService: FetchService;

    onModuleInit(): any {
        this.fetchService = this.moduleRef.get<FetchService>(FetchService);
    }

    constructor(private readonly moduleRef: ModuleRef) {
        this.onModuleInit();
        ScannerClient.THIS = this;
    }

    @MqProducer({name:'fetchExplore', client:'scanner'})
    produceFetchExplore(message: any) {
        console.log('produceFetchExplore ', message);
        return message;
    }

    @MqProducer({name:'fetch', client:'scanner'})
    produceFetch(message: any) {
        console.log('produceFetch ', message);
        return message;
    }

    @MqProducer({name:'fetchMessage', client:'scanner'})
    produceFetchMessage(message: any) {
        console.log('produceFetchMessage', message);
        return message;
    }

    @MqConsumer({name:'fetchExploreResult', client:'scanner'})
    consumeFetchExploreResult(message: any) {
        console.log('consumeFetchExploreResult', message);
        const samples: FetchExploreSamplesDto[] = message
            .selectors
            .map(value => ({sample: value.sample, selector: value.selector}));
        this.fetchService.fetchExploreResultConsumer({...message,selectors:samples} as FetchExploreScannerResultDto);
    }

    @MqConsumer({name:'fetchResult', client:'scanner'})
    consumeFetchResult(message: any) {
        console.log('consumeFetchResult', message);
        const {sampleUrl:resultUrls, ...rest} = message;
        this.fetchService.fetchResultConsumer({...rest,resultUrls} as FetchScannerResultDto);
    }


}
