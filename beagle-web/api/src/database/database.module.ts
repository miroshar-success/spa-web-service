import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://beagle-mongo:27017/beagle-web')]
})
export class DatabaseModule { }