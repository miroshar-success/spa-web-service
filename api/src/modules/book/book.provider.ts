import { Connection } from 'mongoose';
import { BookSchema } from './book.schema';

const bookProvider = [
  {
    provide: 'BookModelToken',
    useFactory: (connection: Connection) => connection.model('Book', BookSchema),
    inject: ['DbConnectionToken']
  }
]

export default bookProvider;