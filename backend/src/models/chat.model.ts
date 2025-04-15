import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const ChatSchema = new Schema({
  roomId:  { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
<<<<<<< HEAD
  message:  { type: String },
=======
  message:  { type: String, required: true },
>>>>>>> a2e02bd2f916c1fb87cb6ddd4263e12e401def6e
}, { timestamps: true })

export const Chat = mongoose.model('Chat', ChatSchema)