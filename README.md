# Team Task Manager

A full-stack role-based team task management application built with React, Express, PostgreSQL, and Prisma. Users can create projects, assign tasks, and track progress with role-based access control (Admin/Member).

---

## 🚀 Key Features

- **Authentication** — Secure signup/login with JWT tokens
- **Project & Team Management** — Create projects, add/remove team members
- **Task Management** — Create, assign, and track tasks with status (TODO, IN_PROGRESS, DONE) and priority (LOW, MEDIUM, HIGH)
- **Dashboard** — View tasks, status overview, and overdue tasks
- **Role-Based Access Control** — Admin and Member roles with different permissions

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | JWT |
| Validation | Zod |
| API Docs | Swagger UI |
| Containerization | Docker + Docker Compose |

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router DOM |

---

## 📋 Roles & Permissions

| Action | MEMBER | ADMIN |
|--------|--------|-------|
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

## 📂 Project Structure

```
ethara-assessment/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app configuration
│   │   ├── server.ts           # Server entry point
│   │   ├── config/             # Prisma config & seed
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth & role middleware
│   │   ├── validators/         # Zod schemas
│   │   └── types/              # TypeScript types
│   ├── docker-compose.yml      # Docker services
│   ├── Dockerfile              # Backend container
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── context/            # React context (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   └── utils/              # Helpers & types
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🏃‍♂️ Quick Start (Docker)

### Prerequisites
- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ethara-assessment
   ```

2. **Start the application**
   ```bash
   cd backend
   docker compose up --build
   ```

3. **Access the application**
   - Backend API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api/v1/docs
   - Frontend: http://localhost:5173 (run separately)

4. **Default Admin Credentials**
   | Field | Value |
   |-------|-------|
   | Email | `admin@taskmanager.com` |
   | Password | `Admin@123` |

### Stop Services

```bash
# Stop containers
docker compose down

# Full reset (wipes database)
docker compose down -v
```

---

## ⚙️ Manual Setup

### Prerequisites
- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) (for frontend)
- PostgreSQL database running

---

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your database credentials:
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskmanagerdb
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   ```

5. **Run database migrations**
   ```bash
   cd src/config
   bunx prisma migrate deploy
   bunx prisma generate
   cd ../..
   ```

6. **Seed the database** (creates default admin)
   ```bash
   bun run seed
   ```

7. **Start the backend server**
   ```bash
   bun run dev
   ```

   The server will start at `http://localhost:3000`

---

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will be available at `http://localhost:5173`

---

## 🐳 Alternative: Docker for Backend + npm for Frontend

If you want to run only the backend with Docker and the frontend locally:

### Backend (Docker)

```bash
cd backend
docker compose up --build
```

### Frontend (npm)

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 API Documentation

Once the backend is running, visit the Swagger UI:

- **URL**: http://localhost:3000/api/v1/docs

This provides an interactive interface to explore and test all API endpoints.

---

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `PORT` | Server port (default: 3000) | `3000` |

---

## 🏗️ Database Schema

### Models

- **User** — id, name, email, password, role (ADMIN/MEMBER), status
- **Project** — id, name, description, ownerId, isDeleted
- **ProjectMember** — id, projectId, userId (junction table)
- **Task** — id, title, description, status, priority, dueDate, projectId, creatorId, assigneeId

### Relationships

- User → Projects (one-to-many, as owner)
- User ↔ Project (many-to-many, via ProjectMember)
- Project → Tasks (one-to-many)
- User → Tasks (one-to-many, as creator and assignee)

---

## 📦 Deployment (Railway)

For deployment on Railway:

### Backend
1. Create a new Railway project
2. Add PostgreSQL service
3. Set environment variables:
   - `DATABASE_URL`: Railway provided PostgreSQL URL
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: 3000
4. Deploy from GitHub repository (backend folder)

### Frontend
1. Create a new Railway project (or use same with multiple services)
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy from GitHub repository (frontend folder)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for assessment purposes.

---

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh/), [Express](https://expressjs.com/), [Prisma](https://www.prisma.io/)
- Frontend powered by [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)