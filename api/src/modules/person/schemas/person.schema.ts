import * as mongoose from 'mongoose';
import { PersonType } from '../person.type';
import * as mongoosePaginate from 'mongoose-paginate'

export const PersonSchema = new mongoose.Schema(
  {
    personType: {
      type: String,
      enum: [PersonType.Telegram, PersonType.Viber],
      required: true,
    },
    personId: {
      type: String,
      required: true,
    },
  },
)

PersonSchema.plugin(mongoosePaginate);

export default mongoose.model('Person', PersonSchema);