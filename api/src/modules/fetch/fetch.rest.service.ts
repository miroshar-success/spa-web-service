import {Model} from 'mongoose';
import {Body, Component, HttpStatus, Inject, HttpException, Post} from '@nestjs/common';

import {FetchExploreSelectorModel, FetchModel} from "./fetch.model";


@Component()
export class FetchService {

    constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>) {}

}
