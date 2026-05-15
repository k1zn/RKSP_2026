# Дендрарий — каталог деревьев

Клиент-серверное веб-приложение для управления каталогом деревьев и дендропарков.

## Стек

- **Backend**: NestJS 11 + TypeORM + PostgreSQL 16
- **Frontend**: React 19 + TypeScript + React Router DOM v7
- **Auth**: JWT (passport-jwt) + bcryptjs

## Требования

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Запуск

```bash
# 1. Создать базу данных в PostgreSQL
createdb dendrary

# 2. Выполнить схему и тестовые данные
psql -d dendrary -f DB/schema.sql
psql -d dendrary -f DB/seed.sql

# 3. Backend
cd Source/backend
cp .env.example .env   # настроить подключение к БД
npm install
npm run start:dev

# 4. Frontend (в другом терминале)
cd Source/frontend
npm install
npm start
```

Приложение доступно на http://localhost:3001
API доступно на http://localhost:3000

## Учётные данные по умолчанию

- **Администратор**: admin@dendrary.ru / admin123

## API

### Пользователи (публичные)
- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по id
- `POST /users` — создать пользователя

### Авторизация
- `POST /auth/login` — вход, возвращает JWT

### Виды деревьев
- `GET /species` — список видов
- `POST /species` — добавить вид (admin)
- `PATCH /species/:id` — обновить вид (admin)
- `DELETE /species/:id` — удалить вид (admin)

### Деревья
- `GET /trees` — список деревьев (с видом и локацией)
- `POST /trees` — добавить дерево (admin)
- `PATCH /trees/:id` — обновить дерево (admin)
- `DELETE /trees/:id` — удалить дерево (admin)

### Локации
- `GET /locations` — список локаций
- `POST /locations` — добавить локацию (admin)
- `PATCH /locations/:id` — обновить локацию (admin)
- `DELETE /locations/:id` — удалить локацию (admin)
