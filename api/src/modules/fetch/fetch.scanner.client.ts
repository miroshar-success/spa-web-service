import {
    FetchExploreSamplesDto
} from "./dto/fetch.dto";
import {Component, OnModuleInit} from "@nestjs/common";
import {ScannerService} from "../../../../scanner/src/modules/scanner.service";
import {FetchService} from "./fetch.service";
import {FetchExploreSelectorModel} from "./fetch.model";
import {ModuleRef} from "@nestjs/core";
import {
    FetchExploreScannerDto, FetchExploreScannerResultDto, FetchScannerDto,
    FetchScannerResultDto
} from "./dto/scanner.dto";
import {FetchOut} from "../../../../scanner/src/modules/scanner.sample";
import {MqGwDecorators} from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
import MqConsumer = MqGwDecorators.MqConsumer;
import MqProducer = MqGwDecorators.MqProducer;



@Component()
export class ScannerClient implements OnModuleInit {

    private fetchService: FetchService;

    onModuleInit(): any {
        this.fetchService = this.moduleRef.get<FetchService>(FetchService);
    }

    constructor(private readonly moduleRef: ModuleRef,
                private readonly scannerService: ScannerService) {}

    /********** LEGACY FETCHES ********/
    // public async fetchExploreProduce(fetchExploreScannerDto: FetchExploreScannerDto) {
    //     let fetches: FetchOut = (await this.scannerService.fetchAll(fetchExploreScannerDto.fetchUrl));
    //     let samples: FetchExploreSamplesDto[] = fetches
    //         .selectors
    //         .map(value => {
    //             return {sample: value.sample, selector: value.selector};
    //         });
    //     this.fetchExploreConsumer({
    //         fetchId: fetchExploreScannerDto.fetchId,
    //         fetchUrl: fetchExploreScannerDto.fetchUrl,
    //         selectors: samples,
    //         meta: fetches.meta
    //     });
    // }
    // private fetchExploreConsumer(fetchExploreScannerResultDto: FetchExploreScannerResultDto) {
    //     this.fetchService.fetchExploreResultConsumer(fetchExploreScannerResultDto);
    // }
    // public async fetchProduce(fetchScannerDto: FetchScannerDto) {
    //     let reslut = await this.scannerService.fetchOne(fetchScannerDto.fetchUrl, fetchScannerDto.selector, fetchScannerDto.lastResult);
    //     this.fetchConsume(
    //         {
    //             fetchId: fetchScannerDto.fetchId,
    //             fetchUrl: fetchScannerDto.fetchUrl,
    //             resultUrls: reslut.sampleUrl,
    //             isSampleUrlNotFound: reslut.isSampleUrlNotFound,
    //             isSelectorEmpty: reslut.isSelectorEmpty
    //         });
    // }
    // private async fetchConsume(fetchScannerResultDto: FetchScannerResultDto) {
    //     this.fetchService.fetchResultConsumer(fetchScannerResultDto);
    // }


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

    @MqConsumer({name:'fetchExplore ', client:'scanner'})
    consumeFetchExploreResult(message: FetchOut) {
        console.log('consumeFetchExploreResult', message);
        const samples: FetchExploreSamplesDto[] = message
            .selectors
            .map(value => ({sample: value.sample, selector: value.selector}));
        this.fetchService.fetchExploreResultConsumer({...message,selectors:samples} as FetchExploreScannerResultDto);
    }

    @MqConsumer({name:'fetch', client:'scanner'})
    consumeFetchResult(message: any) {
        console.log('consumeFetchResult', message);
        const {sampleUrl:resultUrls, ...rest} = message;
        this.fetchService.fetchResultConsumer({...rest,resultUrls} as FetchScannerResultDto);
    }

    @MqConsumer({name:'fetchMessage', client:'scanner'})
    consumeFetchMessage(message: any) {
        console.log('consumeFetchMessage', message);
    }


}
