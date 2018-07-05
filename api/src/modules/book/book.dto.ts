import { ApiModelProperty } from '@nestjs/swagger';

export default class CreateBookDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly author: string;

    @ApiModelProperty()
    readonly cost: number;

    @ApiModelProperty()
    readonly url: string;
}