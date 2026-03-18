import { Request, Response } from 'express';
import { User } from '../models/userModel.js';
import type { AuthRequest } from './authController.js';

export async function createUser(req: Request, res: Response) {
  try {
    const { username, email, bio, avatar } = req.body;

    // Валидация обязательных полей
    if (!username || !email) {
      res.status(400).json({
        success: false,
        message: 'Username и email обязательны',
      });
      return;
    }

    // Проверяем, не существует ли уже пользователь с таким username или email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'Пользователь с таким username или email уже существует',
      });
      return;
    }

    // Создаём нового пользователя
    const newUser = new User({
      username,
      email,
      bio: bio || '',
      avatar: avatar || '',
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: savedUser,
    });
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании пользователя',
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении пользователя',
    });
  }
}

export async function updateUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    if (String(req.user!._id) !== id) {
      res.status(403).json({
        success: false,
        message: 'Можно редактировать только свой профиль',
      });
      return;
    }

    const { username, email, bio, avatar } = req.body;
    const body: Record<string, unknown> = {};
    if (username !== undefined) body.username = username;
    if (email !== undefined) body.email = email;
    if (bio !== undefined) body.bio = bio;
    if (avatar !== undefined) body.avatar = avatar;

    if (Object.keys(body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Укажите хотя бы одно поле для обновления',
      });
      return;
    }

    if (username !== undefined || email !== undefined) {
      const orConditions: Array<{ username?: string; email?: string }> = [];
      if (username !== undefined) orConditions.push({ username });
      if (email !== undefined) orConditions.push({ email });
      const existingByUsernameOrEmail = await User.findOne({
        _id: { $ne: id },
        $or: orConditions,
      });
      if (existingByUsernameOrEmail) {
        res.status(409).json({
          success: false,
          message: 'Пользователь с таким username или email уже существует',
        });
        return;
      }
    }

    const updated = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Профиль обновлён',
      data: updated,
    });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении пользователя',
    });
  }
}
