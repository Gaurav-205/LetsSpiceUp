# How to Find Your SendGrid API Key

## Option 1: Through Twilio Console (If Integrated)

1. **In Twilio Console**, look for **"Email"** in the left sidebar
2. Click on **"Email"** or **"SendGrid"**
3. Navigate to **Settings → API Keys**
4. Click **"Create API Key"** or use an existing one
5. Copy the API key (format: `SG.xxxxxxxxxxxxx...`)

## Option 2: Direct SendGrid Dashboard (Recommended)

1. Go to **https://app.sendgrid.com/**
2. **Log in** with your Twilio account credentials (if prompted)
   - Or use your SendGrid credentials if you created a separate account

3. In the SendGrid dashboard:
   - Look for **Settings** (gear icon) in the left sidebar
   - Click **Settings → API Keys**

4. **Create a new API Key:**
   - Click **"Create API Key"** button
   - Name it (e.g., "Render Backend")
   - Select permission: **"Full Access"** OR **"Restricted Access"** → **"Mail Send"**
   - Click **"Create & View"**
   - **IMPORTANT**: Copy the API key immediately - it starts with `SG.` and you won't see it again!

## What the API Key Looks Like

- Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Length: ~70 characters
- Starts with `SG.`

## ⚠️ Important Notes

- **The Account SID and Auth Token** shown in Twilio Console are **NOT** the SendGrid API key
- You need to create a **SendGrid API Key** specifically for email sending
- The API key is different from Twilio Account credentials
- Once you create/copy the API key, paste it into Render's `EMAIL_PASS` environment variable

## Still Can't Find It?

If SendGrid isn't linked to your Twilio account yet:
1. Go to **https://sendgrid.com/**
2. Sign up for a free SendGrid account
3. Verify your email address
4. Create an API key as described above

