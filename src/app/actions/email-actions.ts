'use server';

/**
 * @fileOverview Server actions for handling email-related logic using SMTP.
 */

interface SendResetEmailProps {
  email: string;
  token: string;
  businessName: string;
}

/**
 * Sends a password reset email via SMTP.
 * Note: In a production environment, ensure SMTP environment variables are configured.
 */
export async function sendPasswordResetEmail({ email, token, businessName }: SendResetEmailProps) {
  // Use require inside the server action to ensure it only loads in the Node.js runtime
  // and doesn't cause bundling issues with the Next.js client-side analysis.
  const nodemailer = require('nodemailer');

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'noreply@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${businessName} Admin" <${smtpConfig.auth.user}>`,
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
    // In a prototype environment where SMTP might not be configured,
    // we log the success to console to aid debugging.
    if (process.env.NODE_ENV === 'development' && smtpConfig.host === 'smtp.example.com') {
      console.log('--- Prototype Email Sent ---');
      console.log('To:', email);
      console.log('Reset Link:', resetLink);
      console.log('----------------------------');
      return { success: true, message: 'Recovery email simulated (check server logs).' };
    }

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Recovery email sent successfully.' };
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return { 
      success: false, 
      message: 'Failed to send email. Ensure SMTP settings are configured in .env' 
    };
  }
}
