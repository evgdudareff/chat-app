import mongoose from 'mongoose';
import type { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoMemoryServer as MongoMemoryServerClass } from 'mongodb-memory-server';
import { config } from 'dotenv';

config();

let mongoMemoryInstance: InstanceType<typeof MongoMemoryServerClass> | null =
  null;

export async function connectDatabase() {
  const useRealMongoDB = process.env.USE_REAL_MONGODB === 'true';

  try {
    if (useRealMongoDB) {
      // Подключение к реальной MongoDB
      const mongoUri = process.env.DATABASE_URL;
      const mongoUser = process.env.DATABASE_USER;
      const mongoPassword = process.env.DATABASE_PASSWORD;

      if (!mongoUri) {
        throw new Error('DATABASE_URL не установлен в .env файле');
      }

      await mongoose.connect(mongoUri, {
        user: mongoUser,
        pass: mongoPassword,
        authSource: 'admin',
      });

      console.log('✅ Подключено к реальной MongoDB:', mongoUri);
    } else {
      // Запуск in-memory MongoDB для разработки
      mongoMemoryInstance = await MongoMemoryServerClass.create({
        instance: {
          dbName: 'chat-app',
        },
      });

      const mongoUri = mongoMemoryInstance.getUri();
      await mongoose.connect(mongoUri);

      console.log('✅ Подключено к In-Memory MongoDB');
      console.log(`🔗 Для MongoDB Compass скопируйте строку подключения:\n   ${mongoUri}`);
      console.log('💡 Данные будут удалены при перезапуске сервера');
      console.log(
        '💡 Для использования реальной БД установите: USE_REAL_MONGODB=true в .env'
      );
    }
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log('🔌 Соединение Mongoose закрыто');

    if (mongoMemoryInstance) {
      await mongoMemoryInstance.stop();
      console.log('🔌 In-Memory MongoDB остановлена');
    }
  } catch (error) {
    console.error('❌ Ошибка при отключении от БД:', error);
  }
}
