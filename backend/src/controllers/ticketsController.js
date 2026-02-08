import sql from '../config/db.js';

// Get all tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await sql`
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.status, 
        t.created_at, 
        t.resolved_at,
        u.name as user_name,
        u.email as user_email
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;

    res.status(200).json({
      tickets,
      count: tickets.length
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching tickets.' 
    });
  }
};

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // From JWT middleware

    if (!title) {
      return res.status(400).json({ 
        error: 'Title is required.' 
      });
    }

    const newTicket = await sql`
      INSERT INTO tickets (title, description, user_id)
      VALUES (${title}, ${description || ''}, ${userId})
      RETURNING *
    `;

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTicket[0]
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating ticket.' 
    });
  }
};

// Resolve a ticket
export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ticket exists
    const tickets = await sql`
      SELECT * FROM tickets WHERE id = ${id}
    `;

    if (tickets.length === 0) {
      return res.status(404).json({ 
        error: 'Ticket not found.' 
      });
    }

    const ticket = tickets[0];

    // Check if already resolved
    if (ticket.status === 'resolved') {
      return res.status(400).json({ 
        error: 'Ticket is already resolved.' 
      });
    }

    // Resolve ticket
    const updatedTicket = await sql`
      UPDATE tickets 
      SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.status(200).json({
      message: 'Ticket resolved successfully',
      ticket: updatedTicket[0]
    });
  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({ 
      error: 'Internal server error while resolving ticket.' 
    });
  }
};
