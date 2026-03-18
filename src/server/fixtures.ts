import { User } from './models/userModel.js';

export async function loadFixtures() {
  try {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      console.log('📦 Загружаем фикстуры (тестовые данные)...');

      await User.create([
        {
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          bio: 'Администратор по умолчанию',
          avatar: 'https://i.pravatar.cc/150?img=0',
        },
        {
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'user',
          bio: 'Первый тестовый пользователь',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
          username: 'jane_smith',
          email: 'jane@example.com',
          password: 'password123',
          role: 'user',
          bio: 'Вторая тестовая пользовательница',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
        {
          username: 'alice_wonder',
          email: 'alice@example.com',
          password: 'password123',
          role: 'user',
          bio: 'Третий тестовый пользователь',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
      ]);

      console.log('✅ Фикстуры успешно загружены (4 пользователя, в т.ч. admin)');
    } else {
      console.log(`ℹ️  База данных уже содержит ${userCount} пользователей`);
    }
  } catch (error) {
    console.error('❌ Ошибка при загрузке фикстур:', error);
    // Не прерываем запуск сервера, если фикстуры не загрузились
  }
}
