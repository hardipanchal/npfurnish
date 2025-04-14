// testEmail.js

// Make sure dotenv is configured to access your .env variables
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

// Import your email sending utility
import sendEmailFun from "./config/sendEmail.js"; // Adjust path if needed

// Async function to test sending email
async function testEmail() {
  try {
    const result = await sendEmailFun(
      "recipient@example.com",                 // Replace with real email
      "Test Email Subject",                    // Subject line
      "This is a test email (plain text)",     // Plain text version
      "<h1>This is a test email.</h1>"         // HTML version
    );

    console.log("✅ Email sent successfully!");
    console.log(result); // Should log transporter info like messageId, accepted[], etc.
  } catch (error) {
    console.error("❌ Error sending test email:", error.message);
  }
}

testEmail();
