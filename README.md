# Mini Auth System

A full-stack authentication system with JWT-based auth and Google OAuth 2.0 integration.

## Features

✅ **Email + Password Authentication**
- User registration with validation
- Secure login with bcrypt password hashing
- JWT token generation (24h expiration)

✅ **Google OAuth 2.0**
- Sign in with Google
- Custom JWT generation for Google users
- Automatic user creation/login

✅ **Protected Routes**
- JWT-based middleware protection
- Token validation
- Automatic logout on token expiration

✅ **Ticket Management**
- View all support tickets
- Create new tickets
- Resolve tickets (protected endpoint)

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **NeonDB** (PostgreSQL)
- **JWT** for authentication
- **bcrypt** for password hashing
- **Google Auth Library** for OAuth

### Frontend
- **React 18** + **Vite**
- **Redux Toolkit** for state management
- **React Router** for navigation
- **@react-oauth/google** for Google Sign-In

## Project Structure

```
mini-auth/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # NeonDB configuration
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT middleware
│   │   ├── controllers/
│   │   │   ├── authController.js  # Auth logic
│   │   │   └── ticketsController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tickets.js
│   │   └── server.js              # Express server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── store/
│   │   │   ├── store.js           # Redux store
│   │   │   └── slices/
│   │   │       └── authSlice.js   # Auth state + thunks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## API Endpoints

### Auth Routes
```
POST   /auth/register      - Register new user
POST   /auth/login         - Login with email/password
POST   /auth/google        - Login with Google OAuth
```

### Tickets Routes (Protected)
```
GET    /tickets            - Get all tickets
POST   /tickets            - Create new ticket
POST   /tickets/:id/resolve - Resolve a ticket
```

## How to Run

### Prerequisites
- Node.js (v18+)
- NeonDB account
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mini-auth
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NODE_ENV=development
```

**Get NeonDB Connection String:**
1. Go to [NeonDB Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Replace `DATABASE_URL` in `.env`

**Get Google Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000` to authorized JavaScript origins
6. Copy Client ID

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open browser at `http://localhost:3000`

## Usage

### Register a New User
1. Navigate to `/register`
2. Fill in name, email, and password (min 6 characters)
3. Click "Sign Up" or "Continue with Google"

### Login
1. Navigate to `/login`
2. Enter email and password
3. Or click "Continue with Google"

### View Dashboard
- After login, you'll be redirected to `/dashboard`
- View all support tickets
- Resolve open tickets
- Logout when done

## Edge Cases Handled

✅ **Duplicate Email Registration**
- Returns 409 Conflict error
- Shows clear error message to user

✅ **Invalid Credentials**
- Returns 401 Unauthorized
- Generic error message for security

✅ **Expired/Invalid JWT**
- Middleware returns 401
- Frontend automatically logs out user

✅ **Google User Trying Email Login**
- Detects null password
- Shows helpful error message

✅ **Missing Token on Protected Routes**
- Middleware blocks access
- Redirects to login page

✅ **Ticket Not Found**
- Returns 404 error
- Clear error message

✅ **Already Resolved Ticket**
- Returns 400 error
- Prevents duplicate resolution

## Database Schema

### Users Table
```sql
id          SERIAL PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
password    VARCHAR(255)
name        VARCHAR(255) NOT NULL
google_id   VARCHAR(255) UNIQUE
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Tickets Table
```sql
id          SERIAL PRIMARY KEY
title       VARCHAR(255) NOT NULL
description TEXT
status      VARCHAR(50) DEFAULT 'open'
user_id     INTEGER REFERENCES users(id)
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
resolved_at TIMESTAMP
```

## Assumptions

1. **Google OAuth Flow**: Frontend-initiated flow using access tokens
2. **JWT Expiration**: 24 hours (configurable)
3. **Password Requirements**: Minimum 6 characters
4. **Tickets**: Mock data - in production would have more fields
5. **No Email Verification**: Skipped for time constraint
6. **No Refresh Tokens**: Single JWT for simplicity
7. **No Rate Limiting**: Would add in production
8. **CORS**: Open for development (restrict in production)

## Security Considerations

🔒 **Passwords**: Hashed with bcrypt (10 salt rounds)
🔒 **JWT Secret**: Environment variable (change in production)
🔒 **SQL Injection**: Parameterized queries with Neon client
🔒 **CORS**: Configured for development
🔒 **Token Storage**: LocalStorage (consider httpOnly cookies in production)

## Future Improvements

- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] Better error handling UI
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## License

MIT

## Author

Built as a technical assessment project.
# mini-auth-project
