import {Body, Controller, Get, Post} from '@nestjs/common';

import {FetchExploreDto, FetchDto, PersonFetchDto} from './fetch.dto';
import {FetchService} from "./fetch.service";

import {MqApiServer, Controller1, Controller2} from "./mq";

@Controller('fetchmq')
export class FetchController {

    constructor(private readonly fetchService: FetchService) {
        new MqApiServer({basePath: 'api', clients: ['telegram', 'viber'], connection: {}}, [Controller1, Controller2]);
    }

    @Post('/explore')
    async fetchExplore(@Body() fetchExploreDto: FetchExploreDto) {
        await this.fetchService.fetchExploreCreate(fetchExploreDto);
    }

    @Post('/delete')
    async deleteFetch(@Body() fetchExploreDto: FetchExploreDto) {
        await this.fetchService.fetchDelete(fetchExploreDto);
    }

    @Post('/create')
    async createFetch(@Body() fetch: FetchDto) {
        await this.fetchService.fetch(fetch);
    }

    @Post('/get')
    async getUserFetch(@Body() personFetchDto: PersonFetchDto): Promise<FetchExploreDto[]> {
        return await this.fetchService.getUserFetch(personFetchDto);
    }

}
