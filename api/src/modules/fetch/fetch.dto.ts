import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";
import {FetchClientName} from "./fetch.enums";
import { IsEnum} from 'class-validator';

export class PersonFetchDto {

    @IsEnum(FetchClientName)
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

