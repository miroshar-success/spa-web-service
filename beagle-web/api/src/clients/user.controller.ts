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

  @Post('auth/signup')
  async signUp(@Body() user: SignUpUserDto): Promise<void> {
    await this.userService.signUp(user);
  }

  @Get('test')
  test(): string {
    return 'test';
  }

  @Get('test2')
  test2(): string {
    return 'test2';
  }

}