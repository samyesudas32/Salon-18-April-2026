# 📧 Gmail (SMTP) for Password Recovery Guide

## 🔹 What is Gmail SMTP?
SMTP (Simple Mail Transfer Protocol) is a service used to send emails from your application. Using Gmail's SMTP server, your website can send password reset emails directly to users for free (within limits).

## 🔹 Why use Gmail SMTP?
- **Cost**: Free for up to 500 emails per day.
- **Reliability**: High delivery rates via Google's infrastructure.
- **Security**: Supports TLS encryption.

## 🔹 How to Set Up (Step-by-Step)

### 1. Enable 2-Step Verification
Google requires 2-Step Verification to be enabled on your account before you can use "App Passwords".
1. Go to your **Google Account Settings**.
2. Navigate to **Security**.
3. Enable **2-Step Verification**.

### 2. Generate an "App Password"
Google does **not** allow you to use your regular Gmail password in third-party apps like this website.
1. In your Google Security settings, search for **App Passwords**.
2. Select "Mail" and "Other (Custom Name)" (e.g., "My Salon Website").
3. Click **Generate**.
4. **IMPORTANT**: Copy the 16-character code. You will use this in your `.env` file.

### 3. Configure Your Environment
Add the following to your `.env` file (or Firebase environment config):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 🔹 Flow of Recovery
1. **Request**: User clicks "Forgot Password" and enters their email.
2. **Logic**: The server generates a unique token with a 15-minute expiry.
3. **Email**: The server uses `nodemailer` to connect to `smtp.gmail.com` and sends an HTML email.
4. **Reset**: User clicks the link, the token is validated, and they set a new password.

## ⚠️ Important Limitations
- **Limit**: ~500 recipients per day for free accounts.
- **Privacy**: The "From" address will always be your Gmail address.
- **Scale**: If you grow beyond 100+ daily resets, consider switching to **SendGrid** or **Postmark**.
