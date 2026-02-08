# API Documentation

Base URL: `http://localhost:5000`

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400` - Missing fields or password too short
- `409` - Email already exists
- `500` - Server error

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials or Google-only account
- `500` - Server error

---

### 3. Google OAuth Login
**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "token": "google-oauth-access-token-here"
}
```

**Success Response (200):**
```json
{
  "message": "Google authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "user@gmail.com",
    "name": "Google User"
  }
}
```

**Error Responses:**
- `400` - Missing Google token
- `500` - Invalid token or server error

---

## Tickets Endpoints (Protected)

**Authentication Required:** All ticket endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. Get All Tickets
**Endpoint:** `GET /tickets`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "tickets": [
    {
      "id": 1,
      "title": "Login Issue",
      "description": "Cannot login to dashboard",
      "status": "open",
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "created_at": "2024-02-08T10:30:00Z",
      "resolved_at": null
    },
    {
      "id": 2,
      "title": "Payment Failed",
      "description": "Transaction declined",
      "status": "resolved",
      "user_name": "Jane Smith",
      "user_email": "jane@example.com",
      "created_at": "2024-02-07T14:20:00Z",
      "resolved_at": "2024-02-08T09:15:00Z"
    }
  ],
  "count": 2
}
```

**Error Responses:**
- `401` - Missing or invalid token
- `500` - Server error

---

### 2. Create Ticket
**Endpoint:** `POST /tickets`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "Bug Report",
  "description": "Found a bug in the checkout process"
}
```

**Success Response (201):**
```json
{
  "message": "Ticket created successfully",
  "ticket": {
    "id": 3,
    "title": "Bug Report",
    "description": "Found a bug in the checkout process",
    "status": "open",
    "user_id": 1,
    "created_at": "2024-02-08T11:00:00Z",
    "resolved_at": null
  }
}
```

**Error Responses:**
- `400` - Missing title
- `401` - Missing or invalid token
- `500` - Server error

---

### 3. Resolve Ticket
**Endpoint:** `POST /tickets/:id/resolve`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:** `POST /tickets/1/resolve`

**Success Response (200):**
```json
{
  "message": "Ticket resolved successfully",
  "ticket": {
    "id": 1,
    "title": "Login Issue",
    "description": "Cannot login to dashboard",
    "status": "resolved",
    "user_id": 1,
    "created_at": "2024-02-08T10:30:00Z",
    "resolved_at": "2024-02-08T11:05:00Z"
  }
}
```

**Error Responses:**
- `400` - Ticket already resolved
- `401` - Missing or invalid token
- `404` - Ticket not found
- `500` - Server error

---

## Error Response Format

All errors follow this structure:
```json
{
  "error": "Error message description"
}
```

## JWT Token Structure

Tokens contain:
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "iat": 1707390000,
  "exp": 1707476400
}
```

Token expiration: **24 hours**

---

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Tickets:
```bash
curl -X GET http://localhost:5000/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Resolve Ticket:
```bash
curl -X POST http://localhost:5000/tickets/1/resolve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
