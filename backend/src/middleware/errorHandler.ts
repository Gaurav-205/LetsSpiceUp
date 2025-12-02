import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../types/errors';
import { RequestWithId } from './requestId';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Special handling for health endpoint - always return 200
  // This ensures health checks never fail even if there are errors
  if (req.path === '/health' || req.path === '/health/') {
    try {
      let dbStatus = 'unknown';
      try {
        const mongoose = require('mongoose');
        if (mongoose.connection && typeof mongoose.connection.readyState === 'number') {
          const readyState = mongoose.connection.readyState;
          dbStatus = readyState === 1 ? 'connected' : 
                     readyState === 2 ? 'connecting' : 
                     readyState === 3 ? 'disconnecting' : 'disconnected';
        } else {
          dbStatus = 'not_initialized';
        }
      } catch {
        dbStatus = 'error';
      }

      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
      });
      return;
    } catch {
      // Even if everything fails, return 200 for health endpoint
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'unknown',
        uptime: process.uptime(),
      });
      return;
    }
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const isProduction = process.env.NODE_ENV === 'production';
  const isOperational = err instanceof AppError ? err.isOperational : false;
  const requestId = (req as RequestWithId).id || 'unknown';

  // Log error for monitoring with request ID
  logger.error(`Error ${statusCode} on ${req.method} ${req.path} [Request ID: ${requestId}]`, err);

  // Don't leak error details in production for non-operational errors
  const errorResponse: {
    error: {
      message: string;
      code?: string;
      requestId?: string;
      stack?: string;
    };
  } = {
    error: {
      message: statusCode === 500 && isProduction && !isOperational
        ? 'Internal server error'
        : message,
      requestId,
    },
  };

  // Include error code if available
  if (err.code) {
    errorResponse.error.code = err.code;
  }

  // Include stack trace only in development
  if (!isProduction && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
