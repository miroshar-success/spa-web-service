import { Module } from '@nestjs/common';

import { FetchController } from './fetch.controller';

@Module({
  controllers: [FetchController]
})
export class FetchModuleModule {}
