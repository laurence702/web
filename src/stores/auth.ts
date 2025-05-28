import type { ApiUser, LoginResponse, RiderRegistrationResponse } from '@/services/apiService'
import { computed, ref } from 'vue'

import { defineStore } from 'pinia'
import { getMe } from '@/services/apiService'

// Define Role enum (Export if needed elsewhere, otherwise keep local)
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  RIDER = 'rider',
  USER = 'user',
  UNKNOWN = 'unknown',
}

// type UserProfile removed as UserProfileData is imported and used

// Removed internal User type definition as ApiUser will be used directly
/*
type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: Role; // Use the Role enum
  verification_status: string;
  branch_id: string | null;
  user_profile: UserProfileData | null;
  created_at: string;
  updated_at: string;
  balance?: string | null; // Added optional balance property
} | null;
*/

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Helper to get from localStorage
// function getItemFromLocalStorage<T>(key: string): T | null { // Removed as unused
//     const item = localStorage.getItem(key);
//     if (!item) return null;
//     try {
//         return JSON.parse(item) as T;
//     } catch (error) {
//         console.error(`Error parsing localStorage item "${key}":`, error);
//         localStorage.removeItem(key); // Clear invalid item
//         return null;
//     }
// }

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const currentUser = ref<ApiUser | null>(null);
  const profileLoading = ref<boolean>(false);
  const profileError = ref<string | null>(null);
  const isInitialized = ref<boolean>(false);

  // Check if a string value is a valid Role enum key
  function isValidRole(value: string): value is Role {
      return Object.values(Role).includes(value as Role);
  }

  function setUserState(apiUserData: ApiUser | null) {
      console.log('[AuthStore] setUserState called with:', apiUserData);
      if (!apiUserData) {
          currentUser.value = null;
          console.log('[AuthStore] currentUser set to null')
          return;
      }

      // Log the exact role string received from API
      console.log('[AuthStore] Received API role string:', apiUserData.role);

      let userRoleEnum: Role = Role.UNKNOWN; // Default to UNKNOWN

      // Find the matching enum key for the role string from the API
      const roleKey = Object.keys(Role).find(
          (key) => Role[key as keyof typeof Role] === apiUserData.role
      ) as keyof typeof Role | undefined;

      if (roleKey) {
          userRoleEnum = Role[roleKey]; // Assign the correct enum member
      } else {
          console.error('[AuthStore] Invalid or unmapped role received from API:', apiUserData.role);
          // Keep userRoleEnum as Role.UNKNOWN
      }

      // Log the mapped enum value
      console.log('[AuthStore] Mapped role enum:', userRoleEnum);

      // Assign the incoming ApiUser data directly to currentUser ref
      // Ensure the role is mapped to the enum type before assignment
      const userWithMappedRole: ApiUser = { ...apiUserData, role: userRoleEnum };
      currentUser.value = userWithMappedRole; // Assign ApiUser directly
      
      console.log('[AuthStore] Set currentUser state. Current role:', currentUser.value?.role);
  }

  function setTokenState(newToken: string | null) {
      token.value = newToken;
  }

  function setUserStorage(user: ApiUser | null) {
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
  }

  function setTokenStorage(tokenValue: string | null) {
    if (tokenValue) {
      localStorage.setItem(AUTH_TOKEN_KEY, tokenValue);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  function clearAuthData(clearToken: boolean) {
    if (clearToken) {
      setTokenState(null);
    }
    setUserState(null);
    setTokenStorage(null);
    setUserStorage(null);
    profileError.value = null;
    profileLoading.value = false;
  }

  async function fetchProfile() {
      if (!token.value) {
          console.log('No token, cannot fetch profile.');
          // Optionally clear user state if token disappears unexpectedly
          // clearAuthData(); // Consider if this is desired behavior
          return;
      }

      profileLoading.value = true;
      profileError.value = null;

      try {
          const response = await getMe(token.value);
          if (response.user) {
             setUserState(response.user);
             setUserStorage(currentUser.value);
          } else {
              // Handle case where API returns success but no user data (shouldn't happen with /me ideally)
              console.error('Profile fetch successful but no user data returned.');
              profileError.value = 'Failed to load profile data.';
              // Optionally clear state if this is considered an error
              // clearAuthData();
          }
      } catch (error: unknown) { // Change type from any to unknown
          console.error('Error fetching profile:', error);
          if (error instanceof Error) {
            profileError.value = error.message;
            // Check for specific HTTP error details if available (example assumes Axios-like error structure)
            // More robust check for Axios-like error structure without `any`
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const response = (error as { response?: { status?: number } }).response;
                if (response?.status === 401) {
                    console.log('Token potentially invalid (401), clearing auth data.');
                    clearAuthData(true);
                }
            }
          } else {
             profileError.value = 'An unknown error occurred while fetching profile.';
          }
          // Decide if we should logout the user on profile fetch failure
          // Removed redundant check here as it's handled above
      } finally {
          profileLoading.value = false;
      }
  }

  // Initialize store from localStorage - ONLY load, don't fetch profile here
  async function loadAuthFromStorage(): Promise<void> {
    console.log('[AuthStore] Attempting to load auth from storage...');
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUserString = localStorage.getItem(USER_DATA_KEY);
    let parsedUser: Record<string, unknown> | null = null;

    console.log('[AuthStore] Stored Token:', storedToken ? 'Exists' : 'Missing');
    console.log('[AuthStore] Stored User String:', storedUserString ? 'Exists' : 'Missing');

    if (storedToken) {
      token.value = storedToken;
      console.log('[AuthStore] Token loaded from storage.');

      if (storedUserString) {
        try {
          parsedUser = JSON.parse(storedUserString);
          console.log('[AuthStore] Parsed user from storage:', parsedUser);

          if (parsedUser && typeof parsedUser === 'object') {
            const hasId = typeof parsedUser.id === 'string' && parsedUser.id !== '';
            const hasRole = typeof parsedUser.role === 'string' && parsedUser.role !== '';
            let roleString = '';
            let roleIsValid = false;
            if (hasRole) {
                roleString = parsedUser.role as string;
                roleIsValid = isValidRole(roleString);
            }
            // Also check for other required fields for minimal validity
            const hasRequiredFields = hasId && typeof parsedUser.fullname === 'string' && typeof parsedUser.email === 'string' && typeof parsedUser.phone === 'string' && typeof parsedUser.verification_status === 'string';

            console.log(`[AuthStore] User Validation: hasId=${hasId}, hasRole=${hasRole}, roleString='${roleString}', roleIsValid=${roleIsValid}, hasRequiredFields=${hasRequiredFields}`);

            if (hasRequiredFields && roleIsValid) {
              // Explicitly construct ApiUser from parsed data
              const userFromStorage: ApiUser = {
                  id: parsedUser.id as string,
                  fullname: parsedUser.fullname as string,
                  email: parsedUser.email as string,
                  phone: parsedUser.phone as string,
                  role: roleString as Role, // Use the validated role string mapped to enum
                  verification_status: parsedUser.verification_status as string,
                  branch_id: parsedUser.branch_id !== null && parsedUser.branch_id !== undefined ? (typeof parsedUser.branch_id === 'number' ? parsedUser.branch_id : (typeof parsedUser.branch_id === 'string' ? parseInt(parsedUser.branch_id, 10) : null)) : null, // Ensure branch_id is number | null
                  branch: (parsedUser.branch && typeof parsedUser.branch === 'object') ? parsedUser.branch as ApiUser['branch'] : null, // Include branch, check if it's an object
                  user_profile: (parsedUser.user_profile && typeof parsedUser.user_profile === 'object') ? parsedUser.user_profile as ApiUser['user_profile'] : null, // Include user_profile
                  created_at: parsedUser.created_at as string,
                  updated_at: parsedUser.updated_at as string,
                  balance: typeof parsedUser.balance === 'string' ? parsedUser.balance as string : undefined, // Include balance, expect string or undefined
                  banned_at: typeof parsedUser.banned_at === 'string' ? parsedUser.banned_at as string : undefined, // Include banned_at, expect string or undefined based on error
                  // Add other potential ApiUser properties from apiService.ts if they exist in stored data
              };

              setUserState(userFromStorage);
              console.log('[AuthStore] User validation successful. Set from storage.');
            } else {
              console.warn('[AuthStore] Stored user data failed validation (missing required fields or invalid role). Clearing user state.');
              setUserState(null);
              setUserStorage(null);
            }
          } else {
              console.warn('[AuthStore] Parsed user data is null or not an object. Clearing user state.');
              setUserState(null);
              setUserStorage(null);
          }
        } catch (error) {
          console.error('[AuthStore] Failed to parse stored user data JSON:', error);
          setUserState(null);
          setUserStorage(null);
        }
      }

      // *** DO NOT FETCH PROFILE HERE ***
      // Let components or guards trigger fetchProfile if needed after initialization
      // if (!userLoadedFromStorage) {
      //     console.log('[AuthStore] Token loaded but user not loaded/invalid from storage. Fetching profile...');
      //     await fetchProfile();
      // }

    } else {
      console.log('[AuthStore] No token found in storage.');
      clearAuthData(true);
    }
    isInitialized.value = true;
    console.log('[AuthStore] loadAuthFromStorage complete. Initialized:', isInitialized.value);
  }

  // Initial load
  loadAuthFromStorage();

  // Login Action
  async function login(loginResponse: LoginResponse) {
    console.log('[AuthStore] login action called with response:', loginResponse);
    setTokenState(loginResponse.token);
    setUserState(loginResponse.user);
    console.log('[AuthStore] currentUser state after setUserState in login:', currentUser.value);
    console.log('[AuthStore] Computed userRole after setUserState in login:', userRole.value);

    setTokenStorage(loginResponse.token);
    setUserStorage(currentUser.value);
    profileError.value = null;
  }

  // Logout Action
  function logout() {
    clearAuthData(true);
    // Optionally, redirect to login page via router push
    // router.push({ name: 'Login' });
  }

  // Action for after Rider Registration
  async function handleRiderRegistration(registrationResponse: RiderRegistrationResponse) {
    setTokenState(registrationResponse.access_token);
    setUserState(registrationResponse.user);
    setTokenStorage(registrationResponse.access_token);
    setUserStorage(currentUser.value);
    profileError.value = null;
  }

  // Getters / Computed properties
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value);
  const userRole = computed(() => currentUser.value?.role ?? null);
  const userProfile = computed(() => currentUser.value?.user_profile ?? null);

  // Computed property to get the user's role as a Role enum, handling string to enum conversion
  const userRoleTyped = computed<Role | null>(() => {
    const roleString = currentUser.value?.role; // Get the role string from the user object
    if (roleString && Object.values(Role).includes(roleString as Role)) {
      return roleString as Role; // Cast and return if it matches a Role enum value
    }
    return null; // Return null if role is not set or doesn't match a known Role
  });

  return {
    token,
    currentUser,
    profileLoading,
    profileError,
    isInitialized,
    isAuthenticated,
    userRole,
    userProfile,
    userRoleTyped,
    loadAuthFromStorage,
    login,
    logout,
    handleRiderRegistration,
    fetchProfile,
    clearAuthData
  };
}) 