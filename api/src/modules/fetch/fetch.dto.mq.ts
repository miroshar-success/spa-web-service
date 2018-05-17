import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";
import {FetchClientName} from "./fetch.enums";
import {IsEnum} from 'class-validator';


/** FETCH DTO **/

// TODO REMOVE API PROPERTY
export class PersonFetchDtoMq {

    @IsEnum(FetchClientName)
    @ApiModelProperty()
    readonly clientName: FetchClientName;

    @ApiModelProperty()
    readonly person: PersonDto;
}

export class FetchExploreDtoMq extends PersonFetchDtoMq {
    @ApiModelProperty()
    readonly fetchUrl: string;
}

export class FetchDtoMq extends FetchExploreDtoMq {
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
    readonly resultUrls: string[];
}
