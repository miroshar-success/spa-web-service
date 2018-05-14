import {Body, Controller, Post} from '@nestjs/common';

import {FetchExploreDto, FetchDto} from './fetch.dto';
import {ContactsService} from "../contacts/contacts.service";
import {FetchService} from "./fetch.service";


@Controller('fetch')
export class FetchController {

    constructor(private readonly fetchService: FetchService) {}

    @Post('/explore')
    async fetch(@Body() fetchExploreDto: FetchExploreDto) {
        console.log(fetchExploreDto);
        this.fetchService.doIt();
    }

    @Post()
    async guard(@Body() guardDto: FetchDto) {
        console.log(guardDto);
    }

}
