import type { ApiUser, LoginResponse, RiderRegistrationResponse, UserProfileData } from '@/services/apiService'
import { computed, ref } from 'vue'

import { defineStore } from 'pinia'
import { getMe } from '@/services/apiService'

// Import mock users - adjust path as needed
// import users from '@/mockData/users.json'

// Define Role enum (Export if needed elsewhere, otherwise keep local)
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  RIDER = 'rider',
  USER = 'user',
  UNKNOWN = 'unknown' // Added for robustness
}

// type UserProfile removed as UserProfileData is imported and used

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
} | null;

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
  const currentUser = ref<User>(null);
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

       // Now use the correctly typed enum member
       const storeUser: User = {
          id: apiUserData.id,
          fullname: apiUserData.fullname,
          email: apiUserData.email,
          phone: apiUserData.phone,
          role: userRoleEnum, // Assign the enum member
          verification_status: apiUserData.verification_status,
          branch_id: apiUserData.branch_id,
          user_profile: apiUserData.user_profile,
          created_at: apiUserData.created_at,
          updated_at: apiUserData.updated_at,
      };
      currentUser.value = storeUser;
      console.log('[AuthStore] Set currentUser state. Current role:', currentUser.value?.role);
  }

  function setTokenState(newToken: string | null) {
      token.value = newToken;
  }

  function setUserStorage(user: User | null) {
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
          // console.log('No token, cannot fetch profile.');
          // Optionally clear user state if token disappears unexpectedly
          // clearAuthData(); // Consider if this is desired behavior
          return;
      }

      profileLoading.value = true;
      profileError.value = null;
      // console.log('Fetching profile with token:', token.value);

      try {
          const response = await getMe(token.value); // Pass the token value
          // console.log('Profile data received:', response);
          if (response.user) {
             setUserState(response.user);
             setUserStorage(currentUser.value); // Update localStorage with fresh data
          } else {
              // Handle case where API returns success but no user data (shouldn't happen with /me ideally)
              console.error('Profile fetch successful but no user data returned.');
              profileError.value = 'Failed to load profile data.';
              // Optionally clear state if this is considered an error
              // clearAuthData();
          }
      } catch (error: unknown) { // Change type from any to unknown
          console.error('Error fetching profile:', error);
          // Check if error is an instance of Error to safely access message
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
          // console.log('Finished fetching profile.');
      }
  }

  // Initialize store from localStorage
  async function loadAuthFromStorage(): Promise<void> {
    console.log('[AuthStore] Attempting to load auth from storage...');
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUserString = localStorage.getItem(USER_DATA_KEY);
    let userLoadedFromStorage = false;
    let parsedUser: Record<string, unknown> | null = null; // Use Record<string, unknown> instead of any

    console.log('[AuthStore] Stored Token:', storedToken ? 'Exists' : 'Missing');
    console.log('[AuthStore] Stored User String:', storedUserString ? 'Exists' : 'Missing');

    if (storedToken) {
      token.value = storedToken;
      console.log('[AuthStore] Token loaded from storage.');

      if (storedUserString) {
        try {
          parsedUser = JSON.parse(storedUserString);
          console.log('[AuthStore] Parsed user from storage:', parsedUser);

          // Ensure parsedUser is not null and is an object before checking properties
          if (parsedUser && typeof parsedUser === 'object') {
            const hasId = typeof parsedUser.id === 'string' && parsedUser.id !== '';
            const hasRole = typeof parsedUser.role === 'string' && parsedUser.role !== '';
            let roleString = '';
            let roleIsValid = false;
            if (hasRole) {
                roleString = parsedUser.role as string; // Now safe to cast to string
                roleIsValid = isValidRole(roleString);
            }
            console.log(`[AuthStore] User Validation: hasId=${hasId}, hasRole=${hasRole}, roleString='${roleString}', roleIsValid=${roleIsValid}`);

            if (hasId && hasRole && roleIsValid) {
              // Cast to unknown first, then to ApiUser
              setUserState(parsedUser as unknown as ApiUser);
              userLoadedFromStorage = true;
              console.log('[AuthStore] User validation successful. Set from storage.');
            } else {
              console.warn('[AuthStore] Stored user data failed validation. Clearing user state.');
              setUserState(null);
              setUserStorage(null);
            }
          } else {
              // Handle case where parsedUser is null or not an object after JSON.parse
              console.warn('[AuthStore] Parsed user data is null or not an object. Clearing user state.');
              setUserState(null);
              setUserStorage(null);
          }
        } catch (error) {
          console.error('[AuthStore] Failed to parse stored user data JSON:', error);
          setUserState(null); // Clear potentially invalid user state
          setUserStorage(null); // Remove invalid user from storage
        }
      }

      // Fetch profile ONLY if token loaded but user wasn't successfully loaded/validated from storage
      if (!userLoadedFromStorage) {
          console.log('[AuthStore] Token loaded but user not loaded/invalid from storage. Fetching profile...');
          await fetchProfile();
      }

    } else {
      console.log('[AuthStore] No token found in storage.');
      // Ensure state is clear if no token
      clearAuthData(false); // Keep user potentially loaded if token disappears strangely?
                             // Or clearAuthData(true) if no token means definitely no user.
                             // Let's clear fully: clearAuthData(true)
      clearAuthData(true);
    }
    isInitialized.value = true;
    console.log('[AuthStore] Auth loading complete. Initialized:', isInitialized.value, 'Authenticated:', isAuthenticated.value);
  }

  // Initial load
  loadAuthFromStorage();

  // Login Action
  async function login(loginResponse: LoginResponse) {
    console.log('[AuthStore] login action called with response:', loginResponse);
    setTokenState(loginResponse.access_token);
    setUserState(loginResponse.user);
    // Log currentUser immediately after setUserState
    console.log('[AuthStore] currentUser state after setUserState in login:', currentUser.value);
    console.log('[AuthStore] Computed userRole after setUserState in login:', userRole.value);

    setTokenStorage(loginResponse.access_token);
    setUserStorage(currentUser.value);
    profileError.value = null; // Clear any previous errors
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
    profileError.value = null; // Clear any previous errors
    // No need to fetch profile again, data is fresh from registration response
  }

  // Getters / Computed properties
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value);
  const userRole = computed(() => currentUser.value?.role ?? null);
  const userProfile = computed(() => currentUser.value?.user_profile ?? null);

  return {
    token,
    currentUser,
    profileLoading,
    profileError,
    isInitialized,
    isAuthenticated,
    userRole,
    userProfile,
    loadAuthFromStorage,
    login,
    logout,
    handleRiderRegistration,
    fetchProfile,
    clearAuthData
  };
}) 