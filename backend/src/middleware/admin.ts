import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from '../types/errors';

// Admin emails - users with these emails can access admin routes
// Can be overridden with ADMIN_EMAILS environment variable (comma-separated)
// Default admins: gauravkhandelwal205@gmail.com and ananykoranne0@gmail.com
const getAdminEmails = (): string[] => {
  if (process.env.ADMIN_EMAILS) {
    // Support comma-separated list from environment variable
    return process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase());
  }
  // Default admin emails
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

