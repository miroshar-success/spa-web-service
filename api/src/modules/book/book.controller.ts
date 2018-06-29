import {
    Body,
    Controller,
    Get,
    Post,
    Query,    
    Delete,
    Put    
  } from '@nestjs/common';
  import { ApiImplicitQuery } from '@nestjs/swagger';

  import BookService from './book.service';
  import CreateBookDto from './book.dto';
  import Book from './book.interface';

  @Controller('data/books')  
  export default class BookController {
    constructor(private readonly bookService: BookService) { }
  
    @Post('create')
    async create(@Body() createBookDto: CreateBookDto): Promise<void> {
      this.bookService.create(createBookDto);
    }

    @Post('newbook')
    @ApiImplicitQuery({ name: "name", required: true, type: String })
    @ApiImplicitQuery({ name: "author", required: true, type: String })
    @ApiImplicitQuery({ name: "cost", required: true, type: Number })
    async newBook(@Query() params: any): Promise<Book>{
      return await this.bookService.newBook(params.name, params.author, params.cost);
    }
    
    
    @ApiImplicitQuery({ name: "offset", required: true, type: Number })
    @ApiImplicitQuery({ name: "limit", required: true, type: Number })
    @Get()
    async find(@Query() params: any): Promise<Book[]> {
      return await await this.bookService.find(+params.offset, +params.limit, params.value);
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
    async edit(@Query() params: any): Promise <Book> {
      return await this.bookService.editById(params._id, params.name, params.author, params.cost);
    }

    @ApiImplicitQuery({ name: "field", required: true, type: String })
    @Post('sort')
    async sortName(@Query('field') field): Promise<Book[]> {      
      return await this.bookService.sort(field);
    }    
    
  }