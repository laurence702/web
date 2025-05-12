/**
 * API Configuration Service
 * 
 * This service centralizes API URL handling and configuration
 * based on the current environment.
 */

// Get the API URL based on environment
const getApiBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_PROD_API_URL || '';
  }
  return import.meta.env.VITE_DEV_API_URL || 'http://localhost:8000';
};

// The base URL for API requests
export const API_BASE_URL = getApiBaseUrl();

// Create full URL for an API endpoint
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with a slash if it doesn't already
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

/**
 * Configuration for axios requests
 */
export const getAuthHeaders = (token: string) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

export default {
  API_BASE_URL,
  getApiUrl,
  getAuthHeaders
}; 