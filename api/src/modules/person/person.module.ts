import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import PersonController from './person.controller';
import personProvider from './person.provider';
import PersonService from './person.service';

@Module({
  modules: [DatabaseModule],
  controllers: [PersonController],
  components: [PersonService, ...personProvider],
  // exports: [PersonController]
})

export default class PersonModule { }