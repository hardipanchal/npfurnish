const User = require('../models/User'); // Adjust path if needed
const nodemailer = require('nodemailer');

const otpStore = {}; // Store OTPs temporarily

// Send OTP to email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    // Send email with nodemailer (mock)
    console.log(`Send this OTP to ${email}: ${otp}`);

    return res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    return res.json({ success: true, message: 'OTP verified' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = password; // Use bcrypt to hash in real app
    await user.save();

    delete otpStore[email]; // Clear OTP after reset

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
