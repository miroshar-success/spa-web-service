import {Body, Controller, Post} from '@nestjs/common';

import {FetchExploreDto, FetchDto} from './fetch.dto';
import {ContactsService} from "../contacts/contacts.service";
import {FetchService} from "./fetch.service";


@Controller('fetch')
export class FetchController {

    constructor(private readonly fetchService: FetchService) {
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
