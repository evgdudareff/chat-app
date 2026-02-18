import type { Server } from 'http';
import { disconnectDatabase } from './database.js';

let isShuttingDown = false;

export const setupShutdown = (server: Server) => {
  const shutdown = async () => {
    if (isShuttingDown) return; // Игнорируем повторные вызовы
    isShuttingDown = true;

    console.log('\n⏹️  Остановка сервера...');

    // Ждём закрытия HTTP сервера
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('✅ HTTP сервер остановлен');
        resolve();
      });
    });

    // Закрываем подключение к БД
    await disconnectDatabase();
    console.log('✅ Соединение с БД закрыто');

    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};