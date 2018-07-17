import { Model } from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import Book from './book.interface';
import { ObjectID } from 'bson';

let nameFile = "";

@Component()
export default class BookService {
    constructor(@Inject('BookModelToken') private readonly bookModel: Model<Book>) {}
    
    async newBook(_name: String, _author: String, _cost: Number, _genre: String): Promise<Book> {
        const book = new this.bookModel();
        
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

    async search(searchString): Promise<Book[]> {
        if (searchString.length === 0) {
            return await this.bookModel.paginate({}, {limit: 10})
        } else {
            return await this.bookModel.paginate({$text: {$search: searchString}}, {limit: 10})
        }
    }

    async findAllBooks(): Promise<Book[]> {
        return await this.bookModel.find().exec();
    }

    async removeById(_id: String): Promise<Book> {
        return await this.bookModel.findByIdAndRemove(_id);
    }

    async editById(_id: String, _name: String, _author: String, _cost:Number): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(_id, {name: _name, author: _author, cost:_cost});
    }
    
    async sort(fieldName: String, orderName: String): Promise <Book> {       
        
        if(fieldName == "name")         
            return await this.bookModel.find().sort({name: orderName});
        
        if(fieldName == "author")
            return await this.bookModel.find().sort({author: orderName});

        if(fieldName == "cost")
            return await this.bookModel.find().sort({cost: orderName});
        
    }
}
