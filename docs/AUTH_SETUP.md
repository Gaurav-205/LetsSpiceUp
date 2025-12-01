# Authentication Setup Guide

Complete configuration guide for authentication features including Google OAuth and email service.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Gmail account (for email service)
- Google Cloud Console account (for OAuth)

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Make sure it's running on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Replace `mongodb://localhost:27017/auth-app` with your Atlas connection string

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/auth-app
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Application type: Web application
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy the Client ID and Client Secret to your `.env` file

### 5. Set Up Gmail for Password Reset Emails

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to "App passwords" (under Security)
4. Generate an app password for "Mail"
5. Use this app password in `EMAIL_PASS` (not your regular Gmail password)

**Note:** For production, consider using a dedicated email service like SendGrid, Mailgun, or AWS SES.

### 6. Start Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth (optional - only if you configured Google OAuth in backend)
# Set this to any value (e.g., "enabled") to show the Google auth button
# Leave empty to hide the Google auth button
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

### 3. Start Frontend Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Testing the Authentication

### 1. Sign Up
- Navigate to `http://localhost:3000/signup`
- Fill in the form and create an account
- You'll be redirected to the dashboard

### 2. Login
- Navigate to `http://localhost:3000/login`
- Enter your credentials
- You'll be redirected to the dashboard

### 3. Forgot Password
- Click "Forgot your password?" on the login page
- Enter your email
- Check your email for the reset link
- Click the link to reset your password

### 4. Google OAuth
- Click "Sign in with Google" on login or signup page
- Authorize the application
- You'll be redirected back and logged in

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (requires authentication)
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": false
  },
  "token": "jwt-token-here"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt-token-here"
}
```

**Forgot Password:**
```json
POST /api/auth/forgot-password
{
  "email": "john@example.com"
}

Response:
{
  "message": "If an account exists, a password reset email has been sent"
}
```

**Reset Password:**
```json
POST /api/auth/reset-password
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}

Response:
{
  "message": "Password reset successful",
  "user": { ... },
  "token": "jwt-token-here"
}
```

## Security Considerations

1. **JWT Secret**: Use a strong, random secret in production (at least 32 characters)
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Update CORS settings for production frontend URL
4. **Email Service**: Use a dedicated email service in production
5. **Rate Limiting**: Consider adding rate limiting to prevent abuse
6. **Password Strength**: Enforce stronger password requirements if needed
7. **Token Expiry**: Adjust JWT expiry time based on your security needs

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access for MongoDB Atlas

### Email Not Sending
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled
- Ensure EMAIL_USER and EMAIL_PASS are correct
- Check spam folder

### Google OAuth Not Working
- Verify Client ID and Secret are correct
- Check redirect URI matches exactly
- Ensure Google+ API is enabled
- Check browser console for errors

### Frontend Can't Connect to Backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Ensure backend server is running
- Check browser console for errors

## Production Deployment

1. Update all environment variables for production
2. Use a production database (MongoDB Atlas recommended)
3. Set up a production email service
4. Update Google OAuth redirect URIs
5. Use HTTPS for both frontend and backend
6. Set secure cookie options
7. Enable rate limiting
8. Set up monitoring and logging

