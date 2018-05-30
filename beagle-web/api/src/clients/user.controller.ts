import {
  Controller,
  Get,
  Body,
  Post,
} from '@nestjs/common';
import { SignUpUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('beagle-web')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post('signup')
  async signUp(@Body() user: SignUpUserDto): Promise<void> {
    await this.userService.signUp(user);
  }

}