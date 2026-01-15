# Mini HR Tool

## Project Overview

Mini HR Tool is a small full-stack application for managing employee attendance and leave requests. Employees can sign up, log in, apply for leaves, and mark attendance. Administrators can view all leaves and attendance, approve or reject leaves, and manage users.

Key features:

- Employee signup/login
- Apply for leave (type, start/end, reason)
- Mark daily attendance
- Admin view for all leave requests and attendance
- Admin approve/reject leaves

## Tech Stack & Justification

- Backend: Node.js + Express — lightweight and fast for API servers.
- Database: MongoDB + Mongoose — schema flexibility for a small HR tool and quick development.
- Frontend: React (Create React App) — component-based UI and fast developer experience.
- Styling: Tailwind CSS — quick, modern utility styling.
- Auth: JWT-based token authentication — stateless and simple for this app.
- Dev tooling: nodemon (backend), react-scripts (frontend)

These technologies were chosen for rapid development, familiarity, and wide community support.

## Installation Steps (Run locally)

Prerequisites:

- Node.js (v16+ recommended)
- npm
- MongoDB (local or Atlas)

1. Clone the repo:

```bash
git clone <repo-url> "Mini HR Tool"
cd "Mini HR Tool"
```

2. Backend setup:

```bash
cd backend
npm install
# create .env (see section below)
npm run start
```

By default the backend runs on port `5000`.

3. Frontend setup:

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on port `3000` (CRA dev server).

## Environment Variables

Create a `.env` file in `backend/` with these variables:

- `MONGO_URI` — MongoDB connection string (e.g., `mongodb://localhost:27017/mini-hr`)
- `JWT_SECRET` — Secret used to sign JWT tokens (pick a long random string)
- `PORT` — (optional) port for backend API, default 5000

Example `.env`:

```
MONGO_URI=mongodb://localhost:27017/mini-hr
JWT_SECRET=supersecret_jwt_key
PORT=5000
```

## API Endpoints

Note: All endpoints under `/api` use JWT auth (send `Authorization: Bearer <token>`) unless noted.

Users (`backend/routes/userRoutes.js`)

- POST `/api/users/signup` — Register a new user.
- POST `/api/users/login` — Login, returns `{ token, user }`.
- GET `/api/users/me` — Get current user details (auth).

Leaves (`backend/routes/leaveRoutes.js`)

- POST `/api/leaves/apply` — Apply for a leave (auth). Body: `{ type, startDate, endDate, reason }`.
- GET `/api/leaves/my-leaves` — Get leaves for current user (auth).
- GET `/api/leaves/all` — (admin) Get all leaves (auth + admin).
- PUT `/api/leaves/approve/:id` — (admin) Approve/Reject leave. Body: `{ status: 'Approved'|'Rejected' }`.
- PUT `/api/leaves/update/:id` — Update leave (user-only, limited by status).

Attendance (`backend/routes/attendanceRoutes.js`)

- POST `/api/attendance/mark` — Mark attendance for current user. Body: `{ status: 'Present'|'Absent' }`.
- GET `/api/attendance/my-attendance` — Get current user's attendance.
- GET `/api/attendance/all-attendance` — (admin) Get all attendance records.

Other details: check `backend/controllers/*` for request/response shapes. Many endpoints return simple objects like `{ message: '...' }` or arrays of documents.

## Database Models

Brief overview of Mongoose models used (see `backend/models`):

- User

  - `_id`, `name`, `email`, `password` (hashed), `role` (`employee`|`admin`), `leaveBalance` (number)

- Leave

  - `_id`, `userId` (ref `User`), `type` (`Vacation`|`Sick`|`Personal`|`Casual`), `startDate` (Date), `endDate` (Date), `totalDays` (Number), `status` (`Pending`|`Approved`|`Rejected`), `appliedDate`, `reason`

- Attendance
  - `_id`, `userId` (ref `User`), `date` (Date, stored as timestamp), `status` (`Present`|`Absent`)

Relationships:

- `Leave.userId` and `Attendance.userId` refer to `User` documents; controllers use `.populate('userId', 'name email')` for admin views.

## Admin Credentials

The backend seeds an admin user on server start if missing (see `backend/server.js`). Default seeded credentials:

- Email: `navit@gmail.com`
- Password: `123456`

Change these after first login, or remove the seeding logic in production.

## AI Tools Declaration

- I used GitHub Copilot-style assistance (AI code suggestions) during development for completing small UI helpers and formatting, and blackBoxAi-style assistance was used to help debug and improve the code. These tools assisted with refactoring, date formatting, and generating the README content.

## Time Spent (Approximate)

8 hours

---

Tell me which follow-up you'd like and I'll implement it.
