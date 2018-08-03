import { ApiModelProperty } from '@nestjs/swagger';

export default class CreateAuthorDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly surname: string;

    @ApiModelProperty()
    readonly lifetime: Date;    
}