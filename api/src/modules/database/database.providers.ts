import * as mongoose from 'mongoose';
import { BookSchema } from '../book/book.schema';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (): Promise<mongoose.Connection> => {
      (mongoose as any).Promise = global.Promise;
      return await mongoose.connect('mongodb://beagle-mongo:27017/stock', () => {
        
      });
    }
  }
];
