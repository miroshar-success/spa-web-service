import * as jwt from 'jsonwebtoken';
import { Injectable, BadRequestException } from '@nestjs/common';
import { SignInUserDto } from '../clients/user.dto';
import { UserService } from '../clients/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthManagerService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  async authenticate({ email, password }: SignInUserDto): Promise<any> {
    const foundedUser = await this.userService.findOneByEmail(email);
    if (!foundedUser) {
      throw new BadRequestException('authentication error');
    } else {
      if (await this.userService.compareHash(password, foundedUser.password)) {
        const accessToken = await this.authService.createToken({ email });
        return { accessToken }
      }
    }
    throw new BadRequestException('authentication error');
  }

  async logout() {

  }
}