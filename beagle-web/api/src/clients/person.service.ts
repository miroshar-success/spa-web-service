import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { PersonModel } from './person.schema';
import { SignInPersonDto, SignUpPersonDto } from './person.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonService {

  private saltRounds = 10;

  constructor(@InjectModel('Person') private readonly personModel: Model<PersonModel>) { }

  async signUp(user: SignUpPersonDto): Promise<void> {
    const foundedUser = await this.findOneByEmail(user.email);
    if (foundedUser) {
      throw new BadRequestException('User with current email already exist!');
    } else {
      const passwordHash = await this.getHash(user.password);
      const createdPerson = new this.personModel({
        ...user,
        password: passwordHash,
      });
      await createdPerson.save();
    }

  }

  async findAll(): Promise<PersonModel[]> {
    return await this.personModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<PersonModel> {
    return await this.personModel.findOne({ email });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

}