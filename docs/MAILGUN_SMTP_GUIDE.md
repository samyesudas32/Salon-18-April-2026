# 📧 Mailgun (SMTP) for Password Recovery Guide

## 🔹 What is Mailgun?
Mailgun is a powerful email API service designed for developers. It provides higher deliverability, better tracking, and much higher sending limits than a standard Gmail account, making it ideal for production applications.

## 🔹 Why use Mailgun instead of Gmail?
- **Higher Limits**: Send thousands of emails per day, not just 500.
- **Deliverability**: Less likely to be marked as spam.
- **Dedicated IPs**: Better sender reputation (on paid plans).
- **Analytics**: Track opens, clicks, and bounces.
- **Custom Domains**: Send emails from `noreply@yourdomain.com` instead of a personal Gmail address.

## 🔹 How to Set Up (Step-by-Step)

### 1. Sign Up for Mailgun
1.  Go to [Mailgun.com](https://www.mailgun.com/) and create an account.
2.  You may need to add a credit card for verification, but they have a free plan that's generous for development.

### 2. Add and Verify Your Domain
1.  In the Mailgun dashboard, go to **Sending -> Domains -> Add New Domain**.
2.  Enter a subdomain you want to use for sending emails (e.g., `mg.yourdomain.com`). Mailgun recommends using a subdomain.
3.  Follow the on-screen instructions to add DNS records (TXT, MX, CNAME) to your domain provider (e.g., GoDaddy, Namecheap, Cloudflare). This step is crucial for verifying your domain and ensuring deliverability.
4.  Wait for the DNS records to propagate and for Mailgun to verify your domain. This can take a few minutes to a few hours.

### 3. Get Your SMTP Credentials
1.  Once your domain is verified, navigate to **Sending -> Domain Settings**.
2.  Select your verified domain.
3.  Click on the **SMTP** tab.
4.  Here you will find your credentials. Note them down:
    *   **Login**: This is your SMTP username.
    *   **Password**: Click "Reset Password" or "Manage SMTP passwords" to generate a new password. **Copy this password immediately.**

### 4. Configure Your Environment
Add the following to your `.env` file, replacing the values with the ones you just copied from Mailgun:

```env
# Mailgun SMTP Credentials
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_PORT=587
MAILGUN_SMTP_USER="Your SMTP Login from Mailgun"
MAILGUN_SMTP_PASS="Your Generated SMTP Password from Mailgun"

# This should be an email address from your verified domain
MAILGUN_FROM_EMAIL="noreply@mg.yourdomain.com" 

# Your website's public URL for generating reset links
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```
*Note: The `MAILGUN_SMTP_HOST` might be `smtp.eu.mailgun.org` if your account is in the EU region.*

## ⚠️ Security Best Practices
- 🔒 **Use HTTPS**: Ensure `NEXT_PUBLIC_BASE_URL` starts with `https://` in production to protect reset links.
- ⏳ **Token Expiry**: Links expire in 15 minutes (configured in `store.tsx`).
- 🔁 **One-Time Use**: The application logic invalidates the token immediately after a successful reset.
- 🔐 **Secure Creds**: Never check your `.env` file into version control (Git).
- 🚫 **No Hardcoding**: Never put your Mailgun credentials directly in the source code.
