import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import PersonService from './person.service';
import CreatePersonDto from './dto/create-person.dto';
import Person from './interfaces/person.interface';

@Controller('person')
export default class PersonController {
  constructor(private readonly personService: PersonService) { }

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto): Promise<void> {
    this.personService.create(createPersonDto);
  }

  @Get()
  async find(@Query() params: any, offset: number, limit: number): Promise<Person[]> {
    return await this.personService.find(+params.offset, +params.limit);
  }
}