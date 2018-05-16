import { Document } from 'mongoose';
import PersonTypes from '../person.type';

export default interface Person extends Document {
  readonly personType: PersonTypes;
  readonly personId: string;
}