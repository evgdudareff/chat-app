import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { connectDatabase } from './database.js';
import { loadFixtures } from './fixtures.js';
import { setupShutdown } from './shutdown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Подключение к БД и загрузка фикстур
await connectDatabase();
await loadFixtures();

// API роуты
app.use('/api', apiRouter);

// Static файлы
const publicPath = path.join(__dirname, '../../dist/public');
app.use(express.static(publicPath));

// Fallback для SPA
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Graceful shutdown при Ctrl + C
setupShutdown(server);
