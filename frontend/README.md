# Employee Leave & Attendance Management System

## Overview

Ye mini HR tool hai jo employee leave, attendance, aur data manage karta hai. Employees leave apply kar sakte hain, attendance mark kar sakte hain. Admins approve kar sakte hain aur monitor kar sakte hain.

## Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT

## Installation

1. Backend: `cd backend`, `npm install`, `node server.js`
2. Frontend: `cd frontend`, `npm install`, `npm start`

## Environment Variables

- MONGO_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT

## API Endpoints

- POST /api/users/register: User register
- POST /api/users/login: Login
- GET /api/users/profile: Profile
- POST /api/leaves/apply: Leave apply
- GET /api/leaves/my-leaves: My leaves
- PUT /api/leaves/approve/:id: Approve leave (admin)
- POST /api/attendance/mark: Mark attendance
- GET /api/attendance/my-attendance: My attendance
- GET /api/attendance/all-attendance: All attendance (admin)

## Database Models

- User: name, email, password, role, dateOfJoining, leaveBalance
- Leave: userId, type, startDate, endDate, totalDays, status, appliedDate, reason
- Attendance: userId, date, status

## Admin Credentials

Email: admin@example.com, Password: admin123

## AI Tools Used

blackBoxAi for code snippets and structure.

## Limitations

No email notifications, basic UI.

## Time Spent

Approx 8 hours.
