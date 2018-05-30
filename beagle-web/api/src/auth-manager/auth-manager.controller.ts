import { Controller, Post, Body, Get, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthManagerService } from './auth-manager.service';
import { SignInUserDto } from '../clients/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('beagle-web')
export class AuthManagerController {

  constructor(
    private readonly authManagerService: AuthManagerService
  ) { }

  @Post('auth/signin')
  async signIn(@Body() user: SignInUserDto): Promise<any> {
    return await this.authManagerService.authenticate(user);
  }

  @Get('auth/current')
  async getCurrentUser(@Req() req): Promise<any> {
    return await this.authManagerService.getCurrentUser(req.headers.authorized);
  }

  // @Get('auth/test')
  // @UseGuards(AuthGuard('jwt'))
  // test(): string {
  //   return 'test'
  // }

  @Post('auth/signout')
  async signOut(): Promise<any> {

  }
}