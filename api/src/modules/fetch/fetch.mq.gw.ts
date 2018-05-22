import {Component} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto, FetchMessageDto} from "./dto/fetch.dto";
import {FetchMessage} from "./dto/fetch.message";
import PersonCoreDto from "../person/person.dto";

@Component()
export class FetchResultsGw {

    constructor() {}

    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
    }

    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult"+ JSON.stringify(fetchResultDto))
    }

    async publishMessage(message: FetchMessage, person: PersonCoreDto) {
        let fetchMessage: FetchMessageDto = {message: message, person: person};
        console.log("message"+ JSON.stringify(fetchMessage))
    }

}
