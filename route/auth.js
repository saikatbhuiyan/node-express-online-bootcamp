const express = require('express');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/resettpassword/:resettoken', resetPassword);

module.exports = router;
