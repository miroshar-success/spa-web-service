import {Module} from '@nestjs/common';

import {DatabaseModule} from '../database/database.module';
import BookController from './book.controller';
import bookProvider from './book.provider';
import BookService from "./book.service";

@Module({
    modules: [DatabaseModule],
    controllers: [BookController],
    components: [BookService, ...bookProvider],
    exports: [BookService]
})

export default class BookModule {
}