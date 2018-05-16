import { Module } from '@nestjs/common';
import { agendaProviders } from './agenda.providers';

@Module({
  components: [...agendaProviders],
  exports: [...agendaProviders]
})
export class AgendaModule {}