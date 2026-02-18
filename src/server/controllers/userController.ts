import { Request, Response } from 'express';
import { User } from '../models/userModel.js';

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
