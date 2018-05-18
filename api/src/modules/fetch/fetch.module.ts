import { Module } from '@nestjs/common';

import { FetchController } from './fetch.mqcontroller';
import {FetchService} from "./fetch.service";
import {rabbitMqModule} from "../rabbit-mq/rabbit-mq.module";
import {fetchProviders} from "./fetch.providers";
import {DatabaseModule} from "../database/database.module";
import {AgendaModule} from "../agenda/agenda.module";

@Module({
  modules: [AgendaModule, rabbitMqModule, DatabaseModule],
  controllers: [FetchController],
  components: [FetchService, ...fetchProviders]
})
export class FetchModuleModule {}
