'use server';

/**
 * @fileOverview Server actions for handling email-related logic using Gmail SMTP.
 * 
 * To use Gmail SMTP:
 * 1. Enable 2-Step Verification on your Google Account.
 * 2. Generate an "App Password" at https://myaccount.google.com/apppasswords
 * 3. Set SMTP_USER=your-email@gmail.com and SMTP_PASS=your-app-password in your .env
 */

interface SendResetEmailProps {
  email: string;
  token: string;
  businessName: string;
}

/**
 * Sends a password reset email via Gmail SMTP.
 * Note: In a production environment, ensure SMTP environment variables are configured.
 */
export async function sendPasswordResetEmail({ email, token, businessName }: SendResetEmailProps) {
  // Use require inside the server action to ensure it only loads in the Node.js runtime
  // and doesn't cause bundling issues with the Next.js client-side analysis.
  const nodemailer = require('nodemailer');

  // Using the 'service' shorthand specifically for Gmail as requested
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // Your Gmail address
      pass: process.env.SMTP_PASS, // Your 16-character App Password
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${businessName} Admin" <${process.env.SMTP_USER || 'noreply@gmail.com'}>`,
    to: email,
    subject: `Password Reset Request - ${businessName}`,
    text: `Hello, you requested a password reset for your ${businessName} account. Please use this link to set a new password: ${resetLink}. This link will expire in 15 minutes.`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 12px; color: #1a1a1a;">
        <h2 style="color: #1a4699; margin-bottom: 24px;">Password Reset</h2>
        <p>Hello,</p>
        <p>A request was made to reset your administrative password for <strong>${businessName}</strong>.</p>
        <p>If you did not make this request, you can safely ignore this email.</p>
        <div style="margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #1a4699; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password Now</a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 32px;">
          This link will expire in 15 minutes.<br />
          If the button above doesn't work, copy and paste this link into your browser:<br />
          <span style="color: #1a4699; word-break: break-all;">${resetLink}</span>
        </p>
      </div>
    `,
  };

  try {
    // Prototype check: if credentials aren't set, log to console instead of throwing error
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('--- Prototype Email Log (No SMTP Configured) ---');
      console.log('To:', email);
      console.log('Reset Link:', resetLink);
      console.log('Instructions: Add SMTP_USER and SMTP_PASS (App Password) to .env to send real emails.');
      console.log('-----------------------------------------------');
      return { success: true, message: 'Recovery email simulated (check server logs).' };
    }

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Recovery email sent successfully.' };
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return { 
      success: false, 
      message: 'Failed to send email. Ensure you used an App Password and enabled 2FA.' 
    };
  }
}
