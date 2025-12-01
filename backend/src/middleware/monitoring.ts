import { Request, Response, NextFunction } from 'express';
import { RequestWithId } from './requestId';
import { logger } from '../utils/logger';

/**
 * Request monitoring middleware
 * Tracks response times and logs slow requests
 */
export const monitoring = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = (req as RequestWithId).id || 'unknown';

  // Log request start
  logger.debug(`[${requestId}] ${req.method} ${req.path} - Started`);

  // Track response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId,
      ip: req.ip || req.socket.remoteAddress,
    };

    // Log slow requests (>1s)
    if (duration > 1000) {
      logger.warn(`[${requestId}] Slow request detected`, logData);
    } else {
      logger.debug(`[${requestId}] Request completed`, logData);
    }

    // Log errors
    if (res.statusCode >= 400) {
      logger.warn(`[${requestId}] Request failed`, logData);
    }
  });

  next();
};

