import { Component } from "@nestjs/common";
import { FetchExploreResultDto, FetchResultDto, FetchMessageDto } from "./dto/fetch.dto";
import { FetchMessage, MessageStatus } from "./dto/fetch.message";
import PersonCoreDto from "../person/person.dto";
import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import MqGwConsumer = MqGwDecorators.MqGwConsumer;



export class FetchResultsGw {

    static THIS: FetchResultsGw;

    constructor() {
        FetchResultsGw.THIS = this;
        setTimeout(() => this.publishMessage({ status: MessageStatus.OK, messageKey: "XXX-" }), 5000);
    }


    @MqGwProducer({ name: 'fetchExplore', gateway: 'clientKey' })
    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
    }

    @MqGwProducer({ name: 'fetchResult', gateway: 'clientKey' })
    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult" + JSON.stringify(fetchResultDto))
        return fetchResultDto;
    }

    @MqGwProducer({ name: 'fetchMessage', gateway: 'clientKey' })
    async publishMessage(message: FetchMessage, person?: PersonCoreDto) {
        let fetchMessage: FetchMessageDto = { message: message, person: person };
        console.log("message" + JSON.stringify(fetchMessage))
        return message;
    }

    @MqGwConsumer({ name: 'fetchMessage', gateway: 'clientKey' })
    async consumeMessage(message: any) {
        console.log("THIS: ", FetchResultsGw.THIS)
        console.log("MESSAGE:" + JSON.stringify(message));
        console.log("data:" + message.content);
    }

}
