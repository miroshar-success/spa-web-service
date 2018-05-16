import { Module } from '@nestjs/common';

import { FetchController } from './fetch.controller';
import {FetchService} from "./fetch.service";
import {rabbitMqModule} from "../rabbit-mq/rabbit-mq.module";
import {fetchProviders} from "./fetch.providers";
import {DatabaseModule} from "../database/database.module";

@Module({
  modules: [rabbitMqModule, DatabaseModule],
  controllers: [FetchController],
  components: [FetchService, ...fetchProviders]
})
export class FetchModuleModule {}
