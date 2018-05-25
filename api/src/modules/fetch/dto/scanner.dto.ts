import {FetchExploreSamplesDto} from "./fetch.dto";
import {Meta, Sample, SampleOut} from '../../scanner/scanner.sample';

/** SCANNER DTO **/

// COMMON

class BaseFetchScannerModelDto {
    readonly fetchId: string;
    readonly fetchUrl: string;
}

// SCANNER FETCH EXPLORE

export class FetchExploreScannerDto extends BaseFetchScannerModelDto{}


export class FetchExploreScannerResultDto extends FetchExploreScannerDto {
    readonly selectors:FetchExploreSamplesDto[];
    readonly meta: Meta

}

// SCANNER FETCH

export class FetchScannerDto extends BaseFetchScannerModelDto{
    readonly selector: string;
    readonly lastResult: string;
}

export class FetchScannerResultDto extends BaseFetchScannerModelDto{
    readonly resultUrls: SampleOut[] = [];
    readonly isSelectorEmpty: boolean = false;
    readonly isSampleUrlNotFound: boolean = false;
}
