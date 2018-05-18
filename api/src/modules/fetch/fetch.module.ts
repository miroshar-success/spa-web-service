import { Module } from '@nestjs/common';

import { FetchControllerMq } from './fetch.controller.mq';
import { FetchService } from "./fetch.service";
import { rabbitMqModule } from "../rabbit-mq/rabbit-mq.module";
import { fetchProviders } from "./fetch.providers";
import { DatabaseModule } from "../database/database.module";
import { AgendaModule } from "../agenda/agenda.module";
import { ScannerService } from "../scanner/scanner.service";
import { ScannerModule } from "../scanner/scanner.module";
import FetchDataController from "./fetch.controller.data";
import { ScannerClientMq } from "./scanner.client.mq";
import FetchDataService from "./fetch.service.data";

@Module({
  modules: [AgendaModule, rabbitMqModule, ScannerModule, DatabaseModule],
  controllers: [FetchControllerMq, FetchDataController],
  components: [FetchService, ScannerClientMq, ...fetchProviders, FetchDataService]
})
export class FetchModuleModule { }
