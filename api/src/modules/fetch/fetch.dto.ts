import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";
import {FetchClientName} from "./fetch.enums";

export class PersonFetchDto {

    @ApiModelProperty()
    readonly clientName: FetchClientName;

    @ApiModelProperty()
    readonly person: PersonDto;

}

export class FetchExploreDto extends PersonFetchDto {

    @ApiModelProperty()
    readonly fetchUrl: string;

}

export class FetchDto extends FetchExploreDto {

    @ApiModelProperty()
    readonly sampleUrl: string;

}

