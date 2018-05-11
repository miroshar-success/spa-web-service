import { Body, Controller, Get, Post } from '@nestjs/common';


import { FetchDto } from './dto/create-fetch.dto';


@Controller('fetch')
export class FetchController {

  @Post()
  async create(@Body() fetchDto: FetchDto) {
    console.log();
  }

}
