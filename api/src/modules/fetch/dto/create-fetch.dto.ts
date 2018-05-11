import { ApiModelProperty } from '@nestjs/swagger';
import { IsLowercase, IsString, Length } from 'class-validator';

export class FetchDto {
  @ApiModelProperty()
  readonly path: string;

  //TODO ADD REAL PERSON TYPE
  @ApiModelProperty()
  readonly person: Object;

}
