import axios from 'axios';
import Cookies from 'js-cookie';
import { logger } from './logger';

// Get API URL from environment variable
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Remove trailing /api if present since we add it in routes
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

// Log in development if using default
if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'development') {
  logger.info('Using default API URL: http://localhost:5000');
  logger.info('To customize, create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:5000');
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout (increased for email operations)
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  // Only get token if we're in the browser
  if (typeof window !== 'undefined') {
    // Get token from cookie
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle connection refused (backend not running)
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      logger.error(`Cannot connect to backend server at ${API_URL}`);
      return Promise.reject(new Error('Backend server is not running. Please start the backend server.'));
    }

    // Handle 401 Unauthorized
    // Don't remove token here - let the components handle it
    // This prevents logout on refresh when checkAuth is running
    return Promise.reject(error);
  }
);

export default apiClient;

