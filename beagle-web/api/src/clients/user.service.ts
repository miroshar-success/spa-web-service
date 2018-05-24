import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.schema';
import { SignInUserDto, SignUpUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  private saltRounds = 10;

  constructor(@InjectModel('User') private readonly userModel: Model<UserModel>) { }

  async signUp(user: SignUpUserDto): Promise<void> {
    const foundedUser = await this.findOneByEmail(user.email);
    if (foundedUser) {
      throw new BadRequestException('User with current email already exist!');
    } else {
      const passwordHash = await this.getHash(user.password);
      const createdPerson = new this.userModel({
        ...user,
        password: passwordHash,
      });
      await createdPerson.save();
    }

  }

  async findAll(): Promise<UserModel[]> {
    return await this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<UserModel> {
    return await this.userModel.findOne({ email });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

}