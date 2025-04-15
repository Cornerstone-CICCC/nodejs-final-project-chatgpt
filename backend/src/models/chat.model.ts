import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const ChatSchema = new Schema({
  roomId:  { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message:  { type: String, required: true },
}, { timestamps: true })

export const Chat = mongoose.model('Chat', ChatSchema)