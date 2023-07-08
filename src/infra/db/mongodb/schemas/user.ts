import { type User } from '@/domain/models'
import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})
