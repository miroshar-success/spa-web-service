import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PersonModule } from '../clients/person.module';

@Module({
  imports: [PersonModule],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }