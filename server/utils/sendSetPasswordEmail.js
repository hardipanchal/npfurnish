import nodemailer from "nodemailer";

const sendSetPasswordEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Sender email
        pass: process.env.EMAIL_PASSWORD, // App password
      },
    });

    const mailOptions = {
      from: `"NPFurnish Admin" <${process.env.EMAIL}>`,
      to: email,
      subject: "Set Your NPFurnish Account Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome to NPFurnish!</h2>
          <p>Hello,</p>
          <p>You have been added to the NPFurnish platform as a provider.</p>
          <p>
            Click the button below to set your password. This link is valid for <strong>15 minutes</strong>.
          </p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Set Your Password</a>
          </p>
          <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>If you did not expect this email, you can safely ignore it.</p>
          <br/>
          <p>– The NPFurnish Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    console.log("📨 Set-password email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending set-password email:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendSetPasswordEmail;
