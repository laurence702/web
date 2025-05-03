import { computed, ref } from 'vue'

import { defineStore } from 'pinia'
// Import mock users - adjust path as needed
import users from '@/mockData/users.json'

// Define User type based on API payload
type UserProfile = object | null; // Use object type

type Role = 'super_admin' | 'branchAdmin' | 'rider' | 'regularUser'; // Define Role type alias

type User = {
  id: string;
  fullname: string; // Changed from name
  email: string;
  phone: string;
  role: Role; // Use the Role type alias
  verification_status: 'pending' | 'verified' | 'rejected'; // Example statuses
  branch_id: string | null;
  user_profile: UserProfile;
  created_at: string;
  updated_at: string;
} | null;

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User>(null);
  const authToken = ref<string | null>(null); // Store the auth token
  // Simple boolean derived from currentUser for easier checking in components/guards
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value);

  // --- Actions ---

  // Action to handle successful login, storing user data and token
  function setAuthData(userData: User, token: string) {
    console.log('Setting auth data:', userData, token);
    currentUser.value = userData;
    authToken.value = token;
    // Optional: Persist to localStorage here
    // localStorage.setItem('user', JSON.stringify(userData));
    // localStorage.setItem('token', token);
  }

  // Action to clear auth data on logout
  function clearAuthData() {
    console.log('Clearing auth data');
    currentUser.value = null;
    authToken.value = null;
     // Optional: Clear from localStorage here
    // localStorage.removeItem('user');
    // localStorage.removeItem('token');
  }

  // Mock Login - Simulates API call and uses setAuthData on success
  function mockLogin(email: string, /* password?: string */): boolean {
    console.log(`Attempting mock login for: ${email}`);
    const userFromMock = users.find((u) => u.email === email);

    if (userFromMock) {
        const userRole = userFromMock.role as Role;
        // Check if phone property exists and cast to string before accessing
        const userPhone = ('phone' in userFromMock && userFromMock.phone) ? String(userFromMock.phone) : ''; 

        const loggedInUser: User = {
            id: userFromMock.id,
            fullname: userFromMock.name,
            email: userFromMock.email,
            phone: userPhone,
            role: userRole,
            verification_status: 'verified',
            branch_id: userFromMock.branchId || null,
            user_profile: null, 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        const mockToken = `mock_token_${Date.now()}`;

        setAuthData(loggedInUser, mockToken);
        return true;
    } else {
      console.log('Mock Login failed: User not found');
      clearAuthData();
      return false;
    }
  }

  // Logout action
  function logout() {
    clearAuthData();
    // Optional: Redirect logic can be handled in the component calling logout
  }

  // TODO: Action to initialize store from localStorage (call this in App.vue or main layout)
  // function loadAuthFromStorage() { ... }

  return {
      currentUser,
      authToken,
      isAuthenticated,
      setAuthData, // Expose if needed externally
      clearAuthData, // Expose if needed externally
      mockLogin, // Keep mock login for now
      logout
    };
}) 