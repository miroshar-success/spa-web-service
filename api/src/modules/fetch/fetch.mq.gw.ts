import {Component, Inject} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto, FetchMessageDto} from "./dto/fetch.dto";
import {FetchMessage} from "./dto/fetch.message";
import PersonCoreDto from "../person/person.dto";
import {MqGwDecorators} from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import {MqGwDecorators} from "../../../../lib/mq-gw-api/dist/decorators/mq.gw.decorators";
import MqGwConsumer = MqGwDecorators.MqGwConsumer;


@Component()
export class FetchResultsGw {

    constructor() {
        setTimeout(() =>{
            console.log("PUBLISH MESSAGE")
        }, 10000)

    }


    @MqGwProducer({name:'fetchExplore', gateway:'clientKey'})
    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
    }

    @MqGwProducer({name:'fetchResult', gateway:'clientKey'})
    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult"+ JSON.stringify(fetchResultDto))
    }

    @MqGwProducer({name:'fetchMessage', gateway:'clientKey'})
    async publishMessage(message: FetchMessage, person: PersonCoreDto) {
        let fetchMessage: FetchMessageDto = {message: message, person: person};
        console.log("message"+ JSON.stringify(fetchMessage))
    }

    @MqGwConsumer({name:'fetchMessage', gateway:'clientKey'})
    async consumeMessage(message: object) {
        console.log("MESSAGE:"+ JSON.stringify(message));
    }

}
