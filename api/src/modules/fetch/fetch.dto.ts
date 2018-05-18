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

export class FetchDto extends FetchExploreDto {
    @ApiModelProperty()
    readonly sampleUrl: string;
}

/** SCANNER DTO **/

// COMMON

class BaseFetchModelDto {
    readonly fetchId: string;
    readonly fetchUrl: string;
}


// FETCH EXPLORE

export class FetchExploreScannerDto extends BaseFetchModelDto{}

export class FetchExploreScannerResultDto extends FetchExploreScannerDto {
    readonly selectors:FetchExploreScannerSampleDto[]
}

export class FetchExploreScannerSampleDto {
    readonly selector: string;
    readonly sampleUrl: string;
}

// FETCH

export class FetchScannerDto extends BaseFetchModelDto{
    readonly selector: string;
    readonly lastResult: string;
}

export class FetchScannerResultDto extends BaseFetchModelDto{
    readonly resultUrls: string[] = [];
    readonly isSelectorEmpty: boolean = false;
    readonly isSampleUrlNotFound: boolean = false;
}
