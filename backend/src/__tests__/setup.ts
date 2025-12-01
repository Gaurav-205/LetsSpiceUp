/**
 * Jest test setup file
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-min-32-characters-long-for-testing';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.PORT = '5000';

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Optionally suppress console output during tests
  // Uncomment if you want to suppress logs:
  // console.log = jest.fn();
  // console.error = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

