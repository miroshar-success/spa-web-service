import {Body, Controller, Post} from '@nestjs/common';

import {FetchExploreDto, FetchDto} from './fetch.dto';
import {FetchService} from "./fetch.service";

import {MqApiServer, Controller1, Controller2} from "./mq";

@Controller('fetch')
export class FetchController {

    constructor(private readonly fetchService: FetchService) {
        new MqApiServer({basePath:'api',clients:['telegram','viber'],connection:{}}, [Controller1,Controller2]);
    }

    @Post('/explore')
    async fetchExplore(@Body() fetchExploreDto: FetchExploreDto) {
        await this.fetchService.fetchExploreCreate(fetchExploreDto);
    }

    @Post()
    async fetch(@Body() fetch: FetchDto) {
        await this.fetchService.fetch(fetch);
    }

}
