/**
 * Example test file for error handling
 */

import {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
} from '../../types/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with default values', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it('should create an error with custom values', () => {
      const error = new AppError('Custom error', 400, false, 'CUSTOM_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(false);
      expect(error.code).toBe('CUSTOM_CODE');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error with 400 status', () => {
      const error = new ValidationError('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('AuthenticationError', () => {
    it('should create an authentication error with 401 status', () => {
      const error = new AuthenticationError();
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('AuthenticationError');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error with 404 status', () => {
      const error = new NotFoundError('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('NotFoundError');
      expect(error.code).toBe('NOT_FOUND');
    });
  });
});

