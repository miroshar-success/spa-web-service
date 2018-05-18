import { ApiModelProperty } from '@nestjs/swagger';

import PersonTypes from '../person.type';

export default class CreatePersonDto {

  @ApiModelProperty()
  readonly personType: PersonTypes;

  @ApiModelProperty()
  readonly personId: string;

}