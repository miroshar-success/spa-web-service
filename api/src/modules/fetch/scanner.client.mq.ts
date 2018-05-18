import {
    FetchExploreScannerDto, FetchExploreScannerResultDto,
    FetchExploreScannerSampleDto, FetchScannerDto, FetchScannerResultDto
} from "./fetch.dto.mq";
import {Component, OnModuleInit} from "@nestjs/common";
import {ScannerService} from "../scanner/scanner.service";
import {FetchService} from "./fetch.service";
import {FetchExploreSelectorModel} from "./fetch.model";
import {ModuleRef} from "@nestjs/core";

/** FETCH DTO **/


@Component()
export class ScannerClientMq implements OnModuleInit {

    private fetchService: FetchService;

    onModuleInit(): any {
        this.fetchService = this.moduleRef.get<FetchService>(FetchService);
    }

    constructor(private readonly moduleRef: ModuleRef,
                private readonly scannerService: ScannerService) {
    }

    // FIXME - ADD REAL CALL
    public async fetchExploreProduce(fetchExploreScannerDto: FetchExploreScannerDto) {

        let samples: FetchExploreScannerSampleDto[] = (await this.scannerService.fetchAll(fetchExploreScannerDto.fetchUrl))
            .sample
            .map(value => {
                return {sampleUrl: value.sampleUrl[0], selector: value.selector};
            })

        this.fetchExploreConsumer({
            fetchId: fetchExploreScannerDto.fetchId,
            fetchUrl: fetchExploreScannerDto.fetchUrl,
            selectors: samples
        });
    }

    // ADD AS CONSUMER
    private fetchExploreConsumer(fetchExploreScannerResultDto: FetchExploreScannerResultDto) {
        this.fetchService.fetchExploreResultConsumer(fetchExploreScannerResultDto);
    }


    /********** FETCH ********/

    // FIXME ADD MQ CALL
    public async fetchProduce(fetchScannerDto: FetchScannerDto) {

        let reslut = await this.scannerService.fetchOne(fetchScannerDto.fetchUrl, fetchScannerDto.selector, fetchScannerDto.lastResult);
        this.fetchConsume(
            {
                fetchId: fetchScannerDto.fetchId,
                fetchUrl: fetchScannerDto.fetchUrl,
                resultUrls: reslut.sampleUrl,
                isSampleUrlNotFound: reslut.isSampleUrlNotFound,
                isSelectorEmpty: reslut.isSelectorEmpty
            });
    }

    private async fetchConsume(fetchScannerResultDto: FetchScannerResultDto) {
        this.fetchService.fetchResultConsumer(fetchScannerResultDto);
    }

}
