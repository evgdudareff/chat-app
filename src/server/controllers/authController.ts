import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel.js';
import type { IUser } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

/** Расширение Request для маршрутов с protect */
export interface AuthRequest extends Request {
  user?: IUser;
}

/** Токен из заголовка Authorization: Bearer <token> (предпочтительно для API) */
function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export async function signup(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    // Валидация обязательных полей
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Username, email и password обязательны',
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

    const newUser = new User({
      username,
      email,
      password,
    });

    const savedUser = await newUser.save();
    const token = generateToken(String(savedUser._id));

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      token,
    });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации пользователя:',
      error,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const loginId = email;
    const isEmail = String(loginId).includes('@'); // dummy validation TO-DO better
    if (!email || !password || !isEmail) {
      res.status(400).json({
        success: false,
        message: 'Укажите email и пароль',
      });
      return;
    }

    const user = await User.findOne({ email: loginId })
      .select('+password')
      .exec();

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Неверный email или пароль',
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: 'Неверный email или пароль',
      });
      return;
    }

    const token = generateToken(String(user._id));

    res.status(200).json({
      success: true,
      message: 'Вход выполнен успешно',
      token,
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при входе',
    });
  }
}

export async function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      res.status(401).json({
        success: false,
        message:
          'Требуется авторизация. Отправьте токен в заголовке Authorization: Bearer <token>',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      iat?: number;
    };
    const user = await User.findById(decoded.userId)
      .select('+passwordChangedAt')
      .exec();

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Пользователь больше не существует',
      });
      return;
    }

    if (user.passwordChangedAt && decoded.iat) {
      const tokenIssuedAt = decoded.iat * 1000;
      if (user.passwordChangedAt.getTime() > tokenIssuedAt) {
        res.status(401).json({
          success: false,
          message: 'Пароль был изменён. Выполните вход снова',
        });
        return;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Недействительный или истёкший токен',
      });
      return;
    }
    console.error('Ошибка в protect:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке авторизации',
    });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Не авторизован' });
    return;
  }
  const { _id, username, email, role, bio, avatar, createdAt, updatedAt } =
    req.user;
  res.status(200).json({
    success: true,
    data: {
      _id: String(_id),
      username,
      email,
      role: role ?? 'user',
      bio: bio ?? '',
      avatar: avatar ?? '',
      createdAt,
      updatedAt,
    },
  });
}
