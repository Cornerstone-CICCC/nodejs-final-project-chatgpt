import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const RoomSchema = new Schema({
  name:  { type: String, required: true },
  isGroup: { type: Boolean, required: true },
}, { timestamps: true })

export const Room = mongoose.model('Room', RoomSchema)