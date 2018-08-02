import { Connection } from 'mongoose';
import { authorSchema } from './author.schema';

const authorProvider = [
  {
    provide: 'AuthorModelToken',
    useFactory: (connection: Connection) => connection.model('Author', authorSchema),
    inject: ['DbConnectionToken']
  }
]

export default authorProvider;