/**
 * Production-ready logger utility
 * Only logs in development, silent in production
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console[level](`[${level.toUpperCase()}]`, message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    // Always log errors, even in production (but can be filtered by log level)
    // eslint-disable-next-line no-console
    console.error('[ERROR]', message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG]', message, ...args);
    }
  }
}

export const logger = new Logger();

