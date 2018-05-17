import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";
import {FetchClientName} from "./fetch.enums";

export interface FetchExploreMqDto {
    readonly fetchId: string;
    readonly fetchUrl: string;
}

export interface FetchExplore extends FetchExploreMqDto{
    readonly sampleUrl: string;
    readonly selector: string;
}