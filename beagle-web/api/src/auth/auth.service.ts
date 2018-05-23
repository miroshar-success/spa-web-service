import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { PersonService } from '../clients/person.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly personService: PersonService) { }

  async createToken(email: JwtPayload) {
    const user: JwtPayload = email;
    return jwt.sign(user, 'secretKey');
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.personService.findOneByEmail(payload.email);
  }
}