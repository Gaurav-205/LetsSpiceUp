import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export interface RequestWithId extends Request {
  id?: string;
}

/**
 * Middleware to add a unique request ID to each request
 * Helps with tracking and debugging in production
 */
export const requestId = (
  req: RequestWithId,
  res: Response,
  next: NextFunction
): void => {
  // Use existing X-Request-ID header or generate a new one
  const requestId = req.headers['x-request-id'] as string || randomUUID();
  
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

