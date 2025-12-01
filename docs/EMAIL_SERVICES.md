# Email Service Configuration for Production

## The Problem

Cloud hosting providers like Render, Heroku, and AWS often block direct SMTP connections (port 587/465) to prevent spam and abuse. This means Gmail's SMTP servers may not work in production environments.

## Recommended Solutions

### Option 1: SendGrid (Recommended) ⭐

**Free Tier:** 100 emails/day

1. **Sign up at** [SendGrid](https://sendgrid.com/)
2. **Create an API Key:**
   - Go to Settings → API Keys
   - Create a new API Key with "Mail Send" permissions
   - Copy the API key (you'll only see it once)

3. **Update Render Environment Variables:**
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key-here
   EMAIL_FROM=your-verified-email@domain.com
   ```

4. **Verify your sender email** in SendGrid dashboard

### Option 2: Mailgun

**Free Tier:** 5,000 emails/month

1. **Sign up at** [Mailgun](https://www.mailgun.com/)
2. **Get SMTP credentials:**
   - Go to Sending → Domain Settings → SMTP credentials
   - Create SMTP credentials

3. **Update Render Environment Variables:**
   ```
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=your-mailgun-username
   EMAIL_PASS=your-mailgun-password
   EMAIL_FROM=noreply@your-verified-domain.com
   ```

### Option 3: AWS SES

**Pay-as-you-go:** Very affordable

1. **Set up AWS SES**
2. **Verify your email/domain**
3. **Create SMTP credentials**

### Option 4: Keep Gmail (Not Recommended for Production)

If you want to keep using Gmail SMTP, you'll need:
- A VPS/server that allows SMTP connections
- Or use a proxy service

However, this is not recommended as Gmail has strict rate limits and may block your account.

## Quick Setup Example: SendGrid

1. Install SendGrid package (optional - not needed for SMTP):
   ```bash
   npm install @sendgrid/mail
   ```

2. Get your API key from SendGrid dashboard

3. Update environment variables in Render:
   - `EMAIL_HOST`: `smtp.sendgrid.net`
   - `EMAIL_PORT`: `587`
   - `EMAIL_USER`: `apikey`
   - `EMAIL_PASS`: `your-sendgrid-api-key`
   - `EMAIL_FROM`: `your-verified-email@yourdomain.com`

4. Redeploy your service

## Testing

After setting up, test the password reset feature. Emails should send successfully without timeout errors.

