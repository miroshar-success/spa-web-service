import { Model, mongoose } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import Author from './author.interface';
import { ObjectID } from 'bson';

@Component()
export default class AuthorService {
    constructor(@Inject('AuthorModelToken') private readonly authorModel: Model<Author>) {}
    
    async newAuthor(_name: String, _surname: String, _dob: Date, _dod: Date): Promise<Author> {

        const author = new this.authorModel();

        author.id = ObjectID;
        author.name = _name;
        author.surname = _surname;
        author.dob = _dob;           
        author.dod = _dod;              
        
        return await author.save();
    }   

    async findAllAuthors(): Promise<Author[]> {
        return await this.authorModel.aggregate(
            [  
                {   
                    $project: {
                        name: "$name",
                        surname: "$surname",                        
                        dob: { $dateToString: { format: "%d.%m.%Y", date: "$dob" } },
                        dod: { $dateToString: { format: "%d.%m.%Y", date: "$dod" } },                        
                     }
                }
            ]
        );
    }

    async removeById(_id: String): Promise<Author> {
        return await this.authorModel.findByIdAndRemove(_id);
    }

    async editById(_id: String, _name: String, _surname: String, _dob: Date, _dod: Date): Promise<Author> {
        return await this.authorModel.findByIdAndUpdate(_id, {name: _name, surname: _surname, dob: _dob, dod: _dod});
    }

    async search (searchString): Promise<Author> {
        if (searchString.length === 0) 
            return await this.authorModel.paginate({}, {limit: 10000})
        else 
            return await this.authorModel.paginate({$text: {$search: searchString}}, {limit: 10000})        
    }
}
