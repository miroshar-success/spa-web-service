import * as jwt from 'jsonwebtoken';
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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
        return { accessToken, name: foundedUser.name }
      }
    }
    throw new BadRequestException('authentication error');
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    // verify token
    const decoded = jwt.verify(accessToken, 'secretKey')
    if (decoded) {
      const foundedUser = await this.userService.findOneByEmail(decoded.email);
      if (!foundedUser) {
        throw new UnauthorizedException();
      }
      return foundedUser.name;
    }
    throw new UnauthorizedException('unauthorized exception');
  }

  async logout() {

  }
}