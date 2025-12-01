import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from '../types/errors';

// Admin email - only this user can access admin routes
// Can be overridden with ADMIN_EMAIL environment variable
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'gauravkhandelwal205@gmail.com';

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

    // Check if user email matches admin email
    if (authReq.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
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

