import { Module } from '@nestjs/common';
import BookModule from './modules/book/book.module';

@Module({
    modules: [BookModule]
})
export class ApplicationModule { }