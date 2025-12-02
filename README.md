# 🎭 Prank Wizard

A full-stack web application for planning and managing personalized pranks. Built with Next.js and Express.js, featuring a modern UI, secure authentication, comprehensive prank planning wizard, and admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-4-green?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=flat&logo=mongodb)

## ✨ Features

### 🎯 Core Features
- **Prank Planning Wizard** - Multi-step form to create personalized prank plans with comprehensive target information
- **Prank Management** - View, manage, and track all your prank submissions
- **User Dashboard** - Personalized home page with quick access to features
- **Profile Management** - View and manage your account information
- **Admin Dashboard** - Comprehensive admin panel for managing users and pranks
  - User management (view, delete users)
  - Prank management (view details, delete pranks)
  - Statistics dashboard (user counts, prank counts, recent activity)
  - Pagination support for large datasets

### 📝 Prank Form Features
- **Planner Information**: Name, phone, email
- **Target Information**: 
  - Name, age, phone (required), email
  - Relationship, gender, location
  - Personality types (multi-select)
- **Prank Details**: Type selection, additional information
- **Form Persistence**: Auto-saves progress to local storage
- **Validation**: Real-time form validation with error messages

### 🔐 Authentication & Security
- ✅ User Registration with email validation
- ✅ Secure Login with JWT tokens
- ✅ Password Reset via email
- ✅ Google OAuth integration
- ✅ Protected routes and API endpoints
- ✅ Admin role-based access control
- ✅ Password strength indicator
- ✅ Session management with MongoDB store
- ✅ Rate limiting on API endpoints
- ✅ Input sanitization and validation
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Environment variable validation

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS v4
- Dark theme with glassmorphism effects
- Smooth animations and transitions (GSAP)
- Interactive 3D background (Three.js Ballpit component)
- Mobile-first responsive layout
- **Mobile Optimizations**:
  - Prevents unwanted zoom on input focus
  - Minimum 16px font size for inputs
  - Touch-friendly interface
- Accessible components (ARIA labels, keyboard navigation)
- Toast notifications for user feedback
- Loading states and error handling
- Error boundaries for graceful error handling
- Custom favicon with brand logo

### 🚀 Production Ready
- TypeScript for type safety
- Error boundaries and centralized error handling
- Structured logging
- Environment variable validation
- Docker support with multi-stage builds
- CI/CD with GitHub Actions
- SEO optimized (sitemap, robots.txt, metadata, structured data)
- Performance optimizations (code splitting, lazy loading, image optimization)
- Health check endpoints for monitoring
- Keep-alive workflow for free tier hosting

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Animations**: GSAP, Three.js (Ballpit component)
- **Form Management**: Local storage persistence

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Security**: Helmet, CORS, bcrypt, express-rate-limit
- **Email**: Nodemailer, SendGrid support
- **Session**: express-session with MongoDB store (connect-mongo)
- **Validation**: Custom validators with express-validator patterns

### DevOps & Deployment
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
  - Automated linting (ESLint)
  - Type checking
  - Build verification
  - Security audits
  - Keep-alive workflow for backend

## 🚀 Quick Start

### Prerequisites
- Node.js 20.9.0 or higher
- npm 9.0.0 or higher
- MongoDB (local or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd BaseProject_Nextjs_LoginSignup-main
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend** - Create `backend/.env`:

**Option 1 - Automated setup (Recommended):**
```bash
cd backend
npm run setup:env
# Then edit the created .env file with your values
```

**Option 2 - Manual setup:**
```bash
cd backend
cp env.example .env  # On Windows: copy env.example .env
```

**Required Backend Variables:**
```env
# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/prank-wizard
# Or for MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/prank-wizard

# JWT & Session (REQUIRED)
JWT_SECRET=your-secret-key-min-32-characters  # Generate: openssl rand -base64 32
SESSION_SECRET=your-session-secret-min-32-characters  # Generate: openssl rand -base64 32

# Frontend URL (REQUIRED)
FRONTEND_URL=http://localhost:3000

# Server Configuration (OPTIONAL)
PORT=5000
NODE_ENV=development
JWT_EXPIRES_IN=7d

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (OPTIONAL - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# SendGrid (OPTIONAL - alternative to SMTP)
SENDGRID_API_KEY=your-sendgrid-api-key

# Admin Configuration (OPTIONAL)
# Comma-separated list of admin emails
# Defaults to: gauravkhandelwal205@gmail.com,ananykoranne0@gmail.com
ADMIN_EMAILS=gauravkhandelwal205@gmail.com,ananykoranne0@gmail.com
```

**Frontend** - Create `frontend/.env.local`:
```env
# API Configuration (REQUIRED)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Site URL (REQUIRED)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Discord Invite Link (OPTIONAL - for success page)
NEXT_PUBLIC_DISCORD_INVITE_LINK=https://discord.gg/your-invite-link
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit **http://localhost:3000** to see the application.

## 📁 Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Landing page with Ballpit animation
│   │   ├── layout.tsx        # Root layout with metadata & fonts
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── home/             # Protected dashboard
│   │   ├── profile/          # User profile
│   │   ├── admin/            # Admin dashboard (protected)
│   │   ├── prank-wizard/     # Prank planning wizard
│   │   │   ├── page.tsx      # Multi-step form
│   │   │   └── success/      # Success page with Discord link
│   │   ├── pranks/           # Prank management pages
│   │   │   ├── page.tsx      # List all pranks
│   │   │   └── [id]/         # Individual prank details
│   │   ├── forgot-password/  # Password reset request
│   │   ├── reset-password/   # Password reset form
│   │   ├── auth/             # OAuth callback
│   │   ├── favicon.ico       # Brand favicon
│   │   ├── sitemap.ts        # Dynamic sitemap
│   │   └── robots.ts         # Robots.txt generator
│   ├── components/           # Reusable React components
│   │   ├── ui/               # UI components (Button, Input, etc.)
│   │   ├── PrankWizard/      # Wizard-specific components
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── MultiSelectPills.tsx
│   │   │   ├── RadioButtonGroup.tsx
│   │   │   └── Mascot.tsx
│   │   ├── Navbar.tsx        # Navigation component
│   │   ├── Ballpit.tsx       # Three.js interactive background
│   │   ├── ErrorBoundary.tsx # Error boundary component
│   │   ├── ToastProvider.tsx # Toast notification system
│   │   ├── ProtectedRoute.tsx # Route protection
│   │   └── AdminRoute.tsx    # Admin-only route protection
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── lib/                  # Utilities & API clients
│   │   ├── api-client.ts    # Base API client
│   │   ├── auth-api.ts      # Authentication API
│   │   ├── prank-api.ts     # Prank API
│   │   ├── admin-api.ts     # Admin API
│   │   ├── constants/        # Constants and defaults
│   │   │   ├── form.ts      # Form data structure
│   │   │   └── prank.ts     # Prank types and personalities
│   │   └── utils/            # Utility functions
│   └── types/                # TypeScript type definitions
│
├── backend/                  # Express.js backend API
│   └── src/
│       ├── index.ts          # Main entry point
│       ├── models/           # Mongoose models
│       │   ├── User.ts       # User model
│       │   └── Prank.ts      # Prank model
│       ├── routes/           # API routes
│       │   ├── index.ts     # Route aggregator
│       │   ├── auth.ts      # Authentication routes
│       │   ├── pranks.ts    # Prank routes
│       │   └── admin.ts     # Admin routes
│       ├── services/         # Business logic services
│       │   ├── authService.ts
│       │   ├── prankService.ts
│       │   ├── tokenService.ts
│       │   └── emailService.ts
│       ├── middleware/       # Express middleware
│       │   ├── auth.ts       # Authentication middleware
│       │   ├── admin.ts     # Admin authorization
│       │   ├── errorHandler.ts # Error handling
│       │   ├── rateLimiter.ts # Rate limiting
│       │   ├── sanitize.ts   # Input sanitization
│       │   ├── requestId.ts  # Request ID tracking
│       │   ├── monitoring.ts # Request monitoring
│       │   └── notFound.ts   # 404 handler
│       ├── config/           # Configuration
│       │   ├── index.ts     # Environment config
│       │   ├── database.ts  # MongoDB connection
│       │   └── passport.ts  # Passport.js setup
│       ├── validators/       # Input validation
│       │   ├── authValidator.ts
│       │   └── prankValidator.ts
│       ├── types/            # TypeScript types
│       │   ├── errors.ts
│       │   └── prank.ts
│       └── utils/            # Utilities
│           ├── logger.ts
│           └── env-validator.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI/CD pipeline
│       └── keep-alive.yml   # Backend keep-alive
├── docs/                    # Documentation
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile              # Multi-stage Docker build
├── netlify.toml            # Netlify deployment config
└── render.yaml             # Render deployment config
```

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed setup instructions
- **[Quick Deploy](QUICK_DEPLOY.md)** - Fast deployment checklist
- **[Deployment Guide](DEPLOYMENT_NETLIFY_RENDER.md)** - Complete Netlify + Render deployment
- **[Production Deployment](PRODUCTION_DEPLOYMENT.md)** - Production deployment best practices
- **[Project Structure](PROJECT_STRUCTURE.md)** - Detailed project organization
- **[Production Checklist](PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist

### Authentication Setup
- **[Auth Setup](docs/AUTH_SETUP.md)** - Authentication configuration
- **[Google OAuth](docs/SENDGRID_SETUP.md)** - Google OAuth setup
- **[Email Services](docs/EMAIL_SERVICES.md)** - Email configuration

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user

### Pranks
- `POST /api/pranks` - Create new prank plan (protected)
- `GET /api/pranks` - Get all user's pranks (protected)
- `GET /api/pranks/:id` - Get prank details (protected)

### Admin (Protected - Admin Only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/admin/users/:id` - Get user by ID
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/pranks` - Get all pranks (paginated)
- `GET /api/admin/pranks/:id` - Get prank by ID
- `DELETE /api/admin/pranks/:id` - Delete prank

### Health
- `GET /health` - Health check endpoint (always returns 200)

## 🎯 Application Flow

1. **Landing Page** (`/`) → Marketing page with hero section and interactive Ballpit background
2. **Sign Up** (`/signup`) → Create new account
3. **Login** (`/login`) → Authenticate user
4. **Home** (`/home`) → Protected dashboard
5. **Prank Wizard** (`/prank-wizard`) → Multi-step prank planning form
   - Step 1: Your Information
   - Step 2: Target's Information (name, age, phone, email, relationship, gender, location)
   - Step 3: Personality & Prank Type
   - Step 4: Additional Details
6. **Success Page** (`/prank-wizard/success`) → Confirmation with Discord invite link
7. **My Pranks** (`/pranks`) → View all prank submissions
8. **Prank Details** (`/pranks/:id`) → View detailed prank information
9. **Profile** (`/profile`) → User profile and settings
10. **Admin Dashboard** (`/admin`) → Admin-only management panel

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

```bash
# Backend only
docker build -t prank-wizard-backend --target backend-prod .
docker run -p 5000:5000 --env-file backend/.env prank-wizard-backend

# Frontend only
docker build -t prank-wizard-frontend --target frontend-prod .
docker run -p 3000:3000 --env-file frontend/.env.local prank-wizard-frontend
```

## ☁️ Cloud Deployment

### Netlify (Frontend) + Render (Backend)

See **[DEPLOYMENT_NETLIFY_RENDER.md](DEPLOYMENT_NETLIFY_RENDER.md)** for complete instructions.

**Quick Steps:**
1. Deploy backend to Render (see `render.yaml`)
2. Deploy frontend to Netlify (see `netlify.toml`)
3. Configure environment variables in both platforms
4. Set up MongoDB Atlas
5. Update CORS settings in backend
6. Configure GitHub Actions secrets for keep-alive workflow

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm test --workspaces
```

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm test             # Run tests
npm run type-check   # TypeScript type checking
npm run setup:env    # Generate .env file from template
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm test             # Run tests
npm run type-check   # TypeScript type checking
```

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcrypt (10 rounds)
- Rate limiting on API endpoints (prevents brute force)
- Input sanitization (XSS prevention)
- CORS configuration (production-ready)
- Security headers (Helmet)
- XSS protection
- CSRF protection via SameSite cookies
- SQL injection prevention (NoSQL injection protection)
- Environment variable validation
- Admin role-based access control
- Request ID tracking for debugging
- Error message sanitization in production

## 📊 Performance Optimizations

- Next.js Image Optimization
- Code splitting and lazy loading
- Font optimization (reduced weights, preload critical fonts)
- Compression middleware
- MongoDB connection pooling
- Caching strategies
- CDN-ready static assets
- Deferred loading of non-critical components (Ballpit)
- Webpack optimizations
- Package import optimizations (axios, three, gsap)
- Production source maps disabled for smaller bundles

## 🚀 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

### Automated Checks
- **Linting**: ESLint for both frontend and backend
- **Type Checking**: TypeScript compilation checks
- **Build Verification**: Ensures production builds succeed
- **Security Audit**: npm audit for dependency vulnerabilities

### Workflows
- **CI Pipeline** (`.github/workflows/ci.yml`): Runs on push/PR to main/develop
- **Keep-Alive** (`.github/workflows/keep-alive.yml`): Pings backend every 14 minutes to prevent free tier spin-down

### Environment Variables in CI
- Backend build requires: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `SESSION_SECRET`, `ADMIN_EMAILS`
- Frontend build requires: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_DISCORD_INVITE_LINK`

## 🎨 Recent Improvements

### Mobile Experience
- Fixed unwanted zoom on input focus
- Enforced minimum 16px font size for all inputs
- Disabled user scaling in viewport meta tag
- Touch-friendly interface

### Admin Features
- Admin dashboard with statistics
- User management (view, delete)
- Prank management (view details, delete)
- Pagination for large datasets
- Modal for detailed prank information

### UI/UX Enhancements
- Brand favicon in browser tab
- Discord invite link on success page
- Form data persistence in local storage
- Enhanced error messages
- Improved loading states

### Performance
- Optimized font loading
- Reduced bundle sizes
- Improved Lighthouse scores
- Better code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- All open-source contributors

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Express.js, and TypeScript**
