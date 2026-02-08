import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import sql from '../config/db.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required.' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long.' 
      });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        error: 'User with this email already exists.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, ${name})
      RETURNING id, email, name, created_at
    `;

    // Generate token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration.' 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.' 
      });
    }

    // Find user
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    const user = users[0];

    // Check if user registered with Google (no password)
    if (!user.password) {
      return res.status(401).json({ 
        error: 'This account uses Google Sign-In. Please login with Google.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login.' 
    });
  }
};

// Google OAuth
export const googleAuth = async (req, res) => {
  try {
    const { token: googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ 
        error: 'Google token is required.' 
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists
    let users = await sql`
      SELECT * FROM users WHERE google_id = ${googleId} OR email = ${email}
    `;

    let user;

    if (users.length > 0) {
      // User exists
      user = users[0];

      // Update google_id if not set
      if (!user.google_id) {
        await sql`
          UPDATE users 
          SET google_id = ${googleId}
          WHERE id = ${user.id}
        `;
        user.google_id = googleId;
      }
    } else {
      // Create new user
      const newUser = await sql`
        INSERT INTO users (email, name, google_id)
        VALUES (${email}, ${name}, ${googleId})
        RETURNING id, email, name, google_id, created_at
      `;
      user = newUser[0];
    }

    // Generate custom JWT
    const jwtToken = generateToken(user);

    res.status(200).json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      error: 'Internal server error during Google authentication.' 
    });
  }
};
