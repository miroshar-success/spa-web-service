import { MqGwDecorators } from '../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators';
import EnableMqGw = MqGwDecorators.EnableMqGw;
import { FetchResultsGw } from "../fetch/fetch.mq.gw";
import { Injectable } from '@nestjs/common';

@EnableMqGw({
  root: 'beagle',
  clients: ['viber'],
  components: [FetchResultsGw],
  connection: {
    hostname: "beagle-rabbit-mq",
    username: "rabbitmq",
    password: "rabbitmq"
  }
})
export class MqGwConfig { }