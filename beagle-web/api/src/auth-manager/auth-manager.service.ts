import * as jwt from 'jsonwebtoken';
import { Injectable, BadRequestException } from '@nestjs/common';
import { SignInPersonDto } from '../clients/person.dto';
import { PersonService } from '../clients/person.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthManagerService {
  constructor(
    private readonly personService: PersonService,
    private readonly authService: AuthService,
  ) { }

  async authenticate({ email, password }: SignInPersonDto): Promise<any> {
    const foundedUser = await this.personService.findOneByEmail(email);
    if (!foundedUser) {
      throw new BadRequestException('authentication error');
    } else {
      if (await this.personService.compareHash(password, foundedUser.password)) {
        const accessToken = await this.authService.createToken({ email });
        return { accessToken }
      }
    }
    throw new BadRequestException('authentication error');
  }

  async logout() {

  }
}