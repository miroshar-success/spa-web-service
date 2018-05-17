import { Connection } from 'mongoose';
import { PersonSchema } from './schemas/person.schema';

const personProvider = [
  {
    provide: 'PersonModelToken',
    useFactory: (connection: Connection) => connection.model('Person', PersonSchema),
    inject: ['DbConnectionToken']
  }
]

export default personProvider;