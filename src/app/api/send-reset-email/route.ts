import { NextResponse } from 'next/server';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

export async function POST(request: Request) {
  try {
    const { to, token, adminId } = await request.json();

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const fromEmail = process.env.MAILGUN_FROM_EMAIL;
    const region = process.env.MAILGUN_REGION?.toLowerCase() === 'eu' ? 'eu' : 'us';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    if (!apiKey || !domain || !fromEmail) {
      console.error('Mailgun Error: Missing environment variables. Please check MAILGUN_API_KEY, MAILGUN_DOMAIN, and MAILGUN_FROM_EMAIL in your .env file.');
      return NextResponse.json({ 
        error: 'Email service is not configured.', 
        details: 'Server environment variables are missing.' 
      }, { status: 500 });
    }

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: apiKey,
      url: region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net',
    });
    
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    const emailData = {
      from: `Salon of Guzellik Admin <${fromEmail}>`,
      to: [to],
      subject: 'Your Admin Recovery Information',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Account Recovery</h1>
          <p>A request was made to recover your administrator credentials for <strong>Salon of Guzellik</strong>.</p>
          <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            Your <strong>Admin User ID</strong> is: <code style="font-size: 1.2em; color: #1e40af;">${adminId}</code>
          </p>
          <p>To reset your password, please click the secure link below. This link is valid for 15 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password Now</a>
          </div>
          <p style="color: #6b7280; font-size: 0.9em;">If you did not request this, you can safely ignore this email. No changes have been made to your account yet.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; color: #9ca3af; font-size: 0.8em;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    };

    const response = await mg.messages.create(domain, emailData);
    console.log('Mailgun Success:', response);
    
    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Mailgun API Route Error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email.', 
      details: error.message || 'Unknown Mailgun error' 
    }, { status: 500 });
  }
}
