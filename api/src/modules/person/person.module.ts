import {Module} from '@nestjs/common';

import {DatabaseModule} from '../database/database.module';
import PersonController from './person.controller';
import personProvider from './person.provider';
import PersonService from "./person.service";
import PersonDataService from "./person.service.data";


@Module({
    modules: [DatabaseModule],
    controllers: [PersonController],
    components: [PersonService, PersonDataService, ...personProvider],
    exports: [PersonService]
})

export default class PersonModule {
}