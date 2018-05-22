import {ApiModelProperty} from '@nestjs/swagger';


import PersonDto from "../person/person.dto";

/** FETCH DTO **/

export class CoreFetchDto {
    @ApiModelProperty()
    readonly person: PersonDto;
}

export class FetchExploreDto  extends CoreFetchDto{
    @ApiModelProperty()
    readonly fetchUrl: string;
}

// mq response
export class FetchExploreResultDto extends FetchExploreDto {
    readonly sampleUrls:string[]
}

export class FetchExploreSamplesDto {
    readonly selector: string;
    readonly sampleUrl: string;
}

export class FetchDto extends FetchExploreDto {
    @ApiModelProperty()
    readonly sampleUrl: string;
}

//mq response
export class FetchResultDto extends CoreFetchDto {
    readonly resultUrls: string[] = [];
}

/** SCANNER DTO **/

// COMMON

class BaseFetchScannerModelDto {
    readonly fetchId: string;
    readonly fetchUrl: string;
}

// SCANNER FETCH EXPLORE

export class FetchExploreScannerDto extends BaseFetchScannerModelDto{}

export class FetchExploreScannerResultDto extends FetchExploreScannerDto {
    readonly selectors:FetchExploreSamplesDto[]
}

// SCANNER FETCH

export class FetchScannerDto extends BaseFetchScannerModelDto{
    readonly selector: string;
    readonly lastResult: string;
}

export class FetchScannerResultDto extends BaseFetchScannerModelDto{
    readonly resultUrls: string[] = [];
    readonly isSelectorEmpty: boolean = false;
    readonly isSampleUrlNotFound: boolean = false;
}
