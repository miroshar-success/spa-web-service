import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import Person from './interfaces/person.interface';
import PersonModel from './schemas/person.schema';
import CreatePersonDto from './dto/create-person.dto';

export interface Response {
  docs: Array<CreatePersonDto>;
  total: number;
}

@Component()
export default class PersonService {
  constructor(@Inject('PersonModelToken') private readonly personModel: Model<Person>) { }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const {
      clientName: { type },
      personKey,
      personInfo,
    } = createPersonDto;

    const createPersonDtoForMongoose = {
      clientName: type,
      personKey,
      personInfo,
    }
    const createdPerson = new this.personModel(createPersonDtoForMongoose);
    return await createdPerson.save();
  }

  async find(offset: number, limit: number): Promise<Person[]> {
    return await PersonModel.paginate({}, { offset, limit })
      .then(result => result)
      .catch(error => console.log(error))
  }

  findPerson(searchString, response): void {
    if (searchString.length === 0) {
      PersonModel.find({}).exec((err, persons) => {
        response.send(this.getResponse(persons));
      })
    } else {
      PersonModel.find({ $text: { $search: searchString } }).exec((err, persons) => {
        if (!err) {
          response.send(this.getResponse(persons));
        }
      })
    }
  }

  private getResponse(persons): Response {
    return {
      docs: persons.slice(0, 10).filter(Boolean),
      total: persons.length,
    }
  }
}
