import {ApiModelProperty} from '@nestjs/swagger';


export class FetchDto {
    @ApiModelProperty()
    readonly path: string;

    //TODO ADD REAL PERSON TYPE
    @ApiModelProperty()
    readonly person: Object;

}

export class GuardDto extends FetchDto {

    @ApiModelProperty()
    readonly selector: string;

}
