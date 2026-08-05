const express = require('express');
const router = express.Router();
const { login, getMe, logout, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/change-password', protect, changePassword);

module.exports = router;
