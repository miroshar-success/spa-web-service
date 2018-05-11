import { Module } from '@nestjs/common';

import { ContactsModule } from './modules/contacts/contacts.module';
import { FetchModuleModule } from './modules/fetch/fetch.module';

@Module({
    modules: [ContactsModule, FetchModuleModule],
})
export class ApplicationModule {}