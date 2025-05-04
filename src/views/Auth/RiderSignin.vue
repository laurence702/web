<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <!-- Optional: Back link -->
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
               <!-- Back Icon -->
              <svg class="stroke-current mr-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Back to Home
            </router-link>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Rider Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to access your rider account.
                </p>
              </div>
              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Error Message Placeholder -->
                    <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
                      {{ errorMessage }}
                    </div>

                    <!-- Email Input -->
                    <BaseInput
                      v-model="email"
                      label="Email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      inputId="rider-email"
                    />

                    <!-- Password Input -->
                    <BaseInput
                      v-model="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      inputId="rider-password"
                    />

                    <div class="flex items-center justify-end">
                      <router-link
                        to="/password-reset"
                        class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        Forgot password?
                      </router-link>
                    </div>
                    <div>
                      <button
                        type="submit"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading">Signing In...</span>
                        <span v-else>Sign In</span>
                      </button>
                    </div>
                  </div>
                </form>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Don't have a rider account?
                    <router-link
                      to="/rider/signup" 
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign Up Here
                    </router-link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
         <!-- Right Side Panel (Optional, reuse from Signin.vue if desired) -->
        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
           <div class="flex items-center justify-center z-1">
              <CommonGridShape />
              <div class="flex flex-col items-center max-w-xs">
                 <!-- Replace image with styled text -->
                 <h1 class="mb-4 text-4xl font-bold text-white">
                   GasoPay
                 </h1>
                <p class="text-center text-gray-400 dark:text-white/60">
                  Manage your deliveries and earnings efficiently.
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import store
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import CommonGridShape from '@/components/common/CommonGridShape.vue';

const router = useRouter();
const authStore = useAuthStore(); // Initialize store

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// Update handleSubmit
const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  console.log('Rider Login Attempt:', { email: email.value, password: password.value });
  try {
    // Call the actual login action from the store
    await authStore.login(email.value, password.value);

    // Check if logged in user is actually a rider (optional but good practice)
    if (authStore.currentUser?.role === 'rider') {
        console.log('Rider Login Success');
        alert('Rider Login Successful! Redirecting...');
        // TODO: Redirect to a dedicated rider dashboard if it exists
        await router.push('/'); // Redirect to main dash for now
    } else {
        // Log out if the logged-in user isn't a rider
        authStore.logout();
        errorMessage.value = 'Login successful, but you are not authorized as a Rider.';
    }

  } catch (error: unknown) {
    console.error("Rider Login Component Error:", error);
    if (error instanceof Error) {
        errorMessage.value = error.message || 'Login failed. Please check credentials.';
    } else {
        errorMessage.value = 'An unexpected error occurred during login.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script> 