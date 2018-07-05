import { Model } from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import Book from './book.interface';
import { ObjectID } from 'bson';

let nameFile;

@Component()
export default class BookService {
    constructor(@Inject('BookModelToken') private readonly bookModel: Model<Book>) {}

    async create(book: Book): Promise<Book> {        
        const createdBook = new this.bookModel(book);
        return await createdBook.save();
    }

    async newBook(_name: String, _author: String, _cost: Number): Promise<Book> {
        const book = new this.bookModel();
        
        book.id = ObjectID;
        book.name = _name;
        book.author =_author;
        book.cost = _cost;
        book.url = nameFile;

        return await book.save();
    }
    
    async uploadBook(file: Buffer) {

        var fs = require('fs'), randomstring = require('randomstring');

            nameFile = randomstring.generate(8) + '.jpg';
        var wstream = fs.createWriteStream('../../../images/' + nameFile);
            
        wstream.write(file.buffer);        
        wstream.end();
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

    async removeById(_id:String): Promise<Book> {
        return await this.bookModel.findByIdAndRemove(_id);
    }

    async editById(_id: String, _name: String, _author: String, _cost:Number): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(_id, {name: _name, author: _author, cost:_cost});
    }      

}
