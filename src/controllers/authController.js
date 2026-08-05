const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/** Generate JWT token */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find admin — explicitly select password field
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated.' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns the logged-in admin's profile
 */
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin,
    },
  });
};

/**
 * POST /api/auth/logout
 * Stateless JWT — client should delete the token.
 */
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

/**
 * PATCH /api/auth/change-password
 * Body: { currentPassword, newPassword }
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');

    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};
