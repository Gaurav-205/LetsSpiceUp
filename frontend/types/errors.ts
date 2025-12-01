/**
 * Type definitions for API errors in frontend
 */

export interface ApiError {
  response?: {
    data?: {
      error?: {
        message: string;
        errors?: string[];
      };
    };
    status?: number;
  };
  message?: string;
}

