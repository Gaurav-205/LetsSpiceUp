import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import helmet from 'helmet';
import { config } from './config';
import { connectDatabase } from './config/database';
import { validateEnv } from './utils/env-validator';
import './config/passport';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestId } from './middleware/requestId';
import { sanitizeBody } from './middleware/sanitize';
import { monitoring } from './middleware/monitoring';
import { logger } from './utils/logger';

// Validate environment variables on startup
try {
  validateEnv();
  logger.info('Environment variables validated');
} catch (error) {
  logger.error('Environment validation failed', error);
  process.exit(1);
}

const app: Express = express();

// Trust proxy - Required when running behind a reverse proxy (Render, Heroku, etc.)
// This enables Express to correctly identify the client's IP address
app.set('trust proxy', 1);

// Connect to database (required for authentication)
connectDatabase().catch((error) => {
  logger.error('Failed to connect to database', error);
  process.exit(1);
});

// Request ID middleware (must be early to track all requests)
app.use(requestId);

// Request monitoring (track performance and errors)
app.use(monitoring);

// Global input sanitization (applied to all routes)
app.use(sanitizeBody);

// Security middleware with production-ready configuration
app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", config.frontend.url],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  frameguard: { action: "deny" },
}));

// CORS middleware
const allowedOrigins = [
  config.frontend.url,
  // Add additional allowed origins for production if needed
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [])
].filter(Boolean); // Remove any empty strings

// Separate CORS config for health checks (allows all origins)
const healthCheckCors = cors({
  origin: true, // Allow all origins for health checks
  credentials: false,
});

// Main CORS middleware for API routes
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin only in development
    if (!origin) {
      if (config.nodeEnv === 'development') {
        // In development, allow for testing with Postman, curl, etc.
        return callback(null, true);
      }
      // In production, reject requests without origin (except health checks which use separate CORS)
      logger.warn('CORS: Blocked request without origin in production');
      return callback(new Error('Not allowed by CORS'));
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS: Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  maxAge: config.nodeEnv === 'production' ? 86400 : 0, // 24 hours in production, no cache in dev
}));

// Body parsing middleware with size limits
// Reduced limits for production security
const bodySizeLimit = config.nodeEnv === 'production' ? '1mb' : '10mb';
app.use(express.json({ 
  limit: bodySizeLimit,
  strict: true, // Only parse arrays and objects
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: bodySizeLimit,
  parameterLimit: 50, // Limit number of parameters
}));

// Session middleware for Passport
// Use MongoDB session store in production, MemoryStore in development
const sessionConfig: session.SessionOptions = {
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    },
};

// Use MongoDB session store in production
if (config.nodeEnv === 'production') {
  sessionConfig.store = MongoStore.create({
    mongoUrl: config.database.uri,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 24 hours
    autoRemove: 'native',
  });
  logger.info('Using MongoDB session store');
} else {
  logger.debug('Using MemoryStore for sessions (development only)');
}

app.use(session(sessionConfig));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check routes (placed early to avoid middleware issues)
// These should always return 200 if the server is running, even if DB is down
// Uses the healthCheckCors defined above to allow all origins

// Health check GET endpoint
app.get('/health', healthCheckCors, (_req, res) => {
  try {
    let dbStatus = 'unknown';
    try {
      // Safely check mongoose connection state
      if (mongoose.connection && typeof mongoose.connection.readyState === 'number') {
        const readyState = mongoose.connection.readyState;
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        dbStatus = readyState === 1 ? 'connected' : 
                   readyState === 2 ? 'connecting' : 
                   readyState === 3 ? 'disconnecting' : 'disconnected';
      } else {
        dbStatus = 'not_initialized';
      }
    } catch (dbError) {
      // If checking DB status fails, mark as error but don't fail the health check
      dbStatus = 'error';
      logger.debug('Health check: Database status check failed', dbError);
    }

    const health = {
      status: 'ok', // Always return 'ok' if server is running
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };

    // Always return 200 - the server is running
    // Database status is informational only
    res.status(200).json(health);
  } catch (error) {
    // Even if something unexpected happens, return 200 with error status
    // This ensures the server is considered "up" for load balancers
    logger.error('Health check error:', error);
    res.status(200).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'unknown',
      error: 'Health check failed',
    });
  }
});

// Health check HEAD endpoint (for load balancers and monitoring)
// Always returns 200 if server is running (database status doesn't affect this)
app.head('/health', healthCheckCors, (_req, res) => {
  try {
    // Always return 200 for HEAD requests - server is up
    res.status(200).end();
  } catch (error) {
    // Even on error, return 200 to indicate server is running
    logger.error('Health check HEAD error:', error);
    res.status(200).end();
  }
});

// Basic route
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Welcome to Express API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Google OAuth routes (only if configured)
if (config.google.clientId && config.google.clientSecret) {
  app.get(
    '/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${config.frontend.url}/login?error=google_auth_failed` }),
    async (req: express.Request, res: express.Response) => {
      try {
        // The user data is returned from the Passport strategy
        const authResult = req.user as { user?: { id: string }; token?: string } | undefined;
        if (authResult?.token) {
          const frontendUrl = config.frontend.url;
          res.redirect(`${frontendUrl}/auth/callback?token=${authResult.token}`);
        } else {
          res.redirect(`${config.frontend.url}/login?error=google_auth_failed`);
        }
      } catch (error) {
        res.redirect(`${config.frontend.url}/login?error=google_auth_failed`);
      }
    }
  );
} else {
  // Placeholder routes if Google OAuth is not configured
  app.get('/api/auth/google', (_req, res) => {
    res.status(501).json({ error: { message: 'Google OAuth is not configured' } });
  });
  app.get('/api/auth/google/callback', (_req, res) => {
    res.status(501).json({ error: { message: 'Google OAuth is not configured' } });
  });
}

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Frontend URL: ${config.frontend.url}`);
  
  // Log email service status (check matches emailService.ts logic)
  const hasEmailUser = config.email.user && config.email.user.trim() !== '';
  const hasEmailPass = config.email.pass && config.email.pass.trim() !== '';
  
  if (hasEmailUser && hasEmailPass) {
    logger.info('Email service: Configured ✓');
    logger.debug(`Email host: ${config.email.host}:${config.email.port}`);
    logger.debug(`Email from: ${config.email.from}`);
  } else {
    logger.warn('Email service: Not configured (password reset links will appear in console)');
    logger.warn('To enable email service, add EMAIL_USER and EMAIL_PASS to backend/.env file');
    if (process.env.NODE_ENV === 'development') {
      logger.info(`   EMAIL_USER from env: ${process.env.EMAIL_USER ? `"${process.env.EMAIL_USER}"` : 'NOT SET'}`);
      logger.info(`   EMAIL_PASS from env: ${process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET'}`);
      logger.info(`   config.email.user: ${config.email.user ? `"${config.email.user}"` : 'empty'}`);
      logger.info(`   config.email.pass: ${config.email.pass ? 'SET (hidden)' : 'empty'}`);
    }
  }
});

// Graceful shutdown handler for production
const gracefulShutdown = (signal: string): void => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    
    // Close database connection
    mongoose.connection.close().then(() => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    }).catch((error) => {
      logger.error('Error closing MongoDB connection:', error);
      process.exit(1);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in development, but log the error
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('unhandledRejection');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

export default app;
