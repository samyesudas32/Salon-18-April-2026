'use server';

/**
 * @fileOverview Server actions for handling email-related logic using Gmail SMTP.
 * 
 * Security Best Practices:
 * - Uses environment variables for sensitive credentials.
 * - Reset links expire after 15 minutes.
 * - One-time use logic is handled in the application state/database.
 */

interface SendResetEmailProps {
  email: string;
  token: string;
  businessName: string;
}

/**
 * Sends a password reset email via Gmail SMTP.
 */
export async function sendPasswordResetEmail({ email, token, businessName }: SendResetEmailProps) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Use production URL in deployment, fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${businessName} Admin" <${process.env.SMTP_USER || 'noreply@gmail.com'}>`,
    to: email,
    subject: `Secure Password Reset - ${businessName}`,
    text: `Hello, you requested a password reset for your ${businessName} account. Use this link: ${resetLink}. Valid for 15 minutes.`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 12px; color: #1a1a1a;">
        <h2 style="color: #1a4699; margin-bottom: 24px;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>A request was made to reset your administrative password for <strong>${businessName}</strong>.</p>
        <p>If you did not make this request, you can safely ignore this email.</p>
        <div style="margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #1a4699; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password Now</a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 32px;">
          <strong>Security Notice:</strong> This link will expire in 15 minutes and can only be used once.<br />
          If the button above doesn't work, copy and paste this link into your browser:<br />
          <span style="color: #1a4699; word-break: break-all;">${resetLink}</span>
        </p>
      </div>
    `,
  };

  try {
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
      message: 'Failed to send email. Check your SMTP configuration or App Password.' 
    };
  }
}
