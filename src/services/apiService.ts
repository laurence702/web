// Define the expected structure of the User object in the API response

// Define detailed UserProfile structure based on observed/expected data
export interface UserProfileData { // Export this
  id?: string; // Assuming these might be present
  user_id?: string;
  address?: string;
  vehicle_type?: string;
  nin?: string;
  guarantors_name?: string;
  guarantors_phone?: string;
  guarantors_address?: string;
  profile_pic_url?: string | null; // The profile picture URL from Cloudinary?
  barcode?: string | null;
  total_pickups?: number; // Added based on profile page usage
  current_debt?: number; // Added based on profile page usage
}

export interface ApiUser {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  verification_status: string;
  branch_id: string | null;
  user_profile: UserProfileData | null;
  created_at: string;
  updated_at: string;
}

// Define the expected structure of the successful login response
export interface LoginResponse { // Export this
  message: string;
  access_token: string;
  token_type: string;
  user: ApiUser;
}

// Define the expected structure of the successful Rider Registration response
export interface RiderRegistrationResponse { // Export this
    message: string;
    access_token: string;
    token_type: string;
    user: ApiUser;
}

// Define the expected structure of the /me response
interface GetMeResponse {
  user: ApiUser; // Assuming endpoint returns the user object directly or nested
}

// Read Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set in .env, using default http://localhost:8000/api');
}

/**
 * Performs a login request to the backend using email or phone.
 * @param {string} login_identifier - The user's email or phone number.
 * @param {string} password - The user's password.
 * @returns {Promise<LoginResponse>} - The parsed JSON response from the API.
 * @throws {Error} - Throws an error if the login fails or the response is not ok.
 */
export async function loginUser(login_identifier: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ login_identifier, password }),
  });

  // We expect JSON, even for errors potentially
  let data;
  try {
      data = await response.json();
  } catch {
      // Handle cases where the response is not JSON (e.g., server error pages)
      throw new Error(`Failed to parse response. Status: ${response.status}`);
  }

  if (!response.ok || data.status !== 'success') {
    // Throw an error with the message from the API if available, otherwise a generic one
    console.error("Login API Error Response:", data);
    throw new Error(data.message || `Login failed. Status: ${response.status}`);
  }

  // We need to be sure the response matches LoginResponse structure
  // Add runtime checks if necessary, but for now trust the interface
  return data as LoginResponse;
}

/**
 * Performs a Rider registration request to the backend.
 * @param {FormData} formData - The form data including rider details and profile picture file.
 * @returns {Promise<RiderRegistrationResponse>} - The parsed JSON response from the API.
 * @throws {Error} - Throws an error if the registration fails or the response is not ok.
 */
export async function registerRider(formData: FormData): Promise<RiderRegistrationResponse> {
  // Note: When using FormData with fetch, 'Content-Type' header is set automatically
  // to 'multipart/form-data' by the browser, DO NOT set it manually.
  const response = await fetch(`${BASE_URL}/register-rider`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data', // Let the browser set this with boundary
      'Accept': 'application/json',
    },
    body: formData,
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse registration response. Status: ${response.status}`);
  }

  if (!response.ok) {
    // Handle potential validation errors (often status 422)
    let errorMessage = `Registration failed. Status: ${response.status}`;
    if (data && data.message) {
        errorMessage = data.message;
        if (data.errors) { // Append validation details if available
            errorMessage += `: ${JSON.stringify(data.errors)}`;
        }
    }
    console.error("Rider Registration API Error Response:", data);
    throw new Error(errorMessage);
  }

  // Assuming successful response structure matches RiderRegistrationResponse
  return data as RiderRegistrationResponse;
}

/**
 * Fetches the current authenticated user's details.
 * @param {string} token - The authentication token.
 * @returns {Promise<GetMeResponse>} - The user data response.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function getMe(token: string): Promise<GetMeResponse> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await fetch(`${BASE_URL}/me`, { // Endpoint for current user
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`, // Add Authorization header
    },
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse /me response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("GetMe API Error Response:", data);
    throw new Error(data.message || `/me request failed. Status: ${response.status}`);
  }

   // Assuming the response directly contains the user object or { user: ApiUser }
   if (data.user) {
       return data as GetMeResponse; // Assumes { user: ApiUser } structure
   } else {
        // Attempt to handle if user object is returned directly at top level
        return { user: data as ApiUser };
   }

}

// Add other API functions here as needed (e.g., registerUser, fetchUserData) 