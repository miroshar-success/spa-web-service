import { ApiModelProperty } from '@nestjs/swagger';

import CreatePersonDto from '../person/dto/create-person.dto';


export class FetchExploreDto {

    @ApiModelProperty()
    readonly path: string;

    @ApiModelProperty()
    readonly person: CreatePersonDto;

}

export class FetchDto extends FetchExploreDto {

    @ApiModelProperty()
    readonly selector: string;

}
