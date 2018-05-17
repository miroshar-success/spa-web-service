import { Module } from '@nestjs/common';

import { FetchController } from './fetch.mqcontroller';
import {FetchService} from "./fetch.service";
import {rabbitMqModule} from "../rabbit-mq/rabbit-mq.module";
import {fetchProviders} from "./fetch.providers";
import {DatabaseModule} from "../database/database.module";
import {AgendaModule} from "../agenda/agenda.module";
import {ScannerService} from "../scanner/scanner.service";
import {ScannerModule} from "../scanner/scanner.module";

@Module({
  modules: [AgendaModule, rabbitMqModule, ScannerModule, DatabaseModule],
  controllers: [FetchController],
  components: [FetchService, ...fetchProviders]
})
export class FetchModuleModule {}
