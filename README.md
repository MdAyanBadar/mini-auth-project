
# Mini Auth System

A full-stack authentication system built with JWT-based authentication and Google OAuth 2.0, demonstrating secure auth flows, protected APIs, and frontend–backend integration.

🔗 **Live Demo**

* **Frontend (Vercel):**
  [https://mini-auth-project-kappa.vercel.app](https://mini-auth-project-kappa.vercel.app)

* **Backend (Render):**
  [https://mini-auth-project.onrender.com](https://mini-auth-project.onrender.com)

---

## Features

✅ **Email + Password Authentication**

* User registration with validation
* Secure login using bcrypt password hashing
* JWT token generation (24h expiration)

✅ **Google OAuth 2.0**

* Sign in with Google
* Backend verification of Google **ID token**
* Custom JWT generation for Google users

✅ **Protected Routes**

* JWT middleware protection
* Token validation
* Automatic logout on invalid or expired token

✅ **Ticket Management (Mock Feature)**

* View support tickets
* Create new tickets
* Resolve tickets (protected endpoint)

---

## Tech Stack

### Backend

* **Node.js** + **Express.js**
* **PostgreSQL (NeonDB)**
* **JWT** for authentication
* **bcrypt** for password hashing
* **google-auth-library** for OAuth
* **Render** for deployment

### Frontend

* **React 18** + **Vite**
* **Redux Toolkit** for state management
* **React Router**
* **@react-oauth/google**
* **Vercel** for deployment

---

## Project Structure

```
mini-auth-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── ticketsController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tickets.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── store/
│   │   │   └── slices/authSlice.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Auth

```
POST /auth/register
POST /auth/login
POST /auth/google
```

### Tickets (Protected)

```
GET  /tickets
POST /tickets
POST /tickets/:id/resolve
```

---

## How to Run Locally

### Prerequisites

* Node.js (v18+)
* PostgreSQL / NeonDB
* Google OAuth Client ID

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=4000
DATABASE_URL=postgresql://<connection_string>
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=development
```

Start server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start frontend:

```bash
npm run dev
```

---

## Deployment

### Frontend (Vercel)

* Build command: `npm run build`
* Output directory: `dist`
* Environment variables:

```env
VITE_API_URL=https://mini-auth-project.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (Render)

* Environment variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
```

* Start command:

```bash
node src/server.js
```

---

## Edge Cases Handled

✔ Duplicate email registration
✔ Invalid credentials
✔ Google-only account blocked from email login
✔ Missing / expired JWT
✔ Protected route access without token
✔ Ticket not found
✔ Ticket already resolved

---

## Database Schema

### Users

```sql
id          SERIAL PRIMARY KEY
email       VARCHAR UNIQUE NOT NULL
password    VARCHAR
name        VARCHAR NOT NULL
google_id   VARCHAR UNIQUE
created_at  TIMESTAMP
```

### Tickets

```sql
id          SERIAL PRIMARY KEY
title       VARCHAR NOT NULL
description TEXT
status      VARCHAR DEFAULT 'open'
user_id     INTEGER
created_at  TIMESTAMP
resolved_at TIMESTAMP
```

---

## Assumptions

* Google OAuth initiated on frontend, verified on backend
* JWT expiry set to 24 hours
* No refresh token flow (out of scope)
* Tickets are mock domain data
* Email verification skipped due to time constraints

---

## Security Notes

* Passwords hashed using bcrypt
* JWT secret stored only on backend
* SQL injection prevented via parameterized queries
* Frontend never stores secrets

---

## Future Improvements

* Refresh token mechanism
* Role-based access control
* Email verification
* Password reset flow
* Rate limiting
* Unit & integration tests

---

## Author

**MD Ayan Badar**
Built as a technical assessment project.
**GitHub Repository:** `mini-auth-project`


