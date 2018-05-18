import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import Person from './interfaces/person.interface';
import PersonModel from './schemas/person.schema';
import CreatePersonDto from './dto/create-person.dto';

@Component()
export default class PersonService {
  constructor(@Inject('PersonModelToken') private readonly personModel: Model<Person>) { }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const createPersonDtoForMongoose = {
      personType: createPersonDto.personType.type,
      personId: createPersonDto.personId,
    }
    const createdPerson = new this.personModel(createPersonDtoForMongoose);
    return await createdPerson.save();
  }

  async find(offset: number, limit: number): Promise<Person[]> {
    return await PersonModel.paginate({}, { offset, limit })
      .then(result => result)
      .catch(error => console.log(error))
    // return await this.personModel.find().exec();
  }
}
