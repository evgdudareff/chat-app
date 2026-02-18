import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
export type { IUser };