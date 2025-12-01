/**
 * Redirects to Google OAuth authentication
 */
export const redirectToGoogleAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/api/auth/google`;
};

