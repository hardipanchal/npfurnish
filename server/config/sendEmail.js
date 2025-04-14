import { sendEmail } from "./emailService.js";
import nodemailer from "nodemailer";
const sendEmailFun = async (to, subject, text, html) => {
  console.log(`📧 Preparing to send email...`);
  console.log(`🔹 To: ${to}, Type: ${typeof to}`);
  console.log(`🔹 Subject: ${subject}`);

  if (typeof to !== "string") {
    console.error("❌ Invalid recipient: Email must be a string!", to);
    return false;
  }

  try {
    const result = await sendEmail(to, subject, text, html);
    
    if (result.success) {
      console.log(`✅ Email sent successfully to ${to}`);
      return true;
    } else {
      console.error(`❌ Failed to send email to ${to}:`, result.error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error in sendEmailFun for ${to}:`, error);
    return false;
  }
};


export default sendEmailFun;
