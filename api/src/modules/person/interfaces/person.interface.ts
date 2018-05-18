import { Document } from 'mongoose';
import PersonTypes from '../person.type';

// export interface PersonInfo {
//   readonly name?: string;
//   readonly surname?: string;
// }

export default interface Person extends Document {
  readonly clientName: PersonTypes;
  readonly personKey: object;
  readonly personInfo: object;
}