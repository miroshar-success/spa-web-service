import { MqGwDecorators } from '../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators';
import MqGwConfig = MqGwDecorators.MqGwConfig;
import { FetchResultsGw } from "../fetch/fetch.mq.gw";
import { MqGwConfiguration } from "../../../../lib/mq-gw-api/src/configuration/mq.gw.configuration";

@MqGwConfig({
  root: 'beagle',
  clients: ['beagleWeb'],
  components: [FetchResultsGw],
  connection: {
    hostname: "beagle-rabbit-mq",
    username: "rabbitmq",
    password: "rabbitmq"
  }
})
export class MqGwApi extends MqGwConfiguration { }