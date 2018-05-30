import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwConfig = MqGwDecorators.MqGwConfig;
import { FetchResultsGw } from "../fetch/fetch.mq.gw";
import { MqGwConfiguration } from "../../../../lib/mq-gw-api/src/configuration/mq.gw.configuration";
import {ScannerClient} from "../fetch/fetch.scanner.client";


@MqGwConfig({
    root: 'beagle',
    clients: ['viber', 'beagleWeb'],
    components: [FetchResultsGw,ScannerClient],
    connection: {
        hostname: "beagle-rabbit-mq",
        username: "rabbitmq",
        password: "rabbitmq"
    }
})
class MqGwApi extends MqGwConfiguration { }



export default MqGwApi;