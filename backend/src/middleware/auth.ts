import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../services/tokenService';
import { AppError } from '../types/errors';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'No token provided. Please authenticate.',
          code: 'NO_TOKEN',
        },
      });
      return;
    }

    const token = authHeader.substring(7);
    
    if (!token || token.trim() === '') {
      res.status(401).json({
        error: {
          message: 'Invalid token format. Please authenticate again.',
          code: 'INVALID_TOKEN_FORMAT',
        },
      });
      return;
    }

    const decoded = verifyToken(token);
    (req as AuthRequest).user = decoded;
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
    
    res.status(401).json({
      error: {
        message: 'Invalid or expired token. Please authenticate again.',
        code: 'AUTH_ERROR',
      },
    });
  }
};

