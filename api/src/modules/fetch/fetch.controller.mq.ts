import {Body, Controller, Get, Post} from '@nestjs/common';

import {FetchService} from "./fetch.service";
import {FetchDtoMq, FetchExploreDtoMq, PersonFetchDtoMq} from "./fetch.dto.mq";
import {FetchClientName} from "./fetch.enums";

@Controller('fetchmq')
export class FetchControllerMq {

    constructor(private readonly fetchService: FetchService) {
    }

    @Post('/explore')
    async fetchExplore(@Body() fetchExploreDtoMq: FetchExploreDtoMq) {
        await this.fetchService.fetchExploreCreate(fetchExploreDtoMq);
    }

    // TODO ADD RESULT

    @Post('/fetch')
    async fetch(@Body() fetchDtoMq: FetchDtoMq) {
        await this.fetchService.fetch(fetchDtoMq);
    }



    // @Post('/delete')
    // async deleteFetch(@Body() fetchExploreDtoMq: FetchExploreDtoMq) {
    //     await this.fetchService.fetchDelete(fetchExploreDtoMq);
    // }
    //

    //
    // @Post('/get')
    // async getUserFetch(@Body() personFetchDtoMq: PersonFetchDtoMq): Promise<FetchExploreDtoMq[]> {
    //     return await this.fetchService.getUserFetch(personFetchDtoMq);
    // }

}
