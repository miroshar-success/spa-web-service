import { Model, mongoose } from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import Author from './author.interface';
import { ObjectID } from 'bson';

@Component()
export default class AuthorService {
    constructor(@Inject('AuthorModelToken') private readonly authorModel: Model<Author>) {}
    
    async newAuthor(_name: String, _surname: String, _lifetime: String): Promise<Author> {
        const author = new this.authorModel();
        
        author.id = ObjectID;
        author.name = _name;
        author.surname = _surname;
        author.lifetime = _lifetime;
            
        return await author.save();
    }   


    async findAllAuthors(): Promise<Author[]> {
        return await this.authorModel.find().exec();
    }

    async removeById(_id: String): Promise<Author> {
        return await this.authorModel.findByIdAndRemove(_id);
    }

    async editById(_id: String, _name: String, _surname: String, _lifetime: String): Promise<Author> {
        return await this.authorModel.findByIdAndUpdate(_id, {name: _name, surname: _surname, lifetime: _lifetime});
    }
    
}
