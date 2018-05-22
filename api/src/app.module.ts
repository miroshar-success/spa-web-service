import { Module } from '@nestjs/common';


import PersonModule from './modules/person/person.module';
import { FetchModuleModule } from './modules/fetch/fetch.module';
import {ScannerModule} from './modules/scanner/scanner.module';

@Module({
    modules: [FetchModuleModule, PersonModule, ScannerModule],
})
export class ApplicationModule { }