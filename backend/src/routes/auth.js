import express from 'express';
import { register, login, googleAuth } from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// POST /auth/google
router.post('/google', googleAuth);

export default router;
