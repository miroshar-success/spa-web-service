import {    
    Controller,
    Get,
    Post,
    Query,    
    Delete,
    Put,
    UseInterceptors,
    FileInterceptor,
    UploadedFile    
  } from '@nestjs/common';
  import { ApiImplicitQuery } from '@nestjs/swagger';
  import BookService from './book.service';
  import Book from './book.interface';

  @Controller('data/books')  
  export default class BookController {
    constructor(private readonly bookService: BookService) { }
    
    @Post('newbook')
    @ApiImplicitQuery({ name: "name", required: true, type: String })
    @ApiImplicitQuery({ name: "author", required: true, type: String })
    @ApiImplicitQuery({ name: "cost", required: true, type: Number }) 
    @ApiImplicitQuery({ name: "genre", required: true, type: String})
    async newBook(@Query() params: any ): Promise<Book>{
      return await this.bookService.newBook(params.name, params.author, params.cost, params.genre);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Buffer) {      
      this.bookService.uploadBook(file);
    }
    
    @Post('postload')
    @ApiImplicitQuery({ name: "_id", required: true, type: String })
    @UseInterceptors(FileInterceptor('file'))
    async postloadFile(@UploadedFile() file: Buffer, @Query('_id') _id) {      
      this.bookService.postloadBook(file, _id);
    }

    @ApiImplicitQuery({ name: "offset", required: true, type: Number })
    @ApiImplicitQuery({ name: "limit", required: true, type: Number })
    @Get()
    async find(@Query() params: any): Promise<Book[]> {
      return await this.bookService.find(+params.offset, +params.limit, params.value);
    }  

    @ApiImplicitQuery({ name: "search", required: true, type: String })
    @Get('find')
    async search(@Query('search') search: string): Promise<Book[]> {
      return await this.bookService.search(search);
    }    

    @Get('all')
    async findAll(): Promise<Book[]> {
      return await this.bookService.findAllBooks();
    }
   
    @ApiImplicitQuery({ name: "_id", required: true, type: String })
    @Delete('remove')
    async remove(@Query('_id') _id): Promise<Book> {      
      return await this.bookService.removeById(_id);
    }

    @ApiImplicitQuery({ name: "_id", required: true, type: String })
    @ApiImplicitQuery({ name: "name", required: true, type: String })
    @ApiImplicitQuery({ name: "author", required: true, type: String })
    @ApiImplicitQuery({ name: "cost", required: true, type: Number })    
    @Put('edit')
    async edit(@Query() params: any): Promise<Book> {
      return await this.bookService.editById(params._id, params.name, params.author, params.cost);
    }
    
    @Get('sort')
    @ApiImplicitQuery({ name: "field", required: true, type: String})
    @ApiImplicitQuery({ name: "order", required: true, type: String})    
    async sort(@Query() params: any): Promise<Book> {
      return await this.bookService.sort(params.field, params.order);      
    }
    
  }