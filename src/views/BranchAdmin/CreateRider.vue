<template>
  <div>
  <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Create New Rider Account</h3>

      <form @submit.prevent="handleSubmit">
        <!-- Step 1: Personal Information -->
        <section v-if="currentStep === 1">
          <h4 class="mb-4 text-xl font-medium text-gray-800 dark:text-white/90">Personal Information</h4>
          <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <!-- Full Name -->
            <div>
              <label for="fullname" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Full Name</label>
              <input type="text" id="fullname" v-model="formData.fullname" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              <p v-if="formErrors.fullname" class="mt-1 text-sm text-error-500">{{ formErrors.fullname }}</p>
          </div>
            <!-- Email -->
          <div>
              <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
              <input type="email" id="email" v-model="formData.email" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
              <p v-if="formErrors.email" class="mt-1 text-sm text-error-500">{{ formErrors.email }}</p>
          </div>
            <!-- Phone -->
          <div>
              <label for="phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
              <input type="tel" id="phone" v-model="formData.phone" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
               <p v-if="formErrors.phone" class="mt-1 text-sm text-error-500">{{ formErrors.phone }}</p>
          </div>
             <!-- Password -->
            <div>
              <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
              <input type="password" id="password" v-model="formData.password" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
               <p v-if="formErrors.password" class="mt-1 text-sm text-error-500">{{ formErrors.password }}</p>
            </div>
            <!-- Password Confirmation -->
             <div>
              <label for="password_confirmation" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Confirm Password</label>
              <input type="password" id="password_confirmation" v-model="formData.password_confirmation" required
                     class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
               <p v-if="formErrors.password_confirmation" class="mt-1 text-sm text-error-500">{{ formErrors.password_confirmation }}</p>
            </div>
          </div>
        </section>

        <!-- Step 2: Rider Information -->
        <section v-if="currentStep === 2">
           <h4 class="mb-4 text-xl font-medium text-gray-800 dark:text-white/90">Rider Information</h4>
           <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
             <!-- NIN -->
             <div>
               <label for="nin" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">NIN</label>
               <input type="text" id="nin" v-model="formData.nin" required
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                <p v-if="formErrors.nin" class="mt-1 text-sm text-error-500">{{ formErrors.nin }}</p>
             </div>
             <!-- Vehicle Type -->
              <div>
               <label for="vehicle_type" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Vehicle Type</label>
               <select id="vehicle_type" v-model="formData.vehicle_type" required
                       class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                 <option value="">Select Vehicle Type</option>
                 <option value="keke">KEKE</option>
                 <option value="car">CAR</option>
               </select>
                 <p v-if="formErrors.vehicle_type" class="mt-1 text-sm text-error-500">{{ formErrors.vehicle_type }}</p>
             </div>
             <!-- Profile Picture -->
             <div>
                        <label for="profile-picture" class="form-label">Profile Picture</label>
                        <input
                           type="file"
                           id="profile-picture"
                           @change="handleProfilePicUpload"
                           accept="image/*"
                           class="form-file-input"
                           :disabled="isLoading || uploadingProfilePic"
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
           </div>
        </section>

        <!-- Step 3: Guarantor and Address -->
        <section v-if="currentStep === 3">
            <h4 class="mb-4 text-xl font-medium text-gray-800 dark:text-white/90">Guarantor and Address</h4>
            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <!-- Guarantor's Name -->
                <div>
                  <label for="guarantors_name" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guarantor's Name</label>
                  <input type="text" id="guarantors_name" v-model="formData.guarantors_name" required
                         class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                   <p v-if="formErrors.guarantors_name" class="mt-1 text-sm text-error-500">{{ formErrors.guarantors_name }}</p>
                </div>
                 <!-- Guarantor's Phone -->
                <div>
                  <label for="guarantors_phone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guarantor's Phone</label>
                  <input type="tel" id="guarantors_phone" v-model="formData.guarantors_phone" required
                         class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                    <p v-if="formErrors.guarantors_phone" class="mt-1 text-sm text-error-500">{{ formErrors.guarantors_phone }}</p>
                </div>
                <!-- Guarantor's Address -->
                <div>
                   <label for="guarantors_address" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guarantor's Address</label>
                   <input type="text" id="guarantors_address" v-model="formData.guarantors_address" required
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                     <p v-if="formErrors.guarantors_address" class="mt-1 text-sm text-error-500">{{ formErrors.guarantors_address }}</p>
                 </div>
                <!-- Address -->
                 <div>
                   <label for="address" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Rider's Address</label>
                   <input type="text" id="address" v-model="formData.address" required
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                     <p v-if="formErrors.address" class="mt-1 text-sm text-error-500">{{ formErrors.address }}</p>
                 </div>
          </div>
        </section>

        <!-- Navigation Buttons -->
        <div class="mt-6 flex justify-between">
          <button type="button" @click="prevStep" :disabled="currentStep === 1"
                  class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            Previous
          </button>
          <button type="button" @click="nextStep" v-if="currentStep < 3"
                  class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
            Next
          </button>
          <button type="submit" v-if="currentStep === 3"
                  class="rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600">
            Create Rider
            </button>
          </div>
        </form>

       <!-- Loading and Error states -->
       <div v-if="isLoading" class="mt-4 text-center text-brand-500">Loading...</div>
       <div v-if="errorMessage" class="mt-4 text-center text-error-500">{{ errorMessage }}</div>
       <div v-if="successMessage" class="mt-4 text-center text-success-500">{{ successMessage }}</div>

      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import { useAuthStore } from '@/stores/auth';
import apiService, { isBackendValidationErrorResponse, type BackendValidationErrorResponse, type RiderRegistrationResponse } from '@/services/apiService';
import { useRouter } from 'vue-router';
import axios, { isAxiosError, type AxiosError } from 'axios';

const currentPageTitle = ref('Create Rider');
const authStore = useAuthStore();
const router = useRouter();

const currentStep = ref(1);
const totalSteps = 3;

const formData = ref({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  nin: '',
  vehicle_type: '',
  profilePicUrl: null as string | null,
  guarantors_name: '',
  guarantors_phone: '',
  guarantors_address: '',
  address: '',
});

const formErrors = ref<Record<string, string>>({});
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const uploadingProfilePic = ref(false);
const uploadError = ref<string | null>(null);

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const handleProfilePicUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    formData.value.profilePicUrl = null;
    uploadError.value = null;
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxFileSize = 2 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Invalid file type. Please upload a JPG, PNG, or GIF.';
    formData.value.profilePicUrl = null;
    return;
  }

  if (file.size > maxFileSize) {
    uploadError.value = 'File size exceeds 2MB.';
    formData.value.profilePicUrl = null;
    return;
  }

  uploadingProfilePic.value = true;
  uploadError.value = null;

  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData
    );

    if (response.data && response.data.secure_url) {
      formData.value.profilePicUrl = response.data.secure_url;
      console.log('Cloudinary upload successful:', response.data.secure_url);
    } else {
      uploadError.value = 'Cloudinary upload failed: Invalid response from server.';
      formData.value.profilePicUrl = null;
    }
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    if (axios.isAxiosError(err) && err.response) {
        uploadError.value = `Upload failed: ${err.response.status} - ${err.response.data?.message || err.message}`;
    } else if (err instanceof Error) {
        uploadError.value = `Upload failed: ${err.message}`;
    } else {
        uploadError.value = 'An unknown upload error occurred.';
    }
    formData.value.profilePicUrl = null;
  } finally {
    uploadingProfilePic.value = false;
    if (target) {
        target.value = '';
    }
  }
};

const validateStep = (step: number): boolean => {
  formErrors.value = {};
  let isValid = true;

  if (step === 1) {
    if (!formData.value.fullname) { formErrors.value.fullname = 'Full name is required'; isValid = false; }
    if (!formData.value.email) { formErrors.value.email = 'Email is required'; isValid = false; }
    if (formData.value.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.value.email)) { formErrors.value.email = 'Invalid email format'; isValid = false; }
    if (!formData.value.phone) { formErrors.value.phone = 'Phone number is required'; isValid = false; }
    if (!formData.value.password) { formErrors.value.password = 'Password is required'; isValid = false; }
    if (formData.value.password.length < 6) { formErrors.value.password = 'Password must be at least 6 characters'; isValid = false; }
    if (!formData.value.password_confirmation) { formErrors.value.password_confirmation = 'Confirm password is required'; isValid = false; }
    if (formData.value.password !== formData.value.password_confirmation) { formErrors.value.password_confirmation = 'Passwords do not match'; isValid = false; formErrors.value.password = 'Passwords do not match'; }

  } else if (step === 2) {
    if (!formData.value.nin) { formErrors.value.nin = 'NIN is required'; isValid = false; }
    if (!formData.value.vehicle_type) { formErrors.value.vehicle_type = 'Vehicle type is required'; isValid = false; }
    if (!formData.value.profilePicUrl) { formErrors.value.profilePicUrl = 'Profile picture is required'; isValid = false; }
  } else if (step === 3) {
    if (!formData.value.guarantors_name) { formErrors.value.guarantors_name = 'Guarantor\'s name is required'; isValid = false; }
    if (!formData.value.guarantors_phone) { formErrors.value.guarantors_phone = 'Guarantor\'s phone is required'; isValid = false; }
    if (!formData.value.guarantors_address) { formErrors.value.guarantors_address = 'Guarantor\'s address is required'; isValid = false; }
    if (!formData.value.address) { formErrors.value.address = 'Rider\'s address is required'; isValid = false; }
  }

  return isValid;
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (!validateStep(totalSteps)) {
    errorMessage.value = 'Please fix the errors in the form.';
    if(formErrors.value.guarantors_name || formErrors.value.guarantors_phone || formErrors.value.guarantors_address || formErrors.value.address) {
        currentStep.value = 3;
    } else if (formErrors.value.nin || formErrors.value.vehicle_type || formErrors.value.profilePicUrl) {
        currentStep.value = 2;
    } else if (formErrors.value.fullname || formErrors.value.email || formErrors.value.phone || formErrors.value.password || formErrors.value.password_confirmation) {
         currentStep.value = 1;
    }
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  
  const token = authStore.token;
  if (!token) {
    errorMessage.value = 'Authentication token missing.';
    isLoading.value = false;
    return;
  }

  const data = new FormData();
  data.append('fullname', formData.value.fullname);
  data.append('email', formData.value.email);
  data.append('phone', formData.value.phone);
  data.append('password', formData.value.password);
  data.append('password_confirmation', formData.value.password_confirmation);
  data.append('nin', formData.value.nin);
  data.append('vehicle_type', formData.value.vehicle_type);
  data.append('guarantors_name', formData.value.guarantors_name);
  data.append('guarantors_phone', formData.value.guarantors_phone);
  data.append('guarantors_address', formData.value.guarantors_address);
  data.append('address', formData.value.address);
  data.append('role', 'rider');

  if (formData.value.profilePicUrl) {
    data.append('profilePicUrl', formData.value.profilePicUrl);
  }

  try {
    const response = await apiService.post<RiderRegistrationResponse, FormData>('/register-rider', data, token);
    console.log('Rider registration successful:', response);
    successMessage.value = response.message || 'Rider account created successfully!';
    router.push({ path: '/admin/riders' });

    resetForm();

  } catch (error) {
    console.error('Rider registration failed:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      const errorResponse = error.response;
      
      if (errorResponse.data && typeof errorResponse.data === 'object' && isBackendValidationErrorResponse(errorResponse.data)) {
         const validationError = errorResponse.data;
         if (validationError.errors) {
           for (const field in validationError.errors) {
             if (validationError.errors[field] && validationError.errors[field].length > 0) {
               if (field in formData.value) {
                  formErrors.value[field as keyof typeof formData.value] = validationError.errors[field].join(', ');
               } else {
                 console.warn(`Backend returned error for unknown field: ${field}`);
                 errorMessage.value = (errorMessage.value ? errorMessage.value + '; ' : '') + `${field}: ${validationError.errors[field].join(', ')}`;
               }
             }
           }
           if (validationError.message && Object.keys(formErrors.value).length === 0) {
                errorMessage.value = validationError.message;
            } else if (!validationError.message && Object.keys(formErrors.value).length > 0) {
               errorMessage.value = 'Validation failed. Please check the fields above.';
            }
         }
          if (Object.keys(formErrors.value).length > 0) {
            if(Object.keys(formErrors.value).some(key => ['fullname', 'email', 'phone', 'password', 'password_confirmation'].includes(key as string))) {
                currentStep.value = 1;
            } else if (Object.keys(formErrors.value).some(key => ['nin', 'vehicle_type', 'profilePicUrl'].includes(key as string))) {
                currentStep.value = 2;
            } else if(Object.keys(formErrors.value).some(key => ['guarantors_name', 'guarantors_phone', 'guarantors_address', 'address'].includes(key as string))) {
                 currentStep.value = 3;
             } else {
                  currentStep.value = 1;
             }
          } else {
               errorMessage.value = validationError.message || 'An unexpected validation error occurred without specific field errors.';
          }
      } else if (errorResponse.data && typeof errorResponse.data.message === 'string'){
           errorMessage.value = errorResponse.data.message;
      }
      else {
         errorMessage.value = 'An unexpected error occurred with the response data format.';
      }
    } else if (error instanceof Error) {
       errorMessage.value = error.message;
    } else {
       errorMessage.value = 'An unknown error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
    formData.value = {
        fullname: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        nin: '',
        vehicle_type: '',
        profilePicUrl: null,
        guarantors_name: '',
        guarantors_phone: '',
        guarantors_address: '',
        address: '',
    };
    formErrors.value = {};
    currentStep.value = 1;
     errorMessage.value = null;
};

</script>

<style scoped>
/* Add any specific styles for the form here if needed */
/* You might want to style the steps/sections */
</style> 