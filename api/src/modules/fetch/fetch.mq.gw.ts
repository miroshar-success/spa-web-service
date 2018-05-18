import {Component} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto} from "./fetch.dto";

@Component()
export class FetchResultsGw {

    constructor() {}

    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
    }

    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult"+ JSON.stringify(fetchResultDto))
    }

}
