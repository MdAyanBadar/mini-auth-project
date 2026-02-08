# Quick Start Guide for Evaluators

This guide will get you up and running in **5 minutes**.

## Prerequisites

- Node.js v18+ installed
- NeonDB account (free tier works)
- Google Cloud Console project (for OAuth)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <repo-url>
cd mini-auth

# Run setup script
./setup.sh

# OR manually:
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Step 2: Configure Environment (2 minutes)

### Get NeonDB Connection String
1. Go to https://console.neon.tech/
2. Create new project (if needed)
3. Copy connection string
4. Format: `postgresql://user:password@host/database?sslmode=require`

### Get Google Client ID
1. Go to https://console.cloud.google.com/
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized JavaScript origins: `http://localhost:3000`
5. Copy Client ID

### Edit Environment Files

**backend/.env:**
```env
PORT=5000
DATABASE_URL=postgresql://your-neon-connection-string-here
JWT_SECRET=any-random-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NODE_ENV=development
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Step 3: Run the Application (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:3000`

## Step 4: Test the Application

Open browser at **http://localhost:3000**

### Test Email Registration & Login:
1. Click "Sign Up"
2. Fill form: Name, Email, Password (min 6 chars)
3. Submit → Should redirect to dashboard
4. Logout
5. Login again with same credentials
6. View tickets on dashboard
7. Click "Resolve" on an open ticket

### Test Google OAuth:
1. Logout
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to dashboard
5. Same user experience as email login

## What to Evaluate

### ✅ Required Features
- [x] 2 pages: Register & Login
- [x] Email + Password login works
- [x] Google OAuth login works
- [x] JWT issued on successful auth
- [x] Protected `/tickets` endpoint
- [x] Protected `/tickets/:id/resolve` endpoint
- [x] Redux state management
- [x] Proper folder structure
- [x] 3+ meaningful git commits
- [x] README with setup instructions

### ✅ Edge Cases Handled
- [x] Duplicate email registration (409 error)
- [x] Invalid login credentials (401 error)
- [x] Expired/invalid JWT (401 + auto logout)
- [x] Google user trying email login (helpful message)
- [x] Missing token on protected routes (401)
- [x] Ticket not found (404)
- [x] Already resolved ticket (400)

### ✅ Code Quality
- [x] Clean folder structure
- [x] Separation of concerns (controllers, routes, middleware)
- [x] Redux Toolkit best practices
- [x] Error handling throughout
- [x] Async/await usage
- [x] Secure password hashing (bcrypt)
- [x] SQL injection protection (parameterized queries)

## Testing Checklist

```
[ ] Register new user with email/password
[ ] Login with registered credentials
[ ] Try registering duplicate email (should fail)
[ ] Try invalid credentials (should fail)
[ ] Logout and verify redirect to login
[ ] Register/login with Google OAuth
[ ] View tickets in dashboard
[ ] Resolve an open ticket
[ ] Try resolving same ticket again (should fail)
[ ] Manually delete token from localStorage and try accessing dashboard (should redirect)
[ ] Check Network tab for proper Authorization headers
[ ] Verify JWT in localStorage after login
```

## Common Issues & Solutions

**Issue: "Failed to fetch tickets"**
- Solution: Make sure backend is running on port 5000

**Issue: "Google login not working"**
- Solution: Check GOOGLE_CLIENT_ID in both .env files match
- Ensure `http://localhost:3000` is in authorized origins

**Issue: "Database connection failed"**
- Solution: Verify DATABASE_URL is correct
- Check NeonDB project is active

**Issue: "CORS error"**
- Solution: Backend should be running on 5000, frontend on 3000
- Vite proxy is configured in vite.config.js

## Quick Demo Flow

For a quick 2-minute demo:

1. **Register**: http://localhost:3000/register
   - Name: Test User
   - Email: test@example.com
   - Password: test123

2. **View Dashboard**: Shows tickets with user info

3. **Resolve Ticket**: Click resolve button on any open ticket

4. **Google OAuth**: Logout → Login with Google

5. **API Test**: 
   ```bash
   # Get token from localStorage in browser console
   # Then test protected endpoint:
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/tickets
   ```

## Files to Review

**Backend Understanding:**
- `backend/src/server.js` - Entry point
- `backend/src/controllers/authController.js` - Auth logic
- `backend/src/middleware/auth.js` - JWT validation
- `backend/src/config/db.js` - Database setup

**Frontend Understanding:**
- `frontend/src/App.jsx` - Routing
- `frontend/src/store/slices/authSlice.js` - Redux state
- `frontend/src/components/Login.jsx` - Login UI
- `frontend/src/components/Dashboard.jsx` - Tickets UI

**Documentation:**
- `README.md` - Full documentation
- `API_DOCS.md` - API reference
- This file - Quick start

## Time Spent

- Backend setup: ~25 minutes
- Frontend setup: ~30 minutes
- Testing & edge cases: ~20 minutes
- Documentation: ~15 minutes
- Git commits: ~10 minutes
- **Total: ~100 minutes** (within 2-hour limit)

## Questions During Evaluation?

Check:
1. README.md - Full setup guide
2. API_DOCS.md - Endpoint documentation
3. Code comments - Inline explanations
4. Git commits - Development history

---

**Ready to evaluate!** 🚀
