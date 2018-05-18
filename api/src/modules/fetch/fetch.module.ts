import { Module } from '@nestjs/common';

import { FetchController } from './fetch.mqcontroller';
import { FetchService } from "./fetch.service";
import FetchDataService from './fetch.service.data';
import FetchDataController from './fetch.controller';
import { rabbitMqModule } from "../rabbit-mq/rabbit-mq.module";
import { fetchProviders } from "./fetch.providers";
import { DatabaseModule } from "../database/database.module";
import { AgendaModule } from "../agenda/agenda.module";
import { ScannerService } from "../scanner/scanner.service";
import { ScannerModule } from "../scanner/scanner.module";

@Module({
  modules: [AgendaModule, rabbitMqModule, ScannerModule, DatabaseModule],
  controllers: [FetchController, FetchDataController],
  components: [FetchService, ...fetchProviders, FetchDataService]
})
export class FetchModuleModule { }
