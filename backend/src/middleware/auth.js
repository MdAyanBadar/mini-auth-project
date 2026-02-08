import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ 
          error: 'Invalid or expired token.' 
        });
      }

      req.user = user; // Add user info to request
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error during authentication.' 
    });
  }
};
