# Production Deployment Guide

This guide covers deploying the Prank Wizard application to production with best practices.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables](#environment-variables)
3. [Security Configuration](#security-configuration)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
6. [Monitoring & Logging](#monitoring--logging)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

- [ ] All environment variables are set and validated
- [ ] Database is configured and accessible
- [ ] SSL/TLS certificates are configured
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Error tracking is set up (optional but recommended)
- [ ] Monitoring is configured
- [ ] Backup strategy is in place
- [ ] All tests pass
- [ ] Code is linted and formatted

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secure-secret-min-32-characters-long
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
PORT=5000

# Optional but recommended
SESSION_SECRET=your-session-secret-different-from-jwt
JWT_EXPIRES_IN=7d

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Email Service (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Additional allowed origins (comma-separated)
ALLOWED_ORIGINS=https://www.yourdomain.com,https://yourdomain.com
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Security Configuration

### 1. Generate Secure Secrets

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Session Secret
openssl rand -base64 32
```

### 2. Enable HTTPS

- Use a reverse proxy (Nginx, Caddy) with SSL certificates
- Or use a platform with built-in SSL (Vercel, Render, Railway)

### 3. Database Security

- Use MongoDB Atlas with IP whitelisting
- Enable authentication
- Use connection string with credentials
- Enable encryption at rest

### 4. CORS Configuration

Update `ALLOWED_ORIGINS` in backend `.env` with your production domains:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your server IP (or 0.0.0.0/0 for cloud platforms)
5. Get connection string and add to `MONGODB_URI`

### Local MongoDB (Not Recommended for Production)

Only use for development. For production, use MongoDB Atlas or a managed service.

## Deployment Options

### Option 1: Docker Deployment

1. Build and run with Docker Compose:

```bash
docker-compose up -d
```

2. Or build individual services:

```bash
# Backend
docker build -t prank-wizard-backend --target backend-prod .
docker run -p 5000:5000 --env-file backend/.env prank-wizard-backend

# Frontend
docker build -t prank-wizard-frontend --target frontend-prod .
docker run -p 3000:3000 --env-file frontend/.env.local prank-wizard-frontend
```

### Option 2: Platform Deployment

#### Vercel (Frontend)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Render (Backend)

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables

#### Railway

1. Create new project
2. Add services for frontend and backend
3. Configure environment variables
4. Deploy

### Option 3: VPS Deployment

1. Set up a VPS (DigitalOcean, AWS EC2, etc.)
2. Install Node.js, Nginx, and PM2
3. Clone repository
4. Configure environment variables
5. Build and start services
6. Configure Nginx as reverse proxy

Example PM2 configuration:

```json
{
  "apps": [
    {
      "name": "prank-wizard-backend",
      "script": "dist/index.js",
      "cwd": "/path/to/backend",
      "instances": 2,
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

## Monitoring & Logging

### Recommended Services

1. **Error Tracking**: Sentry, Rollbar, or LogRocket
2. **APM**: New Relic, Datadog, or AppSignal
3. **Uptime Monitoring**: UptimeRobot, Pingdom
4. **Log Aggregation**: Logtail, Papertrail, or CloudWatch

### Health Checks

The backend includes a health check endpoint:

```
GET /health
```

Use this for:
- Load balancer health checks
- Uptime monitoring
- Container orchestration

## Performance Optimization

### Backend

1. Enable compression (already configured)
2. Use connection pooling for MongoDB
3. Implement caching where appropriate
4. Use PM2 cluster mode for multi-core utilization

### Frontend

1. Enable Next.js Image Optimization (already configured)
2. Use CDN for static assets
3. Implement caching headers
4. Enable compression

### Database

1. Add indexes for frequently queried fields
2. Use connection pooling
3. Monitor slow queries
4. Implement read replicas for high traffic

## Troubleshooting

### Common Issues

#### Backend won't start

1. Check environment variables are set
2. Verify MongoDB connection
3. Check port is not in use
4. Review logs for errors

#### CORS errors

1. Verify `FRONTEND_URL` matches your frontend domain
2. Check `ALLOWED_ORIGINS` includes all necessary domains
3. Ensure credentials are enabled in CORS config

#### Database connection fails

1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas
3. Verify credentials are correct
4. Check network connectivity

#### Frontend can't connect to backend

1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is running and accessible
3. Verify CORS configuration
4. Check browser console for errors

### Logs

Check logs for detailed error information:

```bash
# Backend logs
cd backend
npm start  # Check console output

# Docker logs
docker-compose logs backend
docker-compose logs frontend

# PM2 logs
pm2 logs prank-wizard-backend
```

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-production.html)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

