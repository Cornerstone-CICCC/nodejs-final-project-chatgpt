import mongoose from 'mongoose'
import { Schema } from 'mongoose'

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
}, { timestamps: true })

export const User = mongoose.model('User', UserSchema)
