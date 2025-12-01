# 🎭 Prank Wizard

A full-stack web application for planning and managing personalized pranks. Built with Next.js and Express.js, featuring a modern UI, secure authentication, and a comprehensive prank planning wizard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-4-green?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=flat&logo=mongodb)

## ✨ Features

### 🎯 Core Features
- **Prank Planning Wizard** - Multi-step form to create personalized prank plans
- **Prank Management** - View, manage, and track all your prank submissions
- **User Dashboard** - Personalized home page with quick access to features
- **Profile Management** - View and manage your account information

### 🔐 Authentication & Security
- ✅ User Registration with email validation
- ✅ Secure Login with JWT tokens
- ✅ Password Reset via email
- ✅ Google OAuth integration
- ✅ Protected routes and API endpoints
- ✅ Password strength indicator
- ✅ Session management
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Security headers (Helmet)

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS v4
- Dark theme with glassmorphism effects
- Smooth animations and transitions
- Mobile-first responsive layout
- Accessible components
- Toast notifications
- Loading states and error handling

### 🚀 Production Ready
- TypeScript for type safety
- Error boundaries and error handling
- Structured logging
- Environment variable validation
- Docker support
- CI/CD ready
- SEO optimized (sitemap, robots.txt)
- Performance optimizations

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Animations**: GSAP, Three.js (Ballpit component)

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Security**: Helmet, CORS, bcrypt, express-rate-limit
- **Email**: Nodemailer, SendGrid support
- **Session**: express-session with MongoDB store

### DevOps & Deployment
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions ready

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
MONGODB_URI=mongodb://localhost:27017/prank-wizard
# Or for MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/prank-wizard
JWT_SECRET=your-secret-key-min-32-characters  # Generate: openssl rand -base64 32
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-session-secret  # Generate: openssl rand -base64 32
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
│   │   ├── page.tsx          # Landing page
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── home/             # Protected dashboard
│   │   ├── profile/          # User profile
│   │   ├── prank-wizard/     # Prank planning wizard
│   │   ├── pranks/           # Prank management pages
│   │   └── auth/             # OAuth callback
│   ├── components/           # Reusable React components
│   │   ├── ui/               # UI components (Button, Input, etc.)
│   │   ├── PrankWizard/      # Wizard-specific components
│   │   └── Navbar.tsx        # Navigation component
│   ├── contexts/             # React contexts (AuthContext)
│   ├── lib/                  # Utilities & API clients
│   └── types/                # TypeScript type definitions
│
├── backend/                  # Express.js backend API
│   └── src/
│       ├── models/           # Mongoose models (User, Prank)
│       ├── routes/           # API routes (auth, pranks)
│       ├── services/         # Business logic services
│       ├── middleware/       # Express middleware
│       │   ├── auth.ts       # Authentication middleware
│       │   ├── errorHandler.ts
│       │   ├── rateLimiter.ts
│       │   └── sanitize.ts
│       ├── config/           # Configuration (database, passport)
│       ├── validators/       # Input validation
│       └── types/            # TypeScript types
│
├── netlify.toml              # Netlify deployment config
├── render.yaml               # Render deployment config
├── docker-compose.yml        # Docker Compose configuration
└── Dockerfile                # Multi-stage Docker build
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

### Health
- `GET /health` - Health check endpoint

## 🎯 Application Flow

1. **Landing Page** (`/`) → Marketing page with hero section
2. **Sign Up** (`/signup`) → Create new account
3. **Login** (`/login`) → Authenticate user
4. **Home** (`/home`) → Protected dashboard
5. **Prank Wizard** (`/prank-wizard`) → Multi-step prank planning form
6. **My Pranks** (`/pranks`) → View all prank submissions
7. **Prank Details** (`/pranks/:id`) → View detailed prank information
8. **Profile** (`/profile`) → User profile and settings

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
3. Configure environment variables
4. Set up MongoDB Atlas
5. Update CORS settings

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
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm test             # Run tests
npm run type-check   # TypeScript type checking
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm test             # Run tests
npm run type-check   # TypeScript type checking
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input sanitization
- CORS configuration
- Security headers (Helmet)
- XSS protection
- CSRF protection
- SQL injection prevention
- Environment variable validation

## 📊 Performance Optimizations

- Next.js Image Optimization
- Code splitting
- Lazy loading
- Compression middleware
- MongoDB connection pooling
- Caching strategies
- CDN-ready static assets

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
