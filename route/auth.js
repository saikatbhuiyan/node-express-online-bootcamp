const express = require('express');

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateMe,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updateme', protect, updateMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resettpassword/:resettoken', resetPassword);

module.exports = router;
