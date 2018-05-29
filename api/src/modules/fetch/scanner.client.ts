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

/** FETCH DTO **/


@Component()
export class ScannerClient implements OnModuleInit {

    private fetchService: FetchService;

    onModuleInit(): any {
        this.fetchService = this.moduleRef.get<FetchService>(FetchService);
    }

    constructor(private readonly moduleRef: ModuleRef,
                private readonly scannerService: ScannerService) {
    }

    // FIXME - ADD REAL CALL
    public async fetchExploreProduce(fetchExploreScannerDto: FetchExploreScannerDto) {
        let fetches: FetchOut = (await this.scannerService.fetchAll(fetchExploreScannerDto.fetchUrl));
        let samples: FetchExploreSamplesDto[] = fetches
            .selectors
            .map(value => {
                return {sample: value.sample, selector: value.selector};
            });

        this.fetchExploreConsumer({
            fetchId: fetchExploreScannerDto.fetchId,
            fetchUrl: fetchExploreScannerDto.fetchUrl,
            selectors: samples,
            meta: fetches.meta
        });
    }

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
