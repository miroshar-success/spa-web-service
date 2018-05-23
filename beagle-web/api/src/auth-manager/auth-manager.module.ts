import * as passport from 'passport';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
// import { PersonModule } from '../../../../api/src/modules/person/person.module';
import PersonController from '../../../../api/src/modules/person/person.controller';
import { AuthModule } from '../auth/auth.module';
import { PersonModule } from '../clients/person.module';
import { AuthManagerController } from './auth-manager.controller';
import { AuthManagerService } from './auth-manager.service';
// import { PersonController } from '../clients/person.controller'

@Module({
  imports: [PersonModule, AuthModule],
  providers: [AuthManagerService],
  controllers: [AuthManagerController],
})
// export class AuthManagerModule { }
export class AuthManagerModule implements NestModule {

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes(PersonController);
  }
}