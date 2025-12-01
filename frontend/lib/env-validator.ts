/**
 * Frontend environment variable validation
 * Ensures all required environment variables are present
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
] as const;

interface EnvConfig {
  apiUrl: string;
  googleClientId?: string;
  siteUrl?: string;
}

/**
 * Validates and returns environment configuration
 * Throws error if required variables are missing
 */
export const getEnvConfig = (): EnvConfig => {
  const missing: string[] = [];

  // Check required variables
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.';
    
    if (typeof window === 'undefined') {
      // Server-side: throw error
      throw new Error(errorMessage);
    } else {
      // Client-side: log error
      console.error(errorMessage);
    }
  }

  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL!,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  };
};

/**
 * Validates environment variables on module load (server-side only)
 */
if (typeof window === 'undefined') {
  try {
    getEnvConfig();
  } catch (error) {
    console.error('Environment validation failed:', error);
    // Don't throw in development to allow for easier setup
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

