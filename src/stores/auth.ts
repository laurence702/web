import { defineStore } from 'pinia'
import { ref } from 'vue'
// Import mock users - adjust path as needed
import users from '@/mockData/users.json'

// Define user type (can be expanded)
type User = {
  id: string
  email: string
  role: 'superAdmin' | 'branchAdmin' | 'rider' | 'regularUser'
  name: string
  branchId?: string
} | null

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User>(null)
  const isAuthenticated = ref(false)

  // Mock login action
  function login(email: string): boolean {
    console.log(`Attempting login for: ${email}`) // Log attempt
    // Find user in mock data (password check is skipped in mock)
    const user = users.find((u) => u.email === email)

    if (user) {
      console.log('Login successful:', user) // Log success
      currentUser.value = user as User // Assign found user
      isAuthenticated.value = true
      // In a real app, store token/session info here
      return true
    } else {
      console.log('Login failed: User not found') // Log failure
      currentUser.value = null
      isAuthenticated.value = false
      return false
    }
  }

  // Mock logout action
  function logout() {
    console.log('Logging out') // Log logout
    currentUser.value = null
    isAuthenticated.value = false
    // In a real app, clear token/session info here
  }

  return { currentUser, isAuthenticated, login, logout }
}) 