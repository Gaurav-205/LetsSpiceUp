# Debugging Email Timeout Issue

## Step 1: Check Render Logs

After deployment, check your Render logs and look for these lines:

### What to Look For:

1. **Email Service Configuration:**
   ```
   Email service configured
   Email host: smtp.sendgrid.net:587
   Email user: apikey
   ```

2. **When Sending Email:**
   ```
   Attempting to send password reset email to [email] via smtp.sendgrid.net
   ```

### Common Issues:

**Issue 1: Wrong Host**
- If you see `Email host: smtp.gmail.com` → You're still using Gmail
- **Fix:** Make sure `EMAIL_HOST=smtp.sendgrid.net` in Render environment variables

**Issue 2: Wrong Username**
- If `Email user:` shows your email address → Wrong!
- **Fix:** `EMAIL_USER` must be exactly `apikey` (all lowercase)

**Issue 3: SMTP Blocked**
- If you see timeout errors with `smtp.sendgrid.net` → Render is blocking SMTP
- **Solution:** Use SendGrid API instead of SMTP (see below)

## Step 2: Verify Environment Variables in Render

Go to Render Dashboard → Environment and check:

✅ `EMAIL_HOST` = `smtp.sendgrid.net`  
✅ `EMAIL_PORT` = `587`  
✅ `EMAIL_USER` = `apikey` (exactly this)  
✅ `EMAIL_PASS` = `SG.xxxxxxxxx...` (your SendGrid API key)  
✅ `EMAIL_FROM` = `gauravkhandelwal205@gmail.com`

## Step 3: Test SendGrid API Key

If SMTP continues to timeout, we'll switch to SendGrid API which bypasses SMTP entirely.

## Quick Fix: Use SendGrid API Instead of SMTP

If Render blocks SMTP, we can use SendGrid's REST API directly. This requires:
- Installing `@sendgrid/mail` package ✅ (already done)
- Updating email service to use API
- Changing environment variable: `EMAIL_PROVIDER=sendgrid-api`

Would you like me to implement the SendGrid API integration?

