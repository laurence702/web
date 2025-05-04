import { computed, ref } from 'vue'

import type { ApiUser } from '@/services/apiService'
import { defineStore } from 'pinia'
// Import mock users - adjust path as needed
// import users from '@/mockData/users.json'
import { loginUser } from '@/services/apiService'

// Define User type based on API payload
type UserProfile = object | null; // Use object type

type Role = 'super_admin' | 'branchAdmin' | 'rider' | 'regularUser'; // Define Role type alias

type User = {
  id: string;
  fullname: string; // Changed from name
  email: string;
  phone: string;
  role: Role; // Use the Role type alias
  verification_status: string; // Keep as string, specific values aren't critical for store state
  branch_id: string | null;
  user_profile: UserProfile;
  // created_at: string; // Omit if not needed in frontend state
  // updated_at: string; // Omit if not needed in frontend state
} | null;

// Helper function to get item from localStorage safely
function getItemFromLocalStorage<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return null;
    }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User>(getItemFromLocalStorage<User>('user'));
  const authToken = ref<string | null>(localStorage.getItem('token'));
  // Simple boolean derived from currentUser for easier checking in components/guards
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value);

  // --- Actions ---

  // Action to handle successful login, storing user data and token
  function setAuthData(userData: ApiUser, token: string) {
    console.log('Setting auth data:', userData);
    // Map ApiUser to the User type used in the store
    const storeUser: User = {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        role: userData.role as Role, // Add validation/default if needed
        verification_status: userData.verification_status,
        branch_id: userData.branch_id,
        user_profile: null, // Maybe simplify or omit from store if not directly used
        // map other fields if needed
    };

    currentUser.value = storeUser;
    authToken.value = token;
    try {
        localStorage.setItem('user', JSON.stringify(storeUser));
        localStorage.setItem('token', token);
    } catch (error) {
        console.error('Failed to save auth state to localStorage:', error);
    }
  }

  // Action to clear auth data on logout
  function clearAuthData() {
    console.log('Clearing auth data');
    currentUser.value = null;
    authToken.value = null;
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    } catch (error) {
         console.error('Failed to clear auth state from localStorage:', error);
    }
  }

  // Real Login Action
  async function login(email: string, password: string): Promise<boolean> {
     console.log(`Attempting real login for: ${email}`);
    try {
      const response = await loginUser(email, password); // Call API service
      // On success, response contains { status, message, user, token }
      setAuthData(response.user, response.token);
      return true; // Indicate success
    } catch (error) {
      console.error('Login Action Failed:', error);
      clearAuthData(); // Clear state on login failure
      // Rethrow or handle error specifically for the component
      throw error; // Let the component handle displaying the error message
    }
  }

  // Logout action
  function logout() {
    clearAuthData();
    // Optional: Redirect after logout (often done in component)
    // Example: router.push('/signin');
  }

  // Function to load auth state - call this early in your app initialization
  function loadAuthFromStorage() {
      const storedUser = getItemFromLocalStorage<User>('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
          currentUser.value = storedUser;
          authToken.value = storedToken;
          console.log('Auth state loaded from storage.');
      } else {
          console.log('No auth state found in storage.');
      }
  }

  return {
      currentUser,
      authToken,
      isAuthenticated,
      login, // Expose real login
      logout,
      loadAuthFromStorage // Expose loader
      // setAuthData, // Might not need to expose these directly
      // clearAuthData,
    };
}) 