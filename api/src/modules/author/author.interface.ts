import { Document } from 'mongoose';

export default interface Author extends Document {
    readonly name: string;
    readonly surname: string;
    readonly lifetime: Date;
    
}