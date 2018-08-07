import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import Book from './book.interface';
//import Author from '../author/author.interface';

import { ObjectID } from 'bson';
import { isNull, isNumber, isString } from 'util';


let nameFile = "";

@Component()
export default class BookService {
    
    constructor(@Inject('BookModelToken') private readonly bookModel: Model<Book>) {}
        
    async newBook(_name: String, _author: String, _cost: Number, _genre: String): Promise<Book> {
                        
        var checkBooks = await this.findBookByNameAndAuthor(_name, _author);
        
        if(checkBooks.length == 0) {
            const   book = new this.bookModel();        
            book.id = ObjectID;
            book.name = _name;
            book.author =_author;
            book.cost = _cost;
            book.genre = _genre;                
                
            if(nameFile.length === 0)
                book.url = "NO_IMAGE.png";
            else
                book.url = nameFile;

            nameFile = "";
            return await book.save();
        } else {

            var emptyBook: Book = {
                name: "",
                author: "",
                cost: 0,
                genre: "",
                url: ""
            };
            return await emptyBook;
        }
    }   
    
    async findBookByNameAndAuthor(_name: String, _author: String): Promise<Book[]> {
         
        return await this.bookModel.find({ name: _name, author: _author });
        
    }

    async uploadBook(file: Buffer) {

        var fs = require('fs'), randomstring = require('randomstring');

            nameFile = randomstring.generate(8) + '.jpg';
        var wstream = fs.createWriteStream('../../../images/' + nameFile);
            
        wstream.write(file.buffer);        
        wstream.end();        
    }

    async postloadBook(file: Buffer, _id: String):Promise<Book> {
        this.uploadBook(file);        
        return await this.bookModel.findByIdAndUpdate(_id, {url: nameFile});        
    }
    
    async find(offset: number, limit: number, value: string): Promise<Book[]> {
        if (value.length > 0) {
            return await this.bookModel.paginate({$text: {$search: value}}, {offset, limit})
        }
        return await this.bookModel.paginate({}, {offset, limit});
    }

    async search(search): Promise<Book[]> {

        //console.log(search + " " + typeof(search))
        
        //var searchString = parseInt(search)
        
        //console.log(searchString + " " + typeof(searchString))
        
        if (search.length === 0) {
            return await this.bookModel.paginate({}, {limit: 10})
        } else {

            if((parseInt(search)) >= 0) {
                console.log("number")
                return await this.bookModel.paginate({cost: parseInt(search)})
            }
            else {
                console.log("string")
                return await this.bookModel.paginate({$text: {$search: search}}, {limit: 10})
            }

            
        }    
    }

    async findAllBooks(): Promise<Book[]> {
        return await this.bookModel.find().exec();
    }

    async removeById(_id: String): Promise<Book> {
        return await this.bookModel.findByIdAndRemove(_id);
    }

    async editById(_id: String, _name: String, _author: String, _cost: Number, _genre: String): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(_id, {name: _name, author: _author, cost: _cost, genre: _genre});
    }
    
    /* DONT DELETE
    async sort(field: String, order: String): Promise<Book> {       
        
        if(field == "name")         
            return await this.bookModel.find().sort({name: order});
        
        if(field == "author")
            return await this.bookModel.find().sort({author: order});

        if(field == "cost")
            return await this.bookModel.find().sort({cost: order});        
    }*/
    
    async commonSort(field: string, order: string, genre: string, startCost: number, endCost: number): Promise<Book> {
                
        var sort, genreNames;
      
        if (typeof(genre) != "undefined")      
            genreNames = genre.split(',');
        else
            genreNames = ["Folklore", "Horror", "Humor", "Drama", "Fantasy"];
            
        if (typeof(startCost) == "undefined") 
            startCost = 0;        
         
        if (typeof(endCost) == "undefined") 
            endCost = Number.MAX_VALUE;
         
        if (field == "name")         
            sort = {name: order};

        if (field == "author")
            sort = {author: order};

        if (field == "cost")
            sort = {cost: order};  
        
        return await this.bookModel.find({ cost: {$gte: startCost, $lte: endCost}, genre:genreNames }).sort(sort);
        
    }
    
}

// export class Author {
//     constructor(@Inject('AuthorModelToken') private readonly authorModel: Model<Author>) {}

//     async findByNameAndSurname (_name: String, _surname: String): Promise<Author> {
//         return await this.authorModel.find({ name: _name, surname: _surname });
//     }    

// }


