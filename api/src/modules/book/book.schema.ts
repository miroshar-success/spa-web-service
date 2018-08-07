import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,      
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    cost: {
      type: Number
    },
    genre: {
      type: String
    },
    url: {
      type: String
    }
  },
)

BookSchema.index({
  name: 'text',
  author: 'text',
  genre: 'text',
})

BookSchema.plugin(mongoosePaginate);

export default mongoose.model('Book', BookSchema);