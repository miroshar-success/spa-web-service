import { Module } from '@nestjs/common';

import { FetchController } from './fetch.controller';
import { FetchService } from "./fetch.service";
import { rabbitMqModule } from "../rabbit-mq/rabbit-mq.module";
import { fetchProviders } from "./fetch.providers";
import { DatabaseModule } from "../database/database.module";
import { AgendaModule } from "../agenda/agenda.module";
import { ScannerService } from "../scanner/scanner.service";
import { ScannerModule } from "../scanner/scanner.module";
import FetchDataController from "./fetch.controller.data";
import { ScannerClient } from "./scanner.client";
import FetchDataService from "./fetch.service.data";
import {FetchResultsGw} from "./fetch.mq.gw";
import PersonModule from "../person/person.module";

@Module({
  modules: [AgendaModule, rabbitMqModule, ScannerModule, DatabaseModule, PersonModule],
  controllers: [FetchController, FetchDataController],
  components: [FetchService, ScannerClient, ...fetchProviders, FetchDataService, FetchResultsGw]
})
export class FetchModuleModule { }
