import {Body, Controller, Get, Post} from '@nestjs/common';

import {FetchExploreDto, FetchDto, PersonFetchDto} from './fetch.dto';
import {FetchService} from "./fetch.service";

import {MqApiServer, Controller1, Controller2} from "./mq";

@Controller('fetch')
export class FetchController {

}
