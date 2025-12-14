const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'rym-gsm-secret-key-2024';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('[Auth] No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[Auth] Token decoded, userId:', decoded.userId);
    
    // Get user from database
    const [users] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      console.log('[Auth] User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = users[0];
    console.log('[Auth] User authenticated:', users[0].id, users[0].email);
    next();
  } catch (error) {
    console.log('[Auth] Token verification error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
