import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
}, { timestamps: true })

const getUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    console.log("Something went wrong to get user by email");
  }
};

export default {
  getUserByEmail,
};

export const User = mongoose.model('User', UserSchema)
