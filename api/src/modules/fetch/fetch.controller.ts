import {Bind, Body, Controller, Get, Post} from '@nestjs/common';


import {FetchDto, GuardDto} from './fetch.dto';


@Controller('fetch')
export class FetchController {

    @Post()
    @Bind(Body())
    async fetch(fetchDto: FetchDto) {
        console.log(fetchDto);
    }

    @Post('/guard')
    @Bind(Body())
    async guard(guardDto: GuardDto) {
        console.log(guardDto);
    }

}
