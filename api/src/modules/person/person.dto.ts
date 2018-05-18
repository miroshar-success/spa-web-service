import { ApiModelProperty } from '@nestjs/swagger';


import {ClientName} from "../clients/clients.enums";

export default class PersonDto {

  @ApiModelProperty()
  readonly clientName: ClientName;

  @ApiModelProperty()
  readonly personKey: object;

  @ApiModelProperty()
  readonly personInfo: object;

}