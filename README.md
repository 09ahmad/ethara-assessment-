# TEAM TASK MANAGER

- A complete task management application that has different access levels according to a user's role (e.g., Admin or Member).
 - Frameworks used : React, Express (Bun), PostgreSQL, and Prisma in its structure.

Live URL: <https://ethara-assessment-production-c524.up.railway.app>
GitHub: <https://github.com/09ahmad/ethara-assessment->

Live Backend URL: <https://ethara-assessment-production.up.railway.app/api/v1>

- For detailed Backend routes and services overview you can visit Swagger page: <https://ethara-assessment-production.up.railway.app/api/v1/docs>

---

Important Note to login and use the app with admin Privilege use these CREDENTIALS:

- email: <admin@taskmanager.com>
- password: Admin@123

- For normal user you can create account and directly use the app with limited access
- As a normal user you can only see the assigned task to the current user

---
 ** Local development setup 
  Pre-requisit -> Docker 
- For quick localy setup you can clone the repo and just run ``` docker compose up --build ``` 
- Irrespective of Operating system you can use docker for quick start 
- As the code written in Linux it might fail in windows while local development setup so I recommend you to use docker instread for smooth setup 


---


## WHAT IT DOES

User can sign up and create an account with Member designation(default).
On the initial run, administrators will be added to the database.

Admins can:

- Create projects and add team members to them
- Assign tasks to any member in the project
- Delete tasks and manage user roles
- See platform-wide dashboard data

Members can:

- View projects they belong to
- Create and update tasks within those projects
- See their own dashboard stats

---

## HOW TO RUN LOCALLY

Requirements: Docker and Docker Compose installed.

Step 1 — Clone the repo
git clone <https://github.com/09ahmad/ethara-assessment->
cd ethara-assessment-

Step 2 — Start everything with one command
docker compose up --build

This starts three things automatically:

- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend on port 5173

Step 3 — Open the app
Frontend: <http://localhost:5173>
API Docs: <http://localhost:3000/api/v1/docs>

Step 4 — Login with the default admin account
Email: <admin@taskmanager.com>
Password: Admin@123

To stop:
docker compose down

To reset everything including the database:
docker compose down -v

---

## DEFAULT ADMIN CREDENTIALS

Email: <admin@taskmanager.com>
Password: Admin@123
Role: ADMIN

---

## API Flow

```
User ──▶ Login/Signup ──▶ Get JWT Token
    │
    ▼
Authenticated Requests ──▶ JWT Middleware ──▶ Route Handler ──▶ Prisma ──▶ Database
```

### Key Endpoints

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/v1/auth/register` | Register new user           |
| POST   | `/api/v1/auth/login`    | Login and get token         |
| GET    | `/api/v1/projects`      | List projects (role-based)  |
| POST   | `/api/v1/projects`      | Create project (admin only) |
| GET    | `/api/v1/tasks`         | List tasks                  |
| POST   | `/api/v1/tasks`         | Create task                 |
| GET    | `/api/v1/dashboard`     | Get dashboard stats         |

---

## Role-Based Access

| Feature            | Member | Admin |
| ------------------ | ------ | ----- |
| View own projects  | ✅     | ✅    |
| View all projects  | ❌     | ✅    |
| Create project     | ❌     | ✅    |
| Add/remove members | ❌     | ✅    |
| Delete tasks       | ❌     | ✅    |
| Manage users       | ❌     | ✅    |

