import { ApiModelProperty } from '@nestjs/swagger';

export class SignInPersonDto {

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly password: string;

}

export class SignUpPersonDto extends SignInPersonDto {

  @ApiModelProperty()
  readonly name: string;

}