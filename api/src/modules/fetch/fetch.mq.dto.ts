import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";
import {FetchClientName} from "./fetch.enums";

export interface BaseFetchMqDto {
    readonly clientName: FetchClientName;
}

export interface FetchExploreMqDto extends BaseFetchMqDto{
    readonly fetchId: string;
    readonly fetchUrl: string;
}

