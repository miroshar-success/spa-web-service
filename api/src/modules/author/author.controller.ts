import {    
    Controller,
    Get,
    Post,
    Query,    
    Delete,
    Put,   
  } from '@nestjs/common';
  import { ApiImplicitQuery } from '@nestjs/swagger';
  import AuthorService from './author.service';
  import Author from './author.interface';

  @Controller('data/authors')  
  export default class AuthorController {
    constructor(private readonly authorService: AuthorService) { }
    
    @Post('newAuthor')
    @ApiImplicitQuery({ name: "name", required: true, type: String })
    @ApiImplicitQuery({ name: "surname", required: true, type: String })
    @ApiImplicitQuery({ name: "lifetime", required: true, type: String }) 
    async newBook(@Query() params: any ): Promise<Author>{
      return await this.authorService.newAuthor(params.name, params.surname, params.lifetime);
    } 

    @Get('all')
    async findAll(): Promise<Author[]> {
      return await this.authorService.findAllAuthors();
    }
   
    @ApiImplicitQuery({ name: "_id", required: true, type: String })
    @Delete('remove')
    async remove(@Query('_id') _id): Promise<Author> {      
      return await this.authorService.removeById(_id);
    }

    @ApiImplicitQuery({ name: "_id", required: true, type: String })
    @ApiImplicitQuery({ name: "name", required: true, type: String })
    @ApiImplicitQuery({ name: "surname", required: true, type: String })
    @ApiImplicitQuery({ name: "lifetime", required: true, type: String })    
    @Put('edit')
    async edit(@Query() params: any): Promise<Author> {      
      return await this.authorService.editById(params._id, params.name, params.surname, params.lifetime);
    }
}