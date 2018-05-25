import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwConfig = MqGwDecorators.MqGwConfig;
import { FetchResultsGw } from "../fetch/fetch.mq.gw";
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
import MqGwProducer = MqGwDecorators.MqGwProducer;
import { MqGwConfiguration } from "../../../../lib/mq-gw-api/src/configuration/mq.gw.configuration";


@MqGwConfig({
    root: 'beagle',
    clients: ['viber', 'beagleWeb'],
    components: [FetchResultsGw],
    connection: {
        hostname: "beagle-rabbit-mq",
        username: "rabbitmq",
        password: "rabbitmq"
    }
})
class MqGwApi extends MqGwConfiguration { }



export default MqGwApi;