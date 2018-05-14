import {ApiModelProperty} from '@nestjs/swagger';

import {PersonDto} from "../person/person.dto";


export class FetchExploreDto {

    @ApiModelProperty()
    readonly path: string;

    @ApiModelProperty()
    readonly person: PersonDto;

}

export class FetchDto extends FetchExploreDto {

    @ApiModelProperty()
    readonly selector: string;

}
