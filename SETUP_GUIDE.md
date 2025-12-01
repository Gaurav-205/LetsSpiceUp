# Complete Setup Guide

Step-by-step instructions to set up and run the authentication template.

## Step 1: Install Dependencies

### Backend Dependencies

```bash
cd backend
npm install
```

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 2: Set Up MongoDB

You have two options:

### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB:**
   - Windows: MongoDB should start as a service automatically
   - Mac/Linux: `mongod` (or `brew services start mongodb-community` on Mac)

3. **Verify it's running:**
   - Default connection: `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose FREE tier)
4. Create a database user (Database Access → Add New User)
5. Whitelist your IP (Network Access → Add IP Address → Add Current IP Address)
6. Click "Connect" → "Connect your application"
7. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 3: Configure Backend Environment

### Option A: Automated Setup (Recommended)

```bash
cd backend
npm run setup:env
```

This will automatically:
- Create a `.env` file from `env.example`
- Generate a secure JWT_SECRET for you
- Guide you through the next steps

Then edit the `.env` file with your MongoDB URI and other values.

### Option B: Manual Setup

1. **Create `.env` file in `backend/` directory:**

```bash
cd backend
# Copy the example file
cp env.example .env
# On Windows: copy env.example .env
```

2. **Edit `backend/.env` with your values:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/auth-app
# OR for MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-app

# JWT Secret (generate a random string, at least 32 characters)
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# Google OAuth (Optional - see Step 4)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Optional - see Step 5)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@yourapp.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Minimum required for basic setup:**
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`

## Step 4: Set Up Google OAuth (Optional)

Google OAuth is optional but included in the template. Skip this if you don't need it.

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project:**
   - Click "Select a project" → "New Project"
   - Enter project name → "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: Your App Name
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue" through the steps
   - Application type: Web application
   - Name: Your App Name
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
   - Click "Create"

5. **Copy credentials:**
   - Copy the "Client ID" → paste in `GOOGLE_CLIENT_ID`
   - Copy the "Client Secret" → paste in `GOOGLE_CLIENT_SECRET`

## Step 5: Set Up Email Service (Optional)

Email is needed for password reset. Skip this if you don't need password reset functionality.

### Using Gmail:

1. **Enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter name: "Auth App"
   - Click "Generate"
   - Copy the 16-character password

3. **Add to `.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # The app password (remove spaces)
   ```

### Using Other Email Services:

For production, consider:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go)

Update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` accordingly.

## Step 6: Configure Frontend Environment

1. **Create `.env.local` file in `frontend/` directory:**

```bash
cd frontend
```

2. **Create `frontend/.env.local`:**

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth (optional - only if you configured Google OAuth in backend)
# Set this to any value (e.g., "enabled") to show the Google auth button
# Leave empty to hide the Google auth button
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## Step 7: Start the Application

### Terminal 1 - Start Backend:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:5000
📝 Environment: development
✅ MongoDB connected successfully
```

### Terminal 2 - Start Frontend:

```bash
cd frontend
npm run dev
```

You should see:
```
  ▲ Next.js 16.0.5
  - Local:        http://localhost:3000
```

## Step 8: Access the Application

1. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

2. **Test the flow:**
   - Visit http://localhost:3000 (Landing page)
   - Click "Get Started" or "Sign In"
   - Create an account or login
   - You'll be redirected to `/home` after successful authentication

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check your MongoDB connection string
- Verify username/password in Atlas connection string
- Ensure IP is whitelisted in MongoDB Atlas

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- Make sure MongoDB is running locally
- Check if MongoDB is on port 27017
- Try: `mongosh` to test connection

### Backend Won't Start

**Error: "Port 5000 already in use"**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` accordingly

**Error: "Cannot find module"**
- Run `npm install` again in backend directory
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Frontend Won't Start

**Error: "Port 3000 already in use"**
- Kill the process using port 3000
- Or change port: `npm run dev -- -p 3001`

**Error: "Cannot connect to API"**
- Verify backend is running on http://localhost:5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Email Not Sending

**Error: "Invalid login"**
- Use App Password, not regular Gmail password
- Ensure 2-Step Verification is enabled
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`

### Google OAuth Not Working

**Error: "redirect_uri_mismatch"**
- Verify redirect URI in Google Cloud Console matches exactly
- Should be: `http://localhost:5000/api/auth/google/callback`
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Quick Test Checklist

- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000 (landing page)
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Redirected to `/home` after login
- [ ] Can logout successfully
- [ ] (Optional) Google OAuth works
- [ ] (Optional) Password reset email received

## Next Steps

Once everything is working:

1. **Customize the landing page** (`frontend/app/page.tsx`)
2. **Customize the home page** (`frontend/app/home/page.tsx`)
3. **Add your features** to the home page
4. **Update branding** (app name, colors, etc.)
5. **Deploy to production** when ready

## Need Help?

- Check the [Authentication Setup Guide](docs/AUTH_SETUP.md) for detailed auth setup
- Review error messages in terminal/console
- Ensure all environment variables are set correctly
- Verify MongoDB is running and accessible

---

**You're all set! 🚀**

