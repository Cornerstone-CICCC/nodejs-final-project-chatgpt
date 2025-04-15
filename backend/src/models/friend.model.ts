import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const FriendSchema = new Schema({
  user1Id:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

export const Friend = mongoose.model('Friend', FriendSchema)