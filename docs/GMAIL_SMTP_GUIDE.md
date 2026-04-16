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
Add the following to your `.env` file:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## ⚠️ Security Best Practices
- 🔒 **Use HTTPS**: Ensure `NEXT_PUBLIC_BASE_URL` starts with `https://` in production to protect reset links.
- ⏳ **Token Expiry**: Links expire in 15 minutes (configured in `store.tsx`).
- 🔁 **One-Time Use**: The application logic invalidates the token immediately after a successful reset.
- 🔐 **Secure Creds**: Never check your `.env` file into version control (Git).
- 🚫 **No Hardcoding**: Never put your Gmail App Password directly in the source code.

## ⚠️ Important Limitations
- **Limit**: ~500 recipients per day for free accounts.
- **Privacy**: The "From" address will always be your Gmail address.
- **Security**: Never share your App Password with anyone.
