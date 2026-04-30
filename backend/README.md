# Team Task Manager — Backend

Role-based team task management REST API built with Bun, Express, PostgreSQL, and Prisma.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Bun |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | JWT |
| Validation | Zod |
| Containerization | Docker + Docker Compose |
| API Docs | Swagger UI |

---

## Roles & Permissions

| Action | MEMBER | ADMIN |
|---|---|---|
| Register / Login | ✅ | ✅ |
| View own projects | ✅ | ✅ |
| View all projects | ❌ | ✅ |
| Create projects | ❌ | ✅ |
| Add / remove members | ❌ | ✅ |
| Create & update tasks | ✅ | ✅ |
| Delete tasks | ❌ | ✅ |
| View dashboard | ✅ | ✅ |
| Manage users | ❌ | ✅ |

---

## Quick Start (Docker)

```bash
docker compose up --build
```

Server starts at `http://localhost:3000`

Default admin credentials:

| Field | Value |
|---|---|
| Email | `admin@taskmanager.com` |
| Password | `Admin@123` |

```bash
# Stop
docker compose down

# Full reset (wipes database)
docker compose down -v
```

---

## Manual Setup

**Prerequisites:** Bun, PostgreSQL

```bash
bun install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
cd src/config && bunx prisma migrate deploy && cd /app
bun run seed
bun run dev
```

---

## API Documentation

Swagger UI available at: http://localhost:3000/api/v1/docs


