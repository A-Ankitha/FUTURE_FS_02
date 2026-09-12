````
# LeadFlow — Mini CRM

LeadFlow is a full-stack Customer Relationship Management (CRM) application built to help businesses manage potential clients and sales leads from a single workspace.

The application provides a public inquiry form for potential clients and a secure admin dashboard where business teams can organize leads, track follow-ups, add notes, monitor activity, and analyze pipeline performance.

## ✨ Features

### 🌐 Public Website

- Responsive landing page introducing LeadFlow
- Features section explaining the CRM capabilities
- "Who It's For" section for potential clients and business admins
- How It Works workflow
- Public contact/inquiry form
- Inquiry confirmation screen
- Light and dark theme support
- Responsive navigation for desktop and mobile

### 📩 Lead Capture

Potential clients can submit:

- Full name
- Email address
- Phone number
- Company
- Inquiry source
- Service of interest
- Project/inquiry message

Submitted inquiries are automatically stored as leads in the CRM.

### 🔐 Admin Authentication

- Secure admin login
- JWT-based authentication
- Protected dashboard routes
- Password hashing using bcrypt
- Authentication state persistence
- Automatic removal of invalid authentication tokens
- Logout functionality
- Password visibility toggle on the login form

### 👥 Lead Management

Admins can:

- View all leads
- Add new leads
- Edit existing leads
- Delete leads
- View detailed lead information
- Update lead status
- Set lead priority
- Assign lead source
- Schedule follow-up dates
- Search leads by name, email, or company
- Filter leads by status, priority, and source
- Sort leads by:
  - Newest
  - Oldest
  - Name
  - Priority
  - Follow-up date
- Clear active filters

### 📝 Notes & Activity Tracking

Each lead can contain internal notes and an activity history.

The activity timeline records events such as:

- Lead creation
- Lead updates
- Status changes
- Notes added
- Follow-ups scheduled
- Follow-ups updated
- Lead conversion

### 📅 Follow-up Management

Admins can view upcoming follow-ups and:

- See leads requiring follow-up
- Open the associated lead
- Reschedule follow-up dates

### 📊 Analytics

The analytics section provides an overview of the lead pipeline, including:

- Total leads
- New leads
- Converted leads
- Conversion rate
- Lead creation trends
- Lead status distribution
- Lead source distribution

### ⚙️ Settings

The settings page currently provides:

- Admin account information
- Authentication/security information
- Light/dark theme switching

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- CORS

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

## 📁 Project Structure

```text
FUTURE_FS_02-main/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seedData.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
└── README.md
````

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd FUTURE_FS_02-main
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 4. Start the backend

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Configure the frontend environment

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🌱 Demo Data

The project includes a seed script for creating demo data.

From the `backend` directory:

```bash
npm run seed
```

The seed script creates a demo admin account and sample leads for testing.

### Demo Admin

```text
Email: admin@leadflow.dev
Password: admin123
```

> These credentials are intended for local/demo testing and should not be used as production credentials.

The seed script clears existing Lead, Note, and Activity data before recreating the demo dataset. **Do not run it against a production database unless you intentionally want to reset that data.**

## 🔌 API Overview

The backend exposes REST API endpoints for authentication, lead management, notes, activities, follow-ups, analytics, and public inquiries.

### Authentication

```text
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

### Leads

```text
GET    /api/leads
POST   /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
```

### Notes

```text
GET  /api/leads/:id/notes
POST /api/leads/:id/notes
```

### Activities

```text
GET /api/leads/:id/activities
```

### Follow-ups

Follow-up information is available through the lead management API and is displayed through the Follow-ups section of the dashboard.

### Analytics

```text
GET /api/analytics/overview
```

### Public Inquiry

```text
POST /api/public/contact
```

The public inquiry endpoint does not require admin authentication.

## 🔎 Lead Search & Filtering

LeadFlow supports server-side lead searching and filtering.

Search can match:

* Name
* Email
* Company

Available filters include:

* Status
* Priority
* Source

Available sorting options include:

* Newest
* Oldest
* Name
* Priority
* Follow-up date

The frontend also provides a **Clear Filters** action for quickly resetting the lead list.

## 🔒 Security

The application includes several security measures:

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Protected frontend dashboard routes
* Authentication token stored in browser local storage
* CORS configuration
* Environment variables for sensitive configuration
* Server-side authentication middleware
* Input validation on lead and inquiry forms

Sensitive environment variables such as database credentials and JWT secrets should never be committed to the repository.

## 🎨 UI & Accessibility

LeadFlow was designed with a clean, responsive CRM interface.

The application includes:

* Light mode
* Dark mode
* Responsive layouts
* Accessible form labels
* Keyboard-friendly controls
* Form validation and error messages
* Loading states for asynchronous actions
* Empty states for sections without data
* Descriptive buttons and controls
* Consistent visual hierarchy

## 🌍 Live Demo

### Frontend

[https://future-fs-02-five-alpha.vercel.app](https://future-fs-02-five-alpha.vercel.app)

The production frontend is deployed using Vercel.

The backend is deployed separately using Render and communicates with the frontend through the configured API URL.

## ☁️ Deployment

### Frontend — Vercel

The frontend requires:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

A Vercel rewrite is included in:

```text
frontend/vercel.json
```

to support client-side React Router routes.

### Backend — Render

The backend requires:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-vercel-frontend.vercel.app
```

Render provides the `PORT` environment variable automatically.

The normal production start command is:

```bash
npm start
```

The seed command should only be used intentionally when demo data needs to be created or reset.

### Database — MongoDB Atlas

MongoDB Atlas is used as the production database.

The connection string is supplied through:

```env
MONGO_URI
```

## 📌 Project Purpose

This project was developed as part of the **Future Interns Full Stack Web Development Task 2 — Mini CRM / Client Lead Management System**.

The primary goal is to demonstrate a practical full-stack workflow where public client inquiries are captured and then managed by an authenticated business administrator through a CRM dashboard.

## 🔮 Future Improvements

Potential future enhancements include:

* Real password-change functionality
* Profile editing
* Role-based access control
* Email notifications for new inquiries
* Automated follow-up reminders
* Advanced reporting and export
* Pagination for larger lead datasets
* More detailed audit logging
* Custom CRM fields
* Integration with external communication and calendar services
