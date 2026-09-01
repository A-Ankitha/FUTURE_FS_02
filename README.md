# LeadFlow

**Client Lead Management Platform** — a full-stack MERN CRM built for Future Interns Task 2.

LeadFlow lets a business capture leads from a public website contact form, manage them through a secure admin dashboard, track follow-ups, and monitor conversion — with every number on screen backed by real MongoDB data end to end. No hardcoded dashboards, no fake API calls.

## Features

**Public site**
- Polished landing page (hero, features, how-it-works, CTA, footer)
- Public contact form that creates a real lead in the database (`New` status, `Medium` priority, initial activity entry)

**Authentication & authorization**
- JWT-based admin login/register, bcrypt password hashing
- Every admin API route protected server-side (`authMiddleware.protect`) — not just hidden on the frontend
- Protected React routes redirect unauthenticated users to `/login`

**Dashboard**
- KPI cards: Total Leads, New, Contacted, Converted, Conversion Rate — computed from the database, not hardcoded
- Lead Status Distribution (pie) and Leads by Source (bar) charts via Recharts
- Recent Leads list and Upcoming Follow-ups with overdue count highlighted

**Lead management**
- Full CRUD (`+ Add Lead`, edit, delete — all persisted)
- Backend-driven search (name/email/company), filters (status/priority/source/date), sort (newest/oldest/name/priority/follow-up date), and pagination
- Status pipeline: New → Contacted → Qualified → Converted → Lost, with automatic `lastContacted`/`convertedAt` stamping and activity logging

**Lead detail page**
- Contact & lead information, original message
- Notes (persisted, timestamped, attributed to the admin who wrote them)
- Full activity timeline (created, status changes, notes, follow-ups, conversion)

**Follow-ups**
- Overdue / Today / Upcoming board, computed server-side from real dates
- Inline rescheduling, logged as an activity

**Analytics**
- Conversion rate, converted/lost counts, leads by source, leads by status, 30-day lead growth trend — all real aggregation queries

**Design system**
- Light mode: pastel lavender/mint SaaS palette. Dark mode: premium deep-purple palette. Both driven by CSS variables/Tailwind tokens
- Theme toggle persisted to `localStorage`, with a pre-mount script in `index.html` to avoid a flash of the wrong theme
- Responsive: sidebar becomes a mobile drawer, tables scroll horizontally, forms collapse to single-column, KPI/chart grids reflow

**UX polish**
- Toast notifications, skeleton loaders, polished empty states, inline validation, centralized backend error handling with clean HTTP status codes

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Recharts, Lucide React
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, dotenv, cors, express-validator
- **Database:** MongoDB (Atlas-compatible)

## Architecture

```
Public Contact Form → REST API → MongoDB → Admin Dashboard → Follow-up → Conversion
```

```
backend/
├── config/db.js
├── controllers/   authController, leadController, noteController,
│                  activityController, analyticsController, publicController
├── middleware/    authMiddleware, errorMiddleware, validationMiddleware
├── models/        User, Lead, Note, Activity
├── routes/        authRoutes, leadRoutes, noteRoutes, activityRoutes,
│                  analyticsRoutes, publicRoutes
├── utils/         generateToken.js, seedData.js
└── server.js

frontend/src/
├── components/    layout/, dashboard/, leads/, charts/, common/
├── pages/         Landing, Contact, Login, Dashboard, Leads, LeadDetails,
│                  FollowUps, Analytics, Settings
├── context/       AuthContext, ThemeContext, ToastContext
├── hooks/         useDebounce
├── services/      api.js (Axios instance with JWT interceptor)
└── App.jsx, main.jsx, index.css
```

## Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev             # http://localhost:5173
```

## Environment Variables

**backend/.env**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leadflow
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Running Locally

1. Start MongoDB (Atlas cluster, or a local `mongod` instance) and set `MONGO_URI` accordingly.
2. `cd backend && npm run dev` — starts the API on port 5000 and confirms the Mongo connection in the console.
3. (Optional but recommended) `npm run seed` — clears existing leads/notes/activities and populates ~42 realistic demo leads across every status, priority, and source, plus a demo admin:
   - **Email:** `admin@leadflow.dev`
   - **Password:** `admin123`
4. `cd frontend && npm run dev` — starts the React app on port 5173.
5. Visit `http://localhost:5173`, log in with the seeded admin (or register your own via `POST /api/auth/register`), and explore the dashboard.
6. Visit `http://localhost:5173/contact` in a separate tab to submit a real lead through the public form and watch it appear in the CRM.

## API Documentation

```
POST   /api/auth/register              { name, email, password }
POST   /api/auth/login                 { email, password }
GET    /api/auth/me

GET    /api/leads                      ?page=&limit=&search=&status=&priority=&source=&sort=&startDate=&endDate=
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
PATCH  /api/leads/:id/status           { status }
PATCH  /api/leads/:id/followup         { followUpDate }
DELETE /api/leads/:id
GET    /api/leads/followups/board      → { overdue, today, upcoming }

GET    /api/leads/:id/notes
POST   /api/leads/:id/notes            { text }
GET    /api/leads/:id/activities

GET    /api/analytics/overview
GET    /api/analytics/sources
GET    /api/analytics/status
GET    /api/analytics/trends           ?days=30

POST   /api/public/contact             { name, email, phone, company, source, service, message }  — no auth, powers /contact
```

All routes except `/api/auth/register`, `/api/auth/login`, and `/api/public/contact` require `Authorization: Bearer <token>`.

## Screenshots

_Add screenshots here after running the app locally:_
- Landing page
- Dashboard
- Leads table with filters
- Lead detail page (notes + activity timeline)
- Follow-ups board
- Analytics page
- Dark mode

## Future Improvements

- Email notifications for new leads and upcoming follow-ups
- Multi-admin team accounts with role-based permissions
- Automated lead scoring based on engagement signals
- Integrations with email/calendar providers
- Real password-change and profile-update endpoints (currently UI-only placeholders in Settings)

## Project Status — All 18 Phases Complete

- [x] Phase 1 — Architecture & setup
- [x] Phase 2 — Backend config & MongoDB connection
- [x] Phase 3 — Database models
- [x] Phase 4 — Authentication
- [x] Phase 5 — Lead REST APIs (CRUD, search, filter, sort, pagination)
- [x] Phase 6 — Notes, activities, follow-ups
- [x] Phase 7 — Analytics APIs
- [x] Phase 8 — React frontend setup
- [x] Phase 9 — Authentication UI
- [x] Phase 10 — Dashboard
- [x] Phase 11 — Lead management
- [x] Phase 12 — Lead details
- [x] Phase 13 — Follow-ups
- [x] Phase 14 — Analytics
- [x] Phase 15 — Landing page & contact form
- [x] Phase 16 — Responsive design & UX polish
- [x] Phase 17 — Testing and debugging (syntax-checked, all routers verified to mount, full frontend build passes with zero errors)
- [x] Phase 18 — README & deployment preparation

**Note on Phase 17 testing:** this sandbox has no local MongoDB instance available, so live end-to-end API testing (e.g. via Postman) against real data hasn't been run by the assistant. Every backend module has been syntax-checked and verified to load/mount into Express without errors, and the full frontend build compiles cleanly. Before considering this portfolio-ready, run through the app locally end-to-end once your `MONGO_URI` is connected — create/edit/delete a lead, add a note, change status, submit the public contact form, and check the analytics numbers update.
# FUTURE_FS_02
