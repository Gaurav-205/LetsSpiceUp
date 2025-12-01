/**
 * Production-ready logger utility
 * Provides structured logging with different log levels
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    
    if (this.isProduction) {
      // Structured JSON logging for production
      const logEntry: LogEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...(metadata && { metadata }),
      };
      return JSON.stringify(logEntry);
    }
    
    // Human-readable format for development
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  info(message: string, ...args: unknown[]): void {
    const metadata = args.length > 0 ? this.extractMetadata(args) : undefined;
    // eslint-disable-next-line no-console
    console.log(this.formatMessage('info', message, metadata), ...(this.isDevelopment ? args : []));
  }

  warn(message: string, ...args: unknown[]): void {
    const metadata = args.length > 0 ? this.extractMetadata(args) : undefined;
    // eslint-disable-next-line no-console
    console.warn(this.formatMessage('warn', message, metadata), ...(this.isDevelopment ? args : []));
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const metadata: Record<string, unknown> = {
      error: errorMessage,
      ...(errorStack && this.isProduction ? { stack: errorStack } : {}),
      ...this.extractMetadata(args),
    };
    
    // eslint-disable-next-line no-console
    console.error(this.formatMessage('error', message, metadata), ...(this.isDevelopment ? [error, ...args] : []));
    
    if (this.isDevelopment && errorStack) {
      // eslint-disable-next-line no-console
      console.error('Stack trace:', errorStack);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      const metadata = args.length > 0 ? this.extractMetadata(args) : undefined;
      // eslint-disable-next-line no-console
      console.log(this.formatMessage('debug', message, metadata), ...args);
    }
  }

  private extractMetadata(args: unknown[]): Record<string, unknown> | undefined {
    if (args.length === 0) return undefined;
    
    // If first argument is an object, use it as metadata
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !(args[0] instanceof Error)) {
      return args[0] as Record<string, unknown>;
    }
    
    // Otherwise, create metadata object from all arguments
    const metadata: Record<string, unknown> = {};
    args.forEach((arg, index) => {
      if (typeof arg === 'object' && arg !== null && !(arg instanceof Error)) {
        Object.assign(metadata, arg);
      } else {
        metadata[`arg${index}`] = arg;
      }
    });
    
    return Object.keys(metadata).length > 0 ? metadata : undefined;
  }
}

export const logger = new Logger();

