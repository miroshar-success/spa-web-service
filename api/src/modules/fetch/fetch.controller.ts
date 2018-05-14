import {Body, Controller, Post} from '@nestjs/common';

import {FetchExploreDto, FetchDto} from './fetch.dto';


@Controller('fetch')
export class FetchController {

    @Post('/explore')
    async fetch(@Body() fetchExploreDto: FetchExploreDto) {
        console.log(fetchExploreDto);
    }

    @Post()
    async guard(@Body() guardDto: FetchDto) {
        console.log(guardDto);
    }

}
