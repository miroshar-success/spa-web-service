import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthManagerModule } from './auth-manager/auth-manager.module';
import { DatabaseModule } from './database/database.module';
import { FetchResultsGw } from './fetch/fetch.mq.gw';

@Module({
  imports: [AuthManagerModule, DatabaseModule],
  controllers: [AppController],
  providers: [FetchResultsGw]
})
export class ApplicationModule { }