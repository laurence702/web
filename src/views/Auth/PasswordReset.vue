<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <!-- Link back to signin -->
            <router-link
              to="/signin"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                class="stroke-current mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Back to Sign In
            </router-link>
          </div>
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div class="mb-5 sm:mb-8">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Reset Password
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Enter your email address to receive instructions.
              </p>
            </div>
            <div>
              <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                   <!-- Success Message -->
                   <div v-if="successMessage" class="p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
                     {{ successMessage }}
                   </div>
                  <!-- Email -->
                  <div>
                    <label for="email" class="form-label">
                      Email Address<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="email"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      class="form-input"
                    />
                  </div>

                  <!-- Button -->
                  <div>
                    <button
                      type="submit"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isLoading"
                    >
                      <span v-if="isLoading">Sending...</span>
                      <span v-else>Send Reset Instructions</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- Right side image/content (Reusing AuthCardLayout structure) -->
        <AuthCardLayout />
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import AuthCardLayout from '@/components/AuthCardLayout.vue' // Reusing this layout part

const email = ref('')
const isLoading = ref(false)
const successMessage = ref<string | null>(null)

const handleSubmit = () => {
  isLoading.value = true
  successMessage.value = null // Clear previous message
  console.log('Password reset requested for:', email.value)

  // Mock sending instructions
  setTimeout(() => {
    isLoading.value = false
    successMessage.value = `If an account exists for ${email.value}, you will receive password reset instructions.`
    // Clear email field after mock success?
    // email.value = ''
  }, 1500)
}
</script>

<style scoped>
/* Add helper class for required form inputs */
.form-input {
  @apply dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800;
}
.form-label {
  @apply mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400;
}
</style> 