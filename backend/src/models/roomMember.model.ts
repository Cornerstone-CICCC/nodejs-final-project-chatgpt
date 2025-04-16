import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const RoomMemberSchema = new Schema({
  roomId:  { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role:  { type: String },
}, { timestamps: true })

export const RoomMember = mongoose.model('RoomMember', RoomMemberSchema)