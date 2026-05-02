# Setup Guide

---

## Option 1 — Docker (Recommended)

Requires Docker and Docker Compose installed.

### Run everything with one command

```bash
git clone https://github.com/09ahmad/ethara-assessment-
cd ethara-assessment-
docker compose up --build
```

This starts three services automatically:
- PostgreSQL on port 5432
- Backend API on port 3000
- Frontend on port 5173

Open the app: http://localhost:5173  
API docs: http://localhost:3000/api/v1/docs

### Stop

```bash
docker compose down
```

### Full reset (wipes database)

```bash
docker compose down -v
```

---

## Option 2 — Manual Setup

### Prerequisites

- Bun (https://bun.sh)
- Node.js 20+
- PostgreSQL running locally or on a cloud provider like Neon (https://neon.tech)

### Backend

```bash
cd backend
bun install
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanagerdb
JWT_SECRET=your-secret-key-here
PORT=3000
```

Run migrations and seed:
```bash
cd src/config
bunx prisma migrate deploy
bunx prisma generate
cd ../..
bun run seed
```

Start the server:
```bash
bun run dev
```

Backend runs at http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

Make sure `VITE_API_URL` in `frontend/.env` points to your backend:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Option 3 — Backend Only (Docker)

```bash
cd backend
docker compose up --build
```

Starts PostgreSQL and the backend API only.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:pass@localhost:5432/taskmanagerdb |
| JWT_SECRET | Secret key for signing tokens | any-long-random-string |
| PORT | Port the server runs on | 3000 |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| VITE_API_URL | Backend API base URL | http://localhost:3000/api/v1 |

