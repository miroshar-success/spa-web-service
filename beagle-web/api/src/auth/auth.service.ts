import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserService } from '../clients/user.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async createToken(email: JwtPayload) {
    const user: JwtPayload = email;
    return jwt.sign(user, 'secretKey');
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    console.log('authService - validateUser')
    return await this.userService.findOneByEmail(payload.email);
  }
}