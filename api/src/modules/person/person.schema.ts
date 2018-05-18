import * as mongoose from 'mongoose';
import { ClientName } from '../clients/clients.enums';
import * as mongoosePaginate from 'mongoose-paginate'

export const PersonSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      enum: [...Object.keys(ClientName)],
      required: true,
    },
    personKey: {
      type: Object,
      required: true,
    },
    personInfo: {
      type: Object
    }
  },
)

PersonSchema.index({
  clientName: 'text',
  'personInfo.name': 'text',
  'personInfo.surname': 'text',
})

PersonSchema.plugin(mongoosePaginate);

export default mongoose.model('Person', PersonSchema);