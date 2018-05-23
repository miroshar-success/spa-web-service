import {Component, Inject} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto, FetchMessageDto} from "./dto/fetch.dto";
import {FetchMessage} from "./dto/fetch.message";
import PersonCoreDto from "../person/person.dto";
import {MqGwDecorators} from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;


@Component()
export class FetchResultsGw {

    constructor() {}


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

}
