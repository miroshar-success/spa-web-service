import {ApiModelProperty} from '@nestjs/swagger';

export class PersonDto {

    @ApiModelProperty()
    readonly personKey: string;

    @ApiModelProperty()
    readonly personInfo: Object;

}
