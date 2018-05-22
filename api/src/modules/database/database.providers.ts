import * as mongoose from 'mongoose';
import Person from '../person/person.schema';
import { generatePersons, generateFetchs, removeData } from './database.helpers';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (): Promise<mongoose.Connection> => {
      (mongoose as any).Promise = global.Promise;
      return await mongoose.connect('mongodb://beagle-mongo:27017/beagle', () => {
        // removeData();
        // generatePersons(25);
        // generateFetchs(25);
      });
    }
  }
];
