import {Model} from 'mongoose';
import {Body, Component, HttpStatus, Inject, HttpException, Post} from '@nestjs/common';

import {Channel, connect, Connection} from 'amqplib';
import {FetchDto, FetchExploreDto, PersonFetchDto} from "./fetch.dto";
import {FetchExploreSelectorModel, FetchModel} from "./fetch.model";
import {FetchClientName} from "./fetch.enums";
import {FetchExploreMqDto} from "./fetch.mq.dto";
import * as Agenda from "agenda";

@Component()
export class FetchService {

    constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>) {}

}
