import { ApiModelProperty } from '@nestjs/swagger';
import { IsLowercase, IsString, Length } from 'class-validator';

export class CreateContactDto {
  @ApiModelProperty()
  @IsString()
  @Length(5, 128)
  readonly name: string;

  @ApiModelProperty()
  @IsString()
  @IsLowercase()
  readonly email: string;

  @ApiModelProperty()
  readonly phone: string;
}
