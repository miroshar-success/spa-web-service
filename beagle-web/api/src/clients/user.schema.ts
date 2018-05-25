import * as mongoose from 'mongoose';

export interface UserModel extends mongoose.Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
);