import {Module} from '@nestjs/common';

import {DatabaseModule} from '../database/database.module';
import AuthorController from './author.controller';
import authorProvider from './author.provider';
import AuthorService from "./author.service";

@Module({
    modules: [DatabaseModule],
    controllers: [AuthorController],
    components: [AuthorService, ...authorProvider],
    exports: [AuthorService]
})

export default class AuthorModule {
}