import { ApiModelProperty } from '@nestjs/swagger';

import PersonTypes from '../person.type';

export default class CreatePersonDto {

  @ApiModelProperty()
  readonly clientName: PersonTypes;

  @ApiModelProperty()
  readonly personKey: object;

  @ApiModelProperty()
  readonly personInfo: object;

}