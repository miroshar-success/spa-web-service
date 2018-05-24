import {Model} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import Person from './person.interface';
import CreatePersonDto from './person.dto';
import PersonDataService from "./person.service.data";

@Component()
export default class PersonService {
    constructor(private readonly personDataService: PersonDataService) {
    }

    async merge(createPersonDto: CreatePersonDto) {
        const {personKey, clientName} = createPersonDto
        let person = await this.personDataService.getByClientNameAndPersonKey(personKey, clientName);
        if (!person) {
            this.personDataService.create(createPersonDto);
        } else {

        }

    }
}