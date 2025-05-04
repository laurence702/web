export interface ApiUser {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  verification_status: string;
  branch_id: string | null;
  user_profile: object | null;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  status: "success";
  message: string;
  user: ApiUser;
  token: string;
}

interface RiderRegistrationResponse {
  data: ApiUser; // The user data is nested under 'data'
}

const BASE_URL = 'http://localhost:8000/api'; // Adjust if your backend URL is different

/**
 * Performs a login request to the backend.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<LoginResponse>} - The parsed JSON response from the API.
 * @throws {Error} - Throws an error if the login fails or the response is not ok.
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
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

// Add other API functions here as needed (e.g., registerUser, fetchUserData) 