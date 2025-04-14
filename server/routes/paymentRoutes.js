const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require('../controllers/paymentController');

// Route to create Razorpay order
router.post('/create-order', createOrder);

// Route to verify Razorpay payment
router.post('/verify', verifyPayment);

module.exports = router;
