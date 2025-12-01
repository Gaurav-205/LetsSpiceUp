# Full-Stack Authentication Template

A production-ready authentication template with Next.js frontend and Express backend. Perfect starting point for your next project.

## ✨ Features

### Authentication
- ✅ User Registration with validation
- ✅ User Login with JWT tokens
- ✅ Password Reset via email
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ Password strength indicator
- ✅ Show/hide password toggle
- ✅ Toast notifications

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Express.js, TypeScript, MongoDB (Mongoose)
- **Auth**: JWT, bcrypt, Passport.js (Google OAuth)
- **Email**: Nodemailer (optional)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** - Setup environment variables:

**Option 1 - Automated setup (Recommended):**
```bash
cd backend
npm run setup:env
# Then edit the created .env file with your values
```

**Option 2 - Manual setup:**
Create `backend/.env` file from `backend/env.example`:
```bash
cd backend
cp env.example .env  # On Windows: copy env.example .env
# Then edit .env with your values
```

**Required environment variables:**
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-min-32-characters  # Generate: openssl rand -base64 32
FRONTEND_URL=http://localhost:3000
PORT=5000
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
├── frontend/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   ├── home/         # Protected home
│   │   ├── profile/      # User profile
│   │   └── auth/         # OAuth callback
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utilities & API
│   └── types/            # TypeScript types
│
└── backend/
    └── src/
        ├── models/       # Database models
        ├── routes/       # API routes
        ├── services/     # Business logic
        ├── middleware/   # Express middleware
        ├── config/       # Configuration
        └── validators/   # Input validation
```

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions
- **[Auth Setup](docs/AUTH_SETUP.md)** - Authentication configuration

## 🔐 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/google` - Google OAuth

## 🎯 Application Flow

1. **Landing Page** (`/`) → Marketing/hero page
2. **Login/Signup** (`/login`, `/signup`) → Authentication
3. **Home** (`/home`) → Protected dashboard
4. **Profile** (`/profile`) → User settings

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.
