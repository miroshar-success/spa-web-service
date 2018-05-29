import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwConfig = MqGwDecorators.MqGwConfig;
import { MqGwConfiguration } from "../../../../lib/mq-gw-api/src/configuration/mq.gw.configuration";
import {ApiClient} from "../scanner.api.client";


@MqGwConfig({
    root: 'beagle',
    clients: ['scanner'],
    components: [ApiClient],
    connection: {
        hostname: "beagle-rabbit-mq",
        username: "rabbitmq",
        password: "rabbitmq"
    }
})
class MqGwScannerConfig extends MqGwConfiguration { }



export default MqGwScannerConfig;