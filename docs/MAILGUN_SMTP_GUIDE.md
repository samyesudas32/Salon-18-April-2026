# Mailgun API Configuration Guide

This guide provides step-by-step instructions for setting up Mailgun to handle email sending for password recovery in your application. This setup uses the Mailgun API, which is more robust than SMTP.

## 1. Create a Mailgun Account

- Go to [Mailgun.com](https://www.mailgun.com/) and sign up for an account. The free "Flex" plan is sufficient for development and small applications.

## 2. Add and Verify Your Domain

For reliable email delivery, it is highly recommended to use a custom domain.

- From your Mailgun dashboard, navigate to **Sending > Domains**.
- Click **Add New Domain**.
- Enter a subdomain you control (e.g., `mg.yourdomain.com`). Using a subdomain is best practice.
- Follow the on-screen instructions to add the provided DNS records (TXT, MX, CNAME) to your domain's DNS provider (e.g., Google Domains, Cloudflare, GoDaddy).
- After adding the records, wait for DNS propagation and click the **Verify DNS Settings** button in Mailgun. This can take some time.

## 3. Get Your API Key and Domain Info

Once your domain is verified, you need three key pieces of information.

- **Private API Key**: Navigate to **Settings > API Keys**. Your Private API key will be visible here. Keep this key secure.
- **Domain Name**: This is the verified domain you just set up (e.g., `mg.yourdomain.com`).
- **Region**: Note whether your account is in the US or EU region. This will determine your API endpoint.

## 4. Configure Environment Variables

Create a `.env` file in the root of your project if it doesn't exist. Add the following variables, replacing the placeholder values with your actual Mailgun credentials.

```
# .env

# Mailgun API Key (for API communication)
# Found under Settings > API Keys > Private API key
MAILGUN_API_KEY="YOUR_PRIVATE_MAILGUN_API_KEY"

# Mailgun Domain
# This is the verified domain you set up in Mailgun (e.g., mg.yourdomain.com)
MAILGUN_DOMAIN="YOUR_MAILGUN_DOMAIN"

# From Email Address
# The email address that emails will be sent from (e.g., no-reply@your.domain.com)
MAILGUN_FROM_EMAIL="YOUR_FROM_EMAIL_ADDRESS"

# Your App's Base URL (for generating reset links)
# IMPORTANT: Use your actual production URL when deployed
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**IMPORTANT:**
- Never commit your `.env` file to Git. Add it to your `.gitignore` file.
- For production, you **must** update `NEXT_PUBLIC_APP_URL` to your live application's URL.

Your application is now configured to send password recovery emails using the Mailgun API.
