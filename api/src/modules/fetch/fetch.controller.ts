import {Body, Controller, Get, Post} from '@nestjs/common';

import {FetchService} from "./fetch.service";
import {FetchDto, FetchExploreDto} from "./fetch.dto";
import PersonCoreDto from "../person/person.dto";

@Controller('fetch')
export class FetchController {

    constructor(private readonly fetchService: FetchService) {
    }

    @Post('/explore')
    async fetchExplore(@Body() fetchExploreDto: FetchExploreDto) {
        await this.fetchService.fetchExploreCreate(fetchExploreDto);
    }

    @Post('/fetch')
    async fetch(@Body() fetchDto: FetchDto) {
        await this.fetchService.fetch(fetchDto);
    }

    @Post('/delete')
    async deleteFetch(@Body() fetchExploreDto: FetchExploreDto) {
        await this.fetchService.fetchDelete(fetchExploreDto);
    }
    @Post('/get')
    async getUserFetches(@Body() personCoreDto: PersonCoreDto): Promise<FetchExploreDto[]> {
        return await this.fetchService.getUserFetches(personCoreDto);
    }

}
