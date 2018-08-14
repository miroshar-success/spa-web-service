import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,      
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,     
    },
    dod: {
      type: Date,     
    }
  }
)

authorSchema.index({
  name: 'text',
  surname: 'text',     
})

authorSchema.plugin(mongoosePaginate);

export default mongoose.model('Author', authorSchema);




