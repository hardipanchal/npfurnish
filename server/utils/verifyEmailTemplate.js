export const verifyEmailTemplate = (name, verifyCode, redirectUrl = "#") => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; padding: 20px;">
        <div style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #4CAF50;">Hello, ${name}!</h1>
          <p style="font-size: 16px;">Your verification code is: <strong>${verifyCode}</strong></p>
          <p style="font-size: 16px;">Use this code to verify your email address in the app.</p>
          <p style="text-align: center;">
            <a href="${redirectUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Now</a>
          </p>
          <p style="font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
  `;
};
