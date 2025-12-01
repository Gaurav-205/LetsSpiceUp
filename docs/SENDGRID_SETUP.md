# SendGrid Email Service Setup Guide

## Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Click "Start for free" or "Sign Up"
3. Complete the signup process

## Step 2: Verify Your Sender Email

1. In SendGrid Dashboard, go to **Settings → Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Email Address**: `gauravkhandelwal205@gmail.com`
   - **From Name**: Your name or app name
   - **Reply To**: Same email or leave blank
   - **Company Address**: Your address (required)
   - **City**: Your city
   - **State**: Your state
   - **Country**: Your country
   - **ZIP Code**: Your ZIP code
4. Check your email inbox and click the verification link

## Step 3: Create API Key

1. In SendGrid Dashboard, go to **Settings → API Keys**
2. Click **"Create API Key"** button
3. Enter a name (e.g., "Render Backend" or "Production")
4. Select permissions:
   - **Full Access** (recommended for simplicity), OR
   - **Restricted Access** → Check only **"Mail Send"** permission
5. Click **"Create & View"**
6. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!
   - Example format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 4: Update Render Environment Variables

1. Go to your Render Dashboard
2. Select your backend service ("LoginSignup")
3. Go to **Environment** section
4. Update or add these environment variables:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.your-actual-api-key-here
EMAIL_FROM=gauravkhandelwal205@gmail.com
```

**Important Notes:**
- `EMAIL_USER` must be exactly `apikey` (all lowercase, no quotes)
- `EMAIL_PASS` should be your SendGrid API key (the one you copied)
- `EMAIL_FROM` must be the email you verified in Step 2

## Step 5: Redeploy

1. After updating environment variables, Render will automatically redeploy
2. Or manually trigger a redeploy from the Render dashboard

## Step 6: Test

1. Go to your frontend: `https://loginsignuptemp.netlify.app/forgot-password`
2. Enter your email address
3. Click "Send reset link"
4. Check your email inbox for the password reset email

## Troubleshooting

### Email not sending?
- Verify the email is verified in SendGrid dashboard
- Check that `EMAIL_USER` is exactly `apikey` (not your email)
- Ensure API key has "Mail Send" permission
- Check Render logs for error messages

### Still getting timeouts?
- SendGrid SMTP should work on Render
- If issues persist, check SendGrid dashboard for sending statistics
- Verify API key is correct (you may need to create a new one)

### Free Tier Limits
- SendGrid free tier: 100 emails/day
- Perfect for development and small apps
- Upgrade when you need more

## Security Best Practices

- Never commit API keys to git
- Use environment variables (as we're doing)
- Rotate API keys periodically
- Use restricted access API keys when possible

