import { NextResponse } from 'next/server';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

export async function POST(request: Request) {
  const { to, token, adminId } = await request.json();

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
  });

  const domain = process.env.MAILGUN_DOMAIN;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  if (!domain || !fromEmail || !process.env.MAILGUN_API_KEY) {
    console.error('Mailgun environment variables are not set.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  const emailData = {
    from: `Salon of Guzellik Admin <${fromEmail}>`,
    to: [to],
    subject: 'Your Admin Recovery Information',
    html: `
      <h1>Account Recovery</h1>
      <p>A request was made to recover your administrator credentials.</p>
      <p>Your <strong>Admin User ID</strong> is: <strong>${adminId}</strong></p>
      <p>To reset your password, please click the link below. This link is valid for 15 minutes.</p>
      <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>If you did not request this, you can safely ignore this email.</p>
      <hr>
      <p><small>This is an automated message. Please do not reply.</small></p>
    `,
  };

  try {
    await mg.messages.create(domain, emailData);
    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Mailgun Error:', error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
