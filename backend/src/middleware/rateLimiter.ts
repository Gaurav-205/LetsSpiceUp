import rateLimit from 'express-rate-limit';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Rate limiter for authentication endpoints
 * Prevents brute force attacks
 * More lenient in development, strict in production
 */
export const authLimiter = rateLimit({
  windowMs: isDevelopment ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 min in dev, 15 min in prod
  max: isDevelopment ? 100 : 5, // 100 requests in dev (very lenient for testing), 5 in prod
  message: {
    error: {
      message: 'Too many authentication attempts. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  // In development, skip counting successful requests (only count failures)
  skipSuccessfulRequests: isDevelopment,
  // Skip rate limiting if disabled (for testing)
  skip: (req) => {
    // Allow bypass in development with a special header (for testing)
    return isDevelopment && req.headers['x-bypass-rate-limit'] === 'true';
  },
});

/**
 * Rate limiter for password reset endpoints
 * More lenient in development, strict in production
 */
export const passwordResetLimiter = rateLimit({
  windowMs: isDevelopment ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5 min in dev, 1 hour in prod
  max: isDevelopment ? 10 : 3, // 10 requests in dev, 3 in prod
  message: {
    error: {
      message: 'Too many password reset attempts. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for prank submission endpoints
 * Prevents spam submissions
 */
export const prankSubmissionLimiter = rateLimit({
  windowMs: isDevelopment ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 min in dev, 15 min in prod
  max: isDevelopment ? 20 : 5, // 20 requests in dev, 5 in prod
  message: {
    error: {
      message: 'Too many prank submissions. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

