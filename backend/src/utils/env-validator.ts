/**
 * Environment variable validation
 * Ensures all required environment variables are present
 */

interface EnvConfig {
  required: string[];
  optional: string[];
}

const envConfig: EnvConfig = {
  required: [
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL',
  ],
  optional: [
    'PORT',
    'NODE_ENV',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'JWT_EXPIRES_IN',
    'SESSION_SECRET',
  ],
};

export const validateEnv = (): void => {
  const missing: string[] = [];

  envConfig.required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

