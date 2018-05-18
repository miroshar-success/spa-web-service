import { ApiModelProperty } from '@nestjs/swagger';

import { PersonType } from './person.type';

export class PersonDto {

    @ApiModelProperty()
    readonly personType: PersonType;

    @ApiModelProperty()
    readonly personKey: object;

}