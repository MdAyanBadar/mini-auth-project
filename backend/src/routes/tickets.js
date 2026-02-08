import express from 'express';
import { getTickets, createTicket, resolveTicket } from '../controllers/ticketsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// GET /tickets
router.get('/', getTickets);

// POST /tickets
router.post('/', createTicket);

// POST /tickets/:id/resolve
router.post('/:id/resolve', resolveTicket);

export default router;
