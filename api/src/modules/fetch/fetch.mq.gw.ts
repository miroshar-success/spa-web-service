import {Component} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto, MqMessageDto} from "./dto/fetch.dto";

@Component()
export class FetchResultsGw {

    constructor() {}

    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
    }

    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult"+ JSON.stringify(fetchResultDto))
    }

    async publishMessage(mqMessageDto: MqMessageDto) {
        console.log("message"+ JSON.stringify(mqMessageDto))
    }

}
