import {ApiModelProperty} from '@nestjs/swagger';


import PersonDto from "../../person/person.dto";
import {FetchMessage} from "./fetch.message";
import {Meta, Sample, SampleOut, SelectorOut} from '../../scanner/scanner.sample';

/** FETCH DTO **/

export class CoreFetchDto {

    @ApiModelProperty()
    readonly person: PersonDto;
}

export class FetchExploreDto  extends CoreFetchDto{
    @ApiModelProperty()
    readonly fetchUrl: string;
}

//fetch explore result MQ
export class FetchExploreResultDto extends FetchExploreDto {
    readonly samples: SampleOut[];
    readonly meta: Meta;
}

export class FetchExploreSamplesDto {
    readonly selector: string;
    readonly sample: SampleOut;
}

export class FetchDto extends FetchExploreDto {
    @ApiModelProperty()
    readonly sampleUrl: string;
}

//fetch result MQ
export class FetchResultDto extends CoreFetchDto {
    readonly resultUrls: SampleOut[] = [];
    readonly meta: Meta = {} as  Meta;
}

/** ME MESSAGE DTO **/

//mq message
export class FetchMessageDto extends CoreFetchDto {
    readonly message: FetchMessage;
    readonly messageText?: string;
}


