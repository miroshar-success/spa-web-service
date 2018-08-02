import { Module } from '@nestjs/common';
import BookModule from './modules/book/book.module';
import AuthorModule from './modules/author/author.module';

@Module({
    modules: [BookModule, AuthorModule]
})
export class ApplicationModule { }