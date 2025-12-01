/**
 * Example test for logger utility
 */

import { logger } from '@/lib/logger';

describe('Logger', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.clearAllMocks();
  });

  describe('in development', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should log info messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Test info message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log debug messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.debug('Test debug message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('in production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should always log errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Test error message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

