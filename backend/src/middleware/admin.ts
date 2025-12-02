import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from '../types/errors';

// Admin emails - users with these emails can access admin routes
// MUST be set via ADMIN_EMAILS environment variable (comma-separated)
// In production, this MUST be configured via environment variables
const getAdminEmails = (): string[] => {
  if (process.env.ADMIN_EMAILS) {
    // Support comma-separated list from environment variable
    const emails = process.env.ADMIN_EMAILS.split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      });
    
    if (emails.length === 0) {
      throw new Error('ADMIN_EMAILS environment variable must contain at least one valid email address');
    }
    
    return emails;
  }
  
  // In production, require ADMIN_EMAILS to be set
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_EMAILS environment variable is required in production');
  }
  
  // Development fallback (for local development only)
  return [
    'gauravkhandelwal205@gmail.com',
    'ananykoranne0@gmail.com'
  ];
};

const ADMIN_EMAILS = getAdminEmails();

/**
 * Middleware to check if the authenticated user is an admin
 * Must be used after the authenticate middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED',
        },
      });
      return;
    }

    // Check if user email matches any admin email
    const userEmail = authReq.user.email.toLowerCase();
    if (!ADMIN_EMAILS.includes(userEmail)) {
      res.status(403).json({
        error: {
          message: 'Access denied. Admin privileges required.',
          code: 'FORBIDDEN',
        },
      });
      return;
    }

    next();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: {
          message: error.message,
          code: error.code,
        },
      });
      return;
    }
    
    res.status(500).json({
      error: {
        message: 'Admin check failed',
        code: 'ADMIN_CHECK_ERROR',
      },
    });
  }
};

