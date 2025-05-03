<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full min-h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                class="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Back to dashboard
            </router-link>
          </div>
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md px-4 mx-auto lg:px-0">
            <div class="mb-5 sm:mb-8">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Create your GasoPay Account
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Fill in the details below to get started.
              </p>
            </div>
            <div>
              <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                  <!-- Role Selection -->
                  <div>
                    <label for="role" class="form-label">
                      Account Type<span class="text-error-500">*</span>
                    </label>
                    <select v-model="role" id="role" name="role" required class="form-input">
                      <option value="" disabled>Select account type</option>
                      <option value="rider">Rider</option>
                      <option value="regularUser">Regular User</option>
                      <!-- Add other roles like branchAdmin, superAdmin if needed for direct creation -->
                    </select>
                  </div>

                  <!-- Full Name -->
                  <div>
                    <label for="fullName" class="form-label">
                      Full Name<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="fullName"
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      required
                      class="form-input"
                    />
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

                  <!-- Phone Number -->
                  <div>
                    <label for="phone" class="form-label">
                      Phone Number<span class="text-error-500">*</span>
                    </label>
                    <input
                      v-model="phone"
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+234 801 234 5678"
                      required
                      class="form-input"
                    />
                  </div>

                  <!-- ====== RIDER SPECIFIC FIELDS ====== -->
                  <template v-if="role === 'rider'">
                    <!-- Address (Residential) -->
                    <div>
                      <label for="address" class="form-label">
                        Address (Residential)<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="address"
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Enter your full residential address"
                        :required="role === 'rider'"
                        class="form-input"
                      />
                    </div>

                    <!-- Vehicle Type -->
                    <div>
                      <label for="vehicleType" class="form-label">
                        Vehicle Type<span class="text-error-500">*</span>
                      </label>
                      <select v-model="vehicleType" id="vehicleType" name="vehicleType" :required="role === 'rider'" class="form-input">
                        <option value="" disabled>Select vehicle type</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Tricycle">Tricycle</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <!-- Products Handled -->
                    <div>
                       <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                         Products Handled<span class="text-error-500">*</span>
                       </label>
                       <div class="flex flex-wrap gap-4">
                         <label for="productLPG" class="flex items-center cursor-pointer">
                           <input type="checkbox" id="productLPG" value="LPG" v-model="productsHandled" class="form-checkbox">
                           <span class="ml-2 text-sm">LPG (Cooking Gas)</span>
                         </label>
                         <label for="productPMS" class="flex items-center cursor-pointer">
                           <input type="checkbox" id="productPMS" value="PMS" v-model="productsHandled" class="form-checkbox">
                           <span class="ml-2 text-sm">PMS (Fuel)</span>
                         </label>
                         <!-- Add CNG if needed based on image ambiguity -->
                         <!--
                         <label for="productCNG" class="flex items-center cursor-pointer">
                           <input type="checkbox" id="productCNG" value="CNG" v-model="productsHandled" class="form-checkbox">
                           <span class="ml-2 text-sm">CNG (Compressed Natural Gas)</span>
                         </label>
                         -->
                       </div>
                       <!-- Add validation message if needed -->
                     </div>

                    <!-- NIN -->
                    <div>
                      <label for="nin" class="form-label">
                        NIN (National Identification Number)<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="nin"
                        type="text" maxlength="11" minlength="11"
                        id="nin"
                        name="nin"
                        placeholder="Enter your 11-digit NIN"
                        :required="role === 'rider'"
                        class="form-input"
                      />
                    </div>

                    <!-- Guarantor's Full Name -->
                    <div>
                      <label for="guarantorName" class="form-label">
                        Guarantor's Full Name<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="guarantorName"
                        type="text"
                        id="guarantorName"
                        name="guarantorName"
                        placeholder="Enter guarantor's full name"
                        :required="role === 'rider'"
                        class="form-input"
                      />
                    </div>

                    <!-- Guarantor's Address -->
                    <div>
                      <label for="guarantorAddress" class="form-label">
                        Guarantor's Address<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="guarantorAddress"
                        type="text"
                        id="guarantorAddress"
                        name="guarantorAddress"
                        placeholder="Enter guarantor's full address"
                        :required="role === 'rider'"
                        class="form-input"
                      />
                    </div>

                     <!-- Profile Picture -->
                     <div>
                       <label for="profilePicture" class="form-label">Profile Picture</label>
                       <input
                         type="file"
                         id="profilePicture"
                         name="profilePicture"
                         @change="handleFileChange"
                         accept="image/*"
                         class="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/20 dark:file:text-brand-300 dark:hover:file:bg-brand-900/30"
                       />
                       <p v-if="profilePictureName" class="mt-1 text-xs text-gray-500">Selected: {{ profilePictureName }}</p>
                     </div>
                  </template>
                  <!-- ====== END RIDER SPECIFIC FIELDS ====== -->

                  <!-- Password -->
                  <div>
                    <label for="password" class="form-label">
                      Password<span class="text-error-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        placeholder="Enter your password"
                        required
                        class="form-input pr-11"
                      />
                      <span
                        @click="togglePasswordVisibility"
                        class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                      >
                        <svg
                          v-if="!showPassword"
                          class="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                            fill="#98A2B3"
                          />
                        </svg>
                        <svg
                          v-else
                          class="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                            fill="#98A2B3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div>
                    <label for="confirmPassword" class="form-label">
                      Confirm Password<span class="text-error-500">*</span>
                    </label>
                     <div class="relative">
                      <input
                        v-model="confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        required
                        :class="['form-input pr-11', { 'border-error-500 dark:border-error-500': passwordsDoNotMatch }]"
                      />
                      <span
                        @click="toggleConfirmPasswordVisibility"
                        class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                      >
                         <!-- Eye icon -->
                      </span>
                     </div>
                     <p v-if="passwordsDoNotMatch" class="mt-1 text-xs text-error-500">
                       Passwords do not match.
                     </p>
                  </div>

                  <!-- Button -->
                  <div>
                    <button
                      type="submit"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="passwordsDoNotMatch || isLoading"
                    >
                       <span v-if="isLoading">Creating Account...</span>
                       <span v-else>Create Rider Account</span>
                    </button>
                  </div>
                </div>
              </form>
              <div class="mt-5 mb-10 lg:mb-0"> <!-- Added bottom margin -->
                <p
                  class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                >
                  Already have an account?
                  <router-link
                    to="/signin"
                    class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >Sign In</router-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Right side image/content -->
        <div
          class="items-center justify-center flex-1 hidden w-full px-4 py-10 lg:flex lg:w-1/2 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600"
        >
          <div class="max-w-md text-center text-white">
             <!-- Placeholder for Rider Registration graphic/text -->
             <svg class="w-20 h-20 mx-auto mb-4 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
             <h2 class="mb-2 text-2xl font-semibold">Rider Registration</h2>
             <p class="text-base opacity-80">Register as a GasPay Rider to start pickups.</p>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

// Form state
const role = ref<'rider' | 'regularUser' | '' >('')
const fullName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const vehicleType = ref('')
const productsHandled = ref<string[]>([])
const nin = ref('')
const guarantorName = ref('')
const guarantorAddress = ref('')
const profilePicture = ref<File | null>(null)
const profilePictureName = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const passwordsDoNotMatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    profilePicture.value = target.files[0]
    profilePictureName.value = target.files[0].name
  } else {
    profilePicture.value = null
    profilePictureName.value = ''
  }
}

const handleSubmit = () => {
  if (passwordsDoNotMatch.value) {
    alert("Passwords do not match!");
    return;
  }

  if (role.value === 'rider' && productsHandled.value.length === 0) {
      alert("Please select at least one product handled.");
      return;
  }

  isLoading.value = true

  const formData = {
    role: role.value,
    fullName: fullName.value,
    email: email.value,
    phone: phone.value,
    password: password.value, // Send password
    ...(role.value === 'rider' && {
      address: address.value,
      vehicleType: vehicleType.value,
      productsHandled: productsHandled.value,
      nin: nin.value,
      guarantorName: guarantorName.value,
      guarantorAddress: guarantorAddress.value,
      profilePicture: profilePicture.value?.name, // Just sending name for mock
    })
  }

  console.log('Submitting Registration Data:', formData)

  // Mock API call
  setTimeout(() => {
    isLoading.value = false
    alert(`Mock registration successful for ${formData.role}: ${formData.fullName}`)
    // TODO: Redirect to login or a success page
    // router.push('/signin')
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
.form-checkbox {
  @apply rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-brand-600 dark:checked:bg-brand-500 dark:checked:border-brand-500;
}
</style>
