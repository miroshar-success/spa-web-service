import { Module } from '@nestjs/common';

import { ContactsModule } from './modules/contacts/contacts.module';

@Module({
    modules: [ContactsModule],
})
export class ApplicationModule {}