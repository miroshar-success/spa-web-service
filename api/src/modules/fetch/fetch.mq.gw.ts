import {Component} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto, FetchMessageDto} from "./dto/fetch.dto";
import {FetchMessage, MessageStatus} from "./dto/fetch.message";
import PersonCoreDto from "../person/person.dto";
import {MqGwDecorators} from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import MqGwConsumer = MqGwDecorators.MqGwConsumer;


@Component()
export class FetchResultsGw {

    private static THIS: FetchResultsGw;

    constructor() {
        FetchResultsGw.THIS = this;
        setTimeout(()=> this.publishMessage({status:MessageStatus.OK, messageKey: "viber"}), 5000);
    }


    @MqGwProducer({name:'fetchExplore', gateway:'messageKey'})
    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
    }

    @MqGwProducer({name:'fetchResult', gateway:'messageKey'})
    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult"+ JSON.stringify(fetchResultDto))
    }

    @MqGwProducer({name:'fetchMessage', gateway:'messageKey'})
    async publishMessage(message: FetchMessage, person?: PersonCoreDto) {
        let fetchMessage: FetchMessageDto = {message: message, person: person};
        console.log("publishMessage"+ JSON.stringify(fetchMessage))
        return message;
    }

    @MqGwConsumer({name:'fetchMessage', gateway:'messageKey'})
    async consumeMessage(message: any) {
        console.log("THIS: ", this);
        console.log("MESSAGE:"+ message.status);
    }

}
