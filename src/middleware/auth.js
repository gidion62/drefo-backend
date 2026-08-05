const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protect routes — verifies JWT and attaches admin to req
 */
const protect = async (req, res, next) => {
  let token;

  // Accept token from Authorization header OR cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.drefo_token) {
    token = req.cookies.drefo_token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account not found or deactivated.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

/**
 * Restrict to superadmin only
 */
const superAdminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === 'superadmin') return next();
  return res.status(403).json({ success: false, message: 'Superadmin access required.' });
};

module.exports = { protect, superAdminOnly };
