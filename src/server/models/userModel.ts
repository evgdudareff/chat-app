import { model, Schema, type Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  bio?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Имя пользователя является обязательным полем'],
      unique: [true, 'Пользователь с таким именем уже существует'],
      trim: true,
      minlength: [2, 'Имя пользователя должно содержать минимум 2 символа'],
    },
    email: {
      type: String,
      required: [true, 'Email является обязательным полем'],
      unique: [true, 'Пользователь с таким email уже зарегистрирован'],
      trim: true,
      lowercase: true,
      match: [/^[\w.-]+@[\w.-]+\.\w+$/, 'Пожалуйста, укажите корректный email'],
    },
    password: {
      type: String,
      required: [true, 'Пароль является обязательным полем'],
      minlength: [6, 'Пароль должен содержать минимум 6 символов'],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
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

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  // Инвалидируем старые токены только при смене пароля у существующего пользователя
  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});

export const User = model<IUser>('User', userSchema);
export type { IUser };
