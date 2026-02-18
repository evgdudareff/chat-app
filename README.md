# Chat App

Frameworkless SPA (Single Page Application) чат-приложение с архитектурой client-server на TypeScript.

## Структура проекта

```
chat-app/
├── src/
│   ├── client/                          # Frontend (SPA)
│   │   ├── components/                  # UI компоненты
│   │   │   ├── header/
│   │   │   ├── login-form/
│   │   │   ├── register-form/
│   │   │   └── profile-form/
│   │   ├── pages/                       # Страницы приложения
│   │   │   ├── home/
│   │   │   └── settings/
│   │   ├── utils/                       # Утилиты
│   │   │   ├── router.ts                # Маршрутизация SPA
│   │   │   ├── templator-utils.ts       # Работа с шаблонами
│   │   │   └── spaLinkNavigate.ts       # Навигация по SPA ссылкам
│   │   ├── index.html                   # Entry point
│   │   └── index.ts                     # Инициализация приложения
│   │
│   └── server/                          # Backend (Node.js + Express)
│       ├── models/                      # Mongoose модели
│       │   └── userModel.ts             # Схема пользователя
│       ├── controllers/                 # Обработчики запросов
│       │   └── userController.ts        # CRUD для пользователей
│       ├── routes/                      # API маршруты
│       │   ├── index.ts                 # Подключение маршрутов
│       │   └── userRoutes.ts            # Маршруты пользователей
│       ├── database.ts                  # Настройка БД
│       ├── fixtures.ts                  # Тестовые данные
│       ├── shutdown.ts                  # Graceful shutdown
│       └── index.ts                     # Entry point сервера
│
└── dist/                                # Скомпилированные файлы
    ├── server/                          # Скомпилированный backend
    └── public/                          # Собранный frontend
```

## Стек технологий

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Язык:** TypeScript
- **База данных:** MongoDB (In-Memory для разработки)
- **ODM:** Mongoose

### Frontend
- **Язык:** TypeScript
- **Стиль:** Frameworkless (Vanilla TS)
- **Шаблонизация:** templator-evgdudareff
- **Бандлер:** Parcel

### Development Tools
- **Компиляция:** TypeScript (`tsc`) + tsx (для dev)
- **Линтинг:** ESLint
- **Форматирование:** Prettier
- **Параллельное выполнение:** concurrently

## Установка

```bash
npm install
```

## Запуск

### Режим разработки

Запустить backend и frontend одновременно:

```bash
npm run dev
```

Это запустит:
- Backend на `http://localhost:3000`
- Frontend dev-сервер на `http://localhost:1234`

**Отдельный запуск:**

```bash
# Только backend
npm run backend-dev

# Только frontend
npm run frontend-dev
```

### Production режим

```bash
npm start
```

Это собирает приложение и запускает server на `http://localhost:3000`.

### Очистка портов

Если при разработке зависли процессы:

```bash
npm run dev:clean
```

## Сборка

```bash
# Собрать всё
npm run build

# Собрать только backend
npm run backend-build

# Собрать только frontend
npm run frontend-build
```

## Code Quality

```bash
# Проверить код (ESLint)
npm run lint

# Исправить ошибки линтера автоматически
npm run lint:fix

# Отформатировать код (Prettier)
npm run format

# Проверить форматирование без изменений
npm run format:check
```

## API

### User Endpoints

#### POST `/api/users/register`
Регистрация нового пользователя.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### GET `/api/users`
Получить всех пользователей.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
]
```

#### GET `/api/users/:id`
Получить пользователя по ID.

#### PUT `/api/users/:id`
Обновить пользователя.

#### DELETE `/api/users/:id`
Удалить пользователя.

## Архитектура

### Frontend SPA
- **Маршрутизация:** Клиентская маршрутизация на основе URL
- **Навигация:** SPA ссылки с preventDefault
- **Шаблоны:** Использование templator для рендера компонентов
- **Компоненты:** Модульная структура компонентов

### Backend
- **Структура:** Controllers → Routes → Models → Database
- **Middleware:** JSON парсинг
- **Статика:** Сервирование static файлов из `dist/public`
- **Graceful Shutdown:** Корректное завершение при Ctrl+C

## База данных

По умолчанию используется **MongoDB In-Memory Server** для разработки:
- Автоматически поднимается при запуске
- Загружаются фикстуры с 3 тестовыми пользователями
- Сбрасывается при перезапуске сервера

При остановке приложения:
1. Закрывается HTTP сервер
2. Закрывается соединение с MongoDB
3. Процесс завершается корректно

## Детальное описание скриптов

Для полного описания всех npm скриптов см. [SCRIPTS.md](./SCRIPTS.md)

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/chat-app

# Server
PORT=3000
NODE_ENV=development
```

## Разработка

### Добавление нового компонента (Frontend)

1. Создайте папку в `src/client/components/`
2. Создайте `index.ts` с компонентом
3. Экспортируйте компонент
4. Используйте в маршруте

### Добавление нового API endpoint (Backend)

1. Создайте route в `src/server/routes/`
2. Создайте controller в `src/server/controllers/`
3. Подключите route в `src/server/routes/index.ts`
4. Добавьте Model в `src/server/models/` если требуется

## Примечания

- Все логи обозначены префиксами `[BACKEND]` (cyan) и `[FRONTEND]` (magenta) для удобства
- При использовании `npm run dev`, обе части приложения останавливаются одновременно при Ctrl+C
- Используется ES modules (`"type": "module"` в package.json)
- Парсер JSON встроен в Express middleware

## Лицензия

ISC
