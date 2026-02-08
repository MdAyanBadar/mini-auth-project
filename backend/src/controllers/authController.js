import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import sql from '../config/db.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 JWT generator for your app's internal sessions
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// =======================
// REGISTER
// =======================
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, ${name})
      RETURNING id, email, name
    `;

    const token = generateToken(newUser[0]);

    res.status(201).json({
      token,
      user: newUser[0],
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// =======================
// LOGIN
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(401).json({
        error: 'Use Google login for this account',
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// =======================
// GOOGLE AUTH (ROBUST FIX)
// =======================
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token missing' });
    }

    let email, name, googleId;

    // 1. Attempt to treat as ID TOKEN (JWT)
    // We check for '.' and 3 segments to avoid unnecessary errors
    if (token.includes('.') && token.split('.').length === 3) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          googleId = payload.sub;
        }
      } catch (jwtError) {
        // Log the warning but don't stop the flow
        console.warn('JWT verification failed, trying fallback as Access Token...');
      }
    }

    // 2. If not a JWT or JWT verification failed, attempt as ACCESS TOKEN (ya29)
    if (!email) {
      try {
        const tokenInfo = await googleClient.getTokenInfo(token);

        if (!tokenInfo?.email) {
          return res.status(401).json({ error: 'Invalid Google access token structure' });
        }

        email = tokenInfo.email;
        googleId = tokenInfo.sub;
        name = email.split('@')[0];
      } catch (accessTokenError) {
        console.error('Google token validation failed entirely:', accessTokenError.message);
        return res.status(401).json({ error: 'Invalid or expired Google token' });
      }
    }

    // 3. UPSERT USER
    const users = await sql`
      SELECT * FROM users WHERE google_id = ${googleId} OR email = ${email}
    `;

    let user;

    if (users.length > 0) {
      user = users[0];

      // Link Google ID if the user already existed via email registration
      if (!user.google_id) {
        await sql`
          UPDATE users SET google_id = ${googleId}
          WHERE id = ${user.id}
        `;
      }
    } else {
      const newUser = await sql`
        INSERT INTO users (email, name, google_id)
        VALUES (${email}, ${name}, ${googleId})
        RETURNING id, email, name
      `;
      user = newUser[0];
    }

    const jwtToken = generateToken(user);

    return res.status(200).json({ token: jwtToken, user });
  } catch (err) {
    console.error('General Google auth error:', err);
    return res.status(500).json({ error: 'Google authentication failed' });
  }
};
