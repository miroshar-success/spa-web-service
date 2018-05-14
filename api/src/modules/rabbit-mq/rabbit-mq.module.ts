import { Module } from '@nestjs/common';
import { rabbitMqProviders } from './rabbit-mq.providers';

@Module({
  components: [...rabbitMqProviders],
  exports: [...rabbitMqProviders]
})
export class rabbitMqModule {}
