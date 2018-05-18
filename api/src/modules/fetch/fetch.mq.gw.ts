import {Component} from "@nestjs/common";
import {FetchExploreResultDto, FetchResultDto} from "./fetch.dto";

@Component()
export class FetchResultsGw {

    constructor() {}

    async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
        console.log("publishFetchExplore")
    }

    async publishFetchResult(fetchResultDto: FetchResultDto) {
        console.log("publishFetchResult")
    }

}
