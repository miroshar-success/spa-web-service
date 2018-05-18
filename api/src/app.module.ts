import { Module } from '@nestjs/common';

import { ContactsModule } from './modules/contacts/contacts.module';
import PersonModule from './modules/person/person.module';
import { FetchModuleModule } from './modules/fetch/fetch.module';

@Module({
    modules: [ContactsModule, FetchModuleModule, PersonModule],
})
export class ApplicationModule { }