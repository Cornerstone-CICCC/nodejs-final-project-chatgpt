import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String }, // Google 用戶登入可以不設密碼
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
    required: true
  },
}, { timestamps: true })

export const User = mongoose.model('User', UserSchema)
