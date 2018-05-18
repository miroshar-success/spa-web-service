import { ApiModelProperty } from '@nestjs/swagger';

import PersonTypes from '../person.type';
import { PersonInfo } from '../interfaces/person.interface';

export default class CreatePersonDto {

  @ApiModelProperty()
  readonly clientName: PersonTypes;

  @ApiModelProperty()
  readonly personKey: string;

  @ApiModelProperty()
  readonly personInfo: PersonInfo;

}