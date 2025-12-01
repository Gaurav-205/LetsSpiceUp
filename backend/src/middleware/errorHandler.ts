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
