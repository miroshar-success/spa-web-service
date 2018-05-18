import { Document } from 'mongoose';
import { ClientName } from '../clients/clients.enums';

export default interface Person extends Document {
  readonly clientName: ClientName;
  readonly personKey: object;
  readonly personInfo: object;
}