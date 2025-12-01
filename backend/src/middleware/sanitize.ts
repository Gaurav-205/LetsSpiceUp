import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize input by removing potentially dangerous characters
 * Production-ready XSS and injection prevention
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove dangerous CSS
    .replace(/expression\s*\(/gi, '')
    // Remove vbscript
    .replace(/vbscript:/gi, '')
    // Remove iframe
    .replace(/<iframe/gi, '')
    // Remove object/embed tags
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
    // Remove SQL injection patterns (basic)
    .replace(/('|(\\)|;|--|xp_|sp_)/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ');
};

/**
 * Middleware to sanitize request body strings
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
      const sanitized: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value);
        } else if (Array.isArray(value)) {
          sanitized[key] = value.map((item) => 
            typeof item === 'string' ? sanitizeInput(item) : item
          );
        } else if (value && typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    };
    
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

