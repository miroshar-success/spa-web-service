import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";
import {FetchClientName} from "./fetch.enums";

export class BaseFetchDto {

    @ApiModelProperty()
    readonly clientName: FetchClientName;

}

export class FetchExploreDto extends BaseFetchDto{

    @ApiModelProperty()
    readonly fetchUrl: string;

    @ApiModelProperty()
    readonly person: PersonDto;

}

export class FetchDto extends FetchExploreDto {

    @ApiModelProperty()
    readonly selector: string;

}

