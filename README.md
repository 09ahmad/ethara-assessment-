# Team Task Manager

A full-stack role-based task management application with authentication, project management, and task tracking.

---

## What This Project Does

- **Users** can sign up/login with JWT authentication
- **Admins** can create projects, add team members, and manage all data
- **Members** can view their assigned projects and work on tasks
- **Dashboard** shows task statistics and overdue items

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │
│   (React+Vite)  │     │   (Express)     │
│   :8080         │     │   :3000         │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Prisma ORM)  │
                        └─────────────────┘
```

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Bun, Express 5, Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

---

## API Flow

```
User ──▶ Login/Signup ──▶ Get JWT Token
    │
    ▼
Authenticated Requests ──▶ JWT Middleware ──▶ Route Handler ──▶ Prisma ──▶ Database
```

### Key Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get token |
| GET | `/api/v1/projects` | List projects (role-based) |
| POST | `/api/v1/projects` | Create project (admin only) |
| GET | `/api/v1/tasks` | List tasks |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/dashboard` | Get dashboard stats |

---

## Database Schema

```
User (id, name, email, password, role)
  │
  ├── owns Projects (ownerId)
  ├── joins Projects (ProjectMember)
  ├── creates Tasks (creatorId)
  └── is assigned Tasks (assigneeId)

Project (id, name, description, ownerId)
  │
  ├── has Members (ProjectMember)
  └── has Tasks

Task (id, title, status, priority, dueDate, projectId, creatorId, assigneeId)
```

### Enums
- **Role**: ADMIN, MEMBER
- **TaskStatus**: TODO, IN_PROGRESS, DONE
- **Priority**: LOW, MEDIUM, HIGH

---

## How to Run

### Option 1: Root Docker Compose (All-in-One)
```bash
docker compose up --build
```
Starts: PostgreSQL (5432) + Backend (3000) + Frontend (5173)

### Option 2: Backend Only with Docker
```bash
cd backend
docker compose up --build
```
Starts: PostgreSQL + Backend only

### Option 3: Manual Setup

**Backend:**
```bash
cd backend
bun install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
cd src/config && bunx prisma migrate deploy && bunx prisma generate && cd ../..
bun run seed
bun run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskmanager.com | Admin@123 |

---

## Role-Based Access

| Feature | Member | Admin |
|---------|--------|-------|
| View own projects | ✅ | ✅ |
| View all projects | ❌ | ✅ |
| Create project | ❌ | ✅ |
| Add/remove members | ❌ | ✅ |
| Delete tasks | ❌ | ✅ |
| Manage users | ❌ | ✅ |

---

## Environment Variables

```env
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
PORT=3000
```

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts           # Express config
│   ├── server.ts        # Entry point
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Auth & role checks
│   ├── validators/     # Zod schemas
│   └── config/          # Prisma & seed

frontend/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable UI
│   ├── services/        # API calls
│   └── context/         # Auth state
```

---

## Deployment (Railway)

1. **Backend**: Deploy from `backend/` folder with PostgreSQL service
2. **Frontend**: Deploy from `frontend/` folder (build: `npm run build`, output: `dist`)

Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT=3000`