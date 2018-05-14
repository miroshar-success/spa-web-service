import { Module } from '@nestjs/common';

import { FetchController } from './fetch.controller';
import {FetchService} from "./fetch.service";
import {rabbitMqModule} from "../rabbit-mq/rabbit-mq.module";

@Module({
  modules: [rabbitMqModule],
  controllers: [FetchController],
  components: [FetchService]
})
export class FetchModuleModule {}
