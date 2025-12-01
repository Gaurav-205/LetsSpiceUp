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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).beforeAll = (global as any).beforeAll || (() => {});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).afterAll = (global as any).afterAll || (() => {});

// Note: Jest globals (beforeAll, afterAll) are available at runtime
// This file is excluded from production build via tsconfig.json

