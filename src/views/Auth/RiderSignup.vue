<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto">
           <div class="w-full max-w-md pt-5 mx-auto">
             <!-- Back link -->
             <router-link
               to="/"
               class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 lg:mb-0"
             >
               <svg class="stroke-current mr-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
               Back to Home
             </router-link>
           </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 sm:px-0">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Create Rider Account (Step {{ currentStep }} of 3)
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ stepDescriptions[currentStep - 1] }}
                </p>
              </div>
              <div>
                 <!-- Error Message Placeholder -->
                <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
                  {{ errorMessage }}
                </div>

                <form @submit.prevent="handleNextOrSubmit">
                   <!-- Step 1: Personal Information -->
                  <div v-if="currentStep === 1" class="space-y-5">
                    <BaseInput v-model="formData.name" label="Full Name" type="text" placeholder="John Doe" required inputId="rider-name" />
                    <BaseInput v-model="formData.email" label="Email Address" type="email" placeholder="your.email@example.com" required inputId="rider-email-signup" />
                    <BaseInput v-model="formData.phone" label="Phone Number" type="tel" placeholder="08012345678" required inputId="rider-phone" />
                    <div>
                      <label for="rider-address" class="form-label">Address (Residential)</label>
                      <textarea v-model="formData.address" id="rider-address" rows="3" placeholder="Enter your full residential address" required class="form-textarea"></textarea>
                    </div>
                    <BaseInput v-model="formData.nin" label="NIN (National Identification Number)" type="text" placeholder="Enter your 11-digit NIN" required inputId="rider-nin" :maxlength="11" />
                  </div>

                  <!-- Step 2: Guarantor & Vehicle -->
                  <div v-if="currentStep === 2" class="space-y-5">
                     <BaseInput v-model="formData.guarantorName" label="Guarantor's Full Name" type="text" placeholder="Enter guarantor's full name" required inputId="guarantor-name" />
                     <BaseInput v-model="formData.guarantorPhone" label="Guarantor's Phone" type="tel" placeholder="Enter guarantor's Phone number" required inputId="guarantor-phone" />
                      <div>
                        <label for="guarantor-address" class="form-label">Guarantor's Address</label>
                        <textarea v-model="formData.guarantorAddress" id="guarantor-address" rows="3" placeholder="Enter guarantor's full address" required class="form-textarea"></textarea>
                      </div>
                      <BaseSelect
                          v-model="formData.vehicleType"
                          label="Vehicle Type"
                          :options="vehicleTypeOptions"
                          required
                          selectId="vehicle-type"
                          placeholder="Select vehicle type"
                      />
                  </div>

                  <!-- Step 3: Account Security & Profile -->
                  <div v-if="currentStep === 3" class="space-y-5">
                       <div>
                        <label for="profile-picture" class="form-label">Profile Picture</label>
                        <input
                           type="file"
                           id="profile-picture"
                           @change="handleFileChange"
                           accept="image/*"
                           class="form-file-input"
                           :disabled="uploadingProfilePic"
                         />
                         <!-- Upload Status/Error Display -->
                         <div v-if="uploadingProfilePic" class="mt-2 text-sm text-blue-600 dark:text-blue-400">
                             Uploading picture...
                         </div>
                         <div v-if="uploadError" class="mt-2 text-sm text-red-600 dark:text-red-400">
                             {{ uploadError }}
                         </div>
                         <div v-if="formData.profilePicUrl && !uploadingProfilePic && !uploadError" class="mt-2 text-sm text-green-600 dark:text-green-400">
                              ✅ Picture uploaded successfully!
                         </div>
                         <p v-else-if="!formData.profilePicUrl && !uploadingProfilePic" class="text-xs text-gray-500 mt-1">
                             Upload a clear picture (JPG, PNG). Max 2MB.
                         </p>
                       </div>
                      <BaseInput v-model="formData.password" label="Password" type="password" placeholder="Enter your password" required inputId="rider-password-signup" />
                      <BaseInput v-model="formData.confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" required inputId="rider-confirm-password" :error="passwordMismatchError" />
                  </div>

                   <!-- Navigation Buttons -->
                  <div class="mt-6 flex justify-between">
                     <button
                        type="button"
                        @click="prevStep"
                        v-if="currentStep > 1"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isLoading || uploadingProfilePic" 
                      >
                        Previous
                      </button>
                      <div v-else></div> <!-- Spacer -->

                      <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isLoading || uploadingProfilePic || (currentStep === 3 && !!passwordMismatchError)" 
                      >
                        <span v-if="isLoading && currentStep === 3">Creating Account...</span>
                        <span v-else-if="currentStep < 3">Next</span>
                        <span v-else>Sign Up</span>
                      </button>
                  </div>
                </form>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Already have a rider account?
                    <router-link
                      to="/rider/signin"
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign In Here
                    </router-link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
         <!-- Right Side Panel (Keep as is) -->
        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
             <div class="flex items-center justify-center z-1">
               <CommonGridShape />
               <div class="flex flex-col items-center max-w-xs">
                  <!-- Replace image with styled text -->
                  <h1 class="mb-4 text-4xl font-bold text-white">
                    <img src="/src/assets/images/GASOPAY-logo (2).svg" alt="gasopay-logo">
                  </h1>
                 <p class="text-center text-gray-400 dark:text-white/60">
                   Join our network of efficient delivery riders.
                 </p>
               </div>
             </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { registerRider } from '@/services/apiService'; // Import the service
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import CommonGridShape from '@/components/common/CommonGridShape.vue';

const router = useRouter();

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME) {
    console.error("Error: VITE_CLOUDINARY_CLOUD_NAME is not set in .env file!");
}
if (!CLOUDINARY_UPLOAD_PRESET) {
     console.error("Error: VITE_CLOUDINARY_UPLOAD_PRESET is not set in .env file!");
}

// --- Component State ---
const currentStep = ref(1);
const isLoading = ref(false); // For final form submission
const errorMessage = ref<string | null>(null);
const uploadingProfilePic = ref(false); // Separate loading state for upload
const uploadError = ref<string | null>(null); // Error specific to upload

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  nin: '',
  guarantorName: '',
  guarantorAddress: '',
  guarantorPhone: '', // Added this field
  vehicleType: '',
  profilePictureFile: null as File | null, // Store the raw file temporarily
  profilePicUrl: '', // Store the Cloudinary URL
  password: '',
  confirmPassword: '',
});

const vehicleTypeOptions = [
  { value: 'Keke', text: 'Keke (Tricycle)' },
  { value: 'Car', text: 'Car' },
  // Add more if needed
];

const stepDescriptions = [
    "Enter your personal contact and identification details.",
    "Provide guarantor information and your vehicle type.",
    "Upload a profile picture and set your account password."
];

// Basic password confirmation check
const passwordMismatchError = computed(() => {
  if (currentStep.value === 3 && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
});

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    formData.profilePictureFile = null;
    formData.profilePicUrl = '';
    uploadError.value = null;
    return;
  }

  formData.profilePictureFile = file;
  uploadingProfilePic.value = true;
  uploadError.value = null;
  formData.profilePicUrl = ''; // Clear previous URL

  console.log("Starting Cloudinary upload for:", file.name);

  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: uploadFormData,
      });
      const data = await response.json();
      if (!response.ok || data.error) {
          console.error('Cloudinary Upload Error Response:', data);
          throw new Error(data.error?.message || 'Cloudinary upload failed.');
      }
      console.log('Cloudinary Upload Success:', data);
      formData.profilePicUrl = data.secure_url; // Store the secure URL
      uploadError.value = null; // Clear any previous error
  } catch (error: unknown) {
    console.error("Cloudinary Upload Error:", error);
     if (error instanceof Error) {
        uploadError.value = `Upload failed: ${error.message}`;
    } else {
        uploadError.value = 'An unknown error occurred during upload.';
    }
    formData.profilePictureFile = null; // Clear file on error
    formData.profilePicUrl = '';      // Clear URL on error
  } finally {
    uploadingProfilePic.value = false;
  }
};

const nextStep = () => {
    // Add validation for current step fields before proceeding if needed
    if (currentStep.value < 3) {
        currentStep.value++;
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
}

const handleNextOrSubmit = () => {
    errorMessage.value = null; // Clear previous form errors
    uploadError.value = null; // Clear previous upload errors

    // --- Step Validations --- 
    if (currentStep.value === 1 && (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.nin)) {
        errorMessage.value = "Please fill in all personal details."; return;
    }
    if (currentStep.value === 2 && (!formData.guarantorName || !formData.guarantorPhone || !formData.guarantorAddress || !formData.vehicleType)) {
         errorMessage.value = "Please fill in all guarantor and vehicle details."; return;
    }
     if (currentStep.value === 3 && (!formData.password || !formData.confirmPassword)) {
         errorMessage.value = "Password fields are required."; return;
    }
     if (currentStep.value === 3 && !!passwordMismatchError.value) {
        errorMessage.value = passwordMismatchError.value; return;
    }
     if (currentStep.value === 3 && !formData.profilePicUrl && formData.profilePictureFile) {
         uploadError.value = uploadError.value || "Profile picture is still uploading or failed.";
         return;
     }
      if (currentStep.value === 3 && !formData.profilePicUrl && !formData.profilePictureFile){
          errorMessage.value = "Profile picture is required."; return;
      }

    if (currentStep.value < 3) {
        nextStep();
    } else {
        submitForm();
    }
}

const submitForm = async () => {
  // Final check before submission
  if (passwordMismatchError.value) {
    errorMessage.value = passwordMismatchError.value; return;
  }
   if (!formData.profilePicUrl) {
      errorMessage.value = "Profile picture upload is required or failed."; return;
   }

  isLoading.value = true; // Use the main form loading state
  errorMessage.value = null;

  // Create FormData for your backend API
  const fd = new FormData();
  fd.append('fullname', formData.name);
  fd.append('email', formData.email);
  fd.append('phone', formData.phone);
  fd.append('password', formData.password);
  fd.append('password_confirmation', formData.confirmPassword);
  fd.append('role', 'Rider');
  fd.append('nin', formData.nin);
  fd.append('vehicle_type', formData.vehicleType.toLowerCase());
  fd.append('guarantors_name', formData.guarantorName);
  fd.append('guarantors_phone', formData.guarantorPhone); // Use the added field
  fd.append('guarantors_address', formData.guarantorAddress);
  fd.append('address', formData.address);
  // Send the Cloudinary URL to your backend
  fd.append('profilePicUrl', formData.profilePicUrl);

  console.log('Submitting Rider Registration Data to Backend...');

  try {
    const response = await registerRider(fd); // Call your backend API service
    console.log('Backend Signup Success Response:', response);
    alert('Rider Signup Successful! Redirecting to Signin...');
    await router.push('/signin');

  } catch (error: unknown) {
    console.error("Backend Signup Component Error:", error);
     if (error instanceof Error) {
        errorMessage.value = error.message || 'An unexpected error occurred during signup.';
    } else {
        errorMessage.value = 'An unexpected error occurred during signup.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Add styles for textarea and file input to match BaseInput */
</style> 