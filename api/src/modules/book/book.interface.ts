import { Document } from 'mongoose';

export default interface 
Book extends Document {
    readonly name: string;
    readonly author: string;
    readonly cost: number;
}