import {Body, Controller, Get, Post} from '@nestjs/common';

import {FetchService} from "./fetch.service";
import {FetchDto, FetchExploreDto} from "./fetch.dto";

@Controller('fetchmq')
export class FetchController {

    constructor(private readonly fetchService: FetchService) {
    }

    @Post('/explore')
    async fetchExplore(@Body() fetchExploreDto: FetchExploreDto) {
        await this.fetchService.fetchExploreCreate(fetchExploreDto);
    }

    // TODO ADD RESULT

    @Post('/fetch')
    async fetch(@Body() fetchDto: FetchDto) {
        await this.fetchService.fetch(fetchDto);
    }



    // @Post('/delete')
    // async deleteFetch(@Body() fetchExploreDtoMq: FetchExploreDto) {
    //     await this.fetchService.fetchDelete(fetchExploreDtoMq);
    // }
    //

    //
    // @Post('/get')
    // async getUserFetch(@Body() personFetchDtoMq: PersonFetchDto): Promise<FetchExploreDto[]> {
    //     return await this.fetchService.getUserFetch(personFetchDtoMq);
    // }

}
