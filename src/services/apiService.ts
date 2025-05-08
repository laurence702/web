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

// Define Branch structure based on user object example
interface BranchData {
  id: number;
  name: string;
  location?: string;
  branch_phone?: string;
  // Add other fields if needed
}

export interface ApiUser {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  verification_status: string;
  branch_id: number | null; // Keep ID if needed, but use branch object primarily
  branch: BranchData | null; // Add the nested branch object
  user_profile: UserProfileData | null;
  // Include other fields from example if needed (e.g., balance, banned_at)
  balance?: string;
  banned_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Define the expected structure of the successful login response
export interface LoginResponse { // Export this
  message: string;
  token: string;
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
  user: ApiUser;
}

// Define the expected structure of the /users/{id} response
export interface GetUserByIdResponse { // New interface
  user: ApiUser;
}

// Define the structure for user list API response (adjust based on actual API)
interface GetUsersResponse {
  data: ApiUser[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number; 
  // Add other pagination fields if provided by API (e.g., next_page_url)
}

// Define parameters for getUsers function
interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string; // To filter by role
  verification_status?: string; // Add verification status filter
  branchId?: string; // Optional filter
  // Add other potential filter/sort params
}

// Define request body for verification update
interface UpdateVerificationStatusRequest {
    status: 'verified' | 'rejected';
    rider_id: string;
}

// Define response (adjust based on actual API response)
interface UpdateVerificationStatusResponse {
    message: string;
    // Include other fields if the API returns more data
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

  let data;
  try {
    console.log('IIIIIIII', response);
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

/**
 * Fetches a specific user by their ID.
 * @param {string} token - The authentication token.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<GetUserByIdResponse>} - The user data response.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function getUserById(token: string, userId: string): Promise<GetUserByIdResponse> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }
  if (!userId) {
    throw new Error("User ID is missing.");
  }

  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let data;
  try {
      data = await response.json();
  } catch (e) {
      console.error("Error parsing getUserById response JSON:", e, "Status:", response.status);
      throw new Error(`Failed to parse response for user ${userId}. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error(`GetUserById API Error for user ${userId}:`, data);
    throw new Error(data?.message || `Request for user ${userId} failed. Status: ${response.status}`);
  }

  // Assuming the response directly contains the user object or { user: ApiUser }
  // This handles both { user: {...} } and cases where the API returns the user object directly at the root
  if (data && data.user && typeof data.user === 'object') {
      return data as GetUserByIdResponse;
  } else if (data && typeof data === 'object' && data.id) { // Check if data itself is an ApiUser
      return { user: data as ApiUser };
  } else {
    // If the structure is unexpected, log and throw an error
    console.error("Unexpected response structure for getUserById:", data);
    throw new Error("Unexpected response structure from server.");
  }
}

/**
 * Fetches a list of users from the API, with optional filtering and pagination.
 * @param {string} token - The authentication token.
 * @param {GetUsersParams} params - Parameters for filtering and pagination.
 * @returns {Promise<GetUsersResponse>} - The user list response.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function getUsers(token: string, params: GetUsersParams = {}): Promise<GetUsersResponse> {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.role) queryParams.append('role', params.role);
  if (params.verification_status) queryParams.append('verification_status', params.verification_status); // Add status param
  if (params.branchId) queryParams.append('branch_id', params.branchId);
  // Add other params as needed

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/users${queryString ? '?' + queryString : ''}`;
  console.log('[apiService] Fetching users from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let data;
  try {
      data = await response.json();
  } catch {
      throw new Error(`Failed to parse user list response. Status: ${response.status}`);
  }

  if (!response.ok) {
    console.error("GetUsers API Error Response:", data);
    throw new Error(data.message || `Failed to fetch users. Status: ${response.status}`);
  }

  // Add runtime validation if necessary
  return data as GetUsersResponse;
}

/**
 * Updates the verification status of a rider.
 * @param {string} token - The authentication token.
 * @param {UpdateVerificationStatusRequest} payload - The request body containing rider_id and status.
 * @returns {Promise<UpdateVerificationStatusResponse>} - The response from the API.
 * @throws {Error} - Throws error on network failure or non-ok response.
 */
export async function updateRiderVerificationStatus(
    token: string,
    payload: UpdateVerificationStatusRequest
): Promise<UpdateVerificationStatusResponse> {
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    const url = `${BASE_URL}/riders/verification`;
    console.log('[apiService] Updating rider verification status:', url, payload);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error(`Failed to parse verification update response. Status: ${response.status}`);
    }

    if (!response.ok) {
        console.error("UpdateVerificationStatus API Error Response:", data);
        throw new Error(data.message || `Failed to update verification status. Status: ${response.status}`);
    }

    return data as UpdateVerificationStatusResponse;
}

// Add other API functions here as needed (e.g., registerUser, fetchUserData) 