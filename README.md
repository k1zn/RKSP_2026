# Дендрарий — каталог деревьев

Клиент-серверное веб-приложение для управления каталогом деревьев и дендропарков.

## Стек

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: React + TypeScript

## Запуск

```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm start
```

## API

- `GET /users` — список пользователей
- `GET /users/:id` — пользователь по id
- `POST /users` — создать пользователя
- `GET /species` — список видов деревьев
- `GET /trees` — список деревьев
- `GET /locations` — список локаций
