import { ApiModelProperty } from '@nestjs/swagger';


import {ClientName} from "../clients/clients.enums";

export default class PersonCoreDto {

  @ApiModelProperty()
  readonly clientName: ClientName;

  @ApiModelProperty()
  readonly personKey: object;

  @ApiModelProperty()
  personInfo: object;

}