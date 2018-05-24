import { ApiModelProperty } from '@nestjs/swagger';

export class SignInUserDto {

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly password: string;

}

export class SignUpUserDto extends SignInUserDto {

  @ApiModelProperty()
  readonly name: string;

}