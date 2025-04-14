import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

// Create email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 465, // Use 587 for TLS, 465 for SSL
  secure: true, // `true` for port 465, `false` for 587
  auth: {
    user: process.env.EMAIL,         // Sender email
    pass: process.env.EMAIL_PASSWORD, // App password (from .env)
  },
  tls: {
    rejectUnauthorized: false, // Prevent TLS issues
  },
});

// Function to send email
async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"NPFurnish" <${process.env.EMAIL}>`, // Set a readable name
      to,                     // Recipient
      subject,                // Email subject
      text,                   // Plain text content
      html,                   // HTML content
    });

    console.log(`📧 Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export { sendEmail };
