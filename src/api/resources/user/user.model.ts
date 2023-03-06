import mongoose, { Model } from "mongoose";
import Auth from "../../../utils/auth";
import { toJSON } from "../../plugins";
import { IUser } from "./user.schema";
import { Document } from "mongodb";

interface UserDocument extends IUser, Document {
  comparePassword: (enteredPassword: string) => Promise<boolean>,
  isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>,
}


const userSchema = new mongoose.Schema<IUser, UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  salt: {
    type: String,
    private: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    private: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})


// add plugin that converts mongoose to json
userSchema.plugin(toJSON)

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  const salt = await Auth.GenerateSalt()
  const hashedPassword = await Auth.GenerateHashPassword(user.password, salt)
  user.password = hashedPassword
  user.salt = salt
  next()
})

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  const user = this
  const { salt, password } = user
  return await Auth.ComparePassword(enteredPassword, password, salt).catch(() => false)
}

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
}

const User = mongoose.model<IUser, UserDocument>('User', userSchema)

export default User
