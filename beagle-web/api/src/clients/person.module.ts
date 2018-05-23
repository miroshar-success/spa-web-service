import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonSchema } from './person.schema';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: 'Person',
    schema: PersonSchema,
  }]),
  ],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})

export class PersonModule { }