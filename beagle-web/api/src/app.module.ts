import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthManagerModule } from './auth-manager/auth-manager.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthManagerModule, DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule { }