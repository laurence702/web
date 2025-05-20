<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div class="space-y-5">
    <BaseCard>
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">Create New Rider Account</h2>
        
        <!-- Error Message Placeholder -->
        <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitForm" class="space-y-5">
          <!-- Personal Information -->
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 border-b pb-2 mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput v-model="formData.name" label="Full Name" type="text" placeholder="John Doe" required inputId="admin-create-rider-name" />
            <BaseInput v-model="formData.email" label="Email Address" type="email" placeholder="rider.email@example.com" required inputId="admin-create-rider-email" />
            <BaseInput v-model="formData.phone" label="Phone Number" type="tel" placeholder="08012345678" required inputId="admin-create-rider-phone" />
            <BaseInput v-model="formData.nin" label="NIN (National Identification Number)" type="text" placeholder="Enter 11-digit NIN" required inputId="admin-create-rider-nin" :maxlength="11" />
          </div>
          <div>
            <label for="admin-create-rider-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address (Residential)</label>
            <textarea v-model="formData.address" id="admin-create-rider-address" rows="3" placeholder="Enter full residential address" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>

          <!-- Guarantor & Vehicle -->
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 border-b pb-2 mb-4 mt-6">Guarantor & Vehicle Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput v-model="formData.guarantorName" label="Guarantor's Full Name" type="text" placeholder="Enter guarantor's full name" required inputId="admin-create-guarantor-name" />
            <BaseInput v-model="formData.guarantorPhone" label="Guarantor's Phone" type="tel" placeholder="Enter guarantor's Phone number" required inputId="admin-create-guarantor-phone" />
            <BaseSelect
                v-model="formData.vehicleType"
                label="Vehicle Type"
                :options="vehicleTypeOptions"
                required
                selectId="admin-create-vehicle-type"
                placeholder="Select vehicle type"
            />
          </div>
          <div>
            <label for="admin-create-guarantor-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guarantor's Address</label>
            <textarea v-model="formData.guarantorAddress" id="admin-create-guarantor-address" rows="3" placeholder="Enter guarantor's full address" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>

          <!-- Account Security & Profile -->
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 border-b pb-2 mb-4 mt-6">Account & Profile</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="admin-create-profile-picture" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
              <input
                  type="file"
                  id="admin-create-profile-picture"
                  @change="handleFileChange"
                  accept="image/*"
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  :disabled="uploadingProfilePic"
                />
              <div v-if="uploadingProfilePic" class="mt-2 text-sm text-blue-600 dark:text-blue-400">Uploading picture...</div>
              <div v-if="uploadError" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ uploadError }}</div>
              <div v-if="formData.profilePicUrl && !uploadingProfilePic && !uploadError" class="mt-2 text-sm text-green-600 dark:text-green-400">✅ Picture uploaded!</div>
              <p v-else-if="!formData.profilePicUrl && !uploadingProfilePic" class="text-xs text-gray-500 mt-1">Upload a clear picture (JPG, PNG). Max 2MB.</p>
            </div>
             <BaseInput v-model="formData.branchId" label="Assign to Branch ID" type="text" placeholder="Enter Branch ID" required inputId="admin-create-branch-id" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <BaseInput v-model="formData.password" label="Password" type="password" placeholder="Enter rider password" required inputId="admin-create-rider-password" />
            <BaseInput v-model="formData.confirmPassword" label="Confirm Password" type="password" placeholder="Confirm rider password" required inputId="admin-create-rider-confirm-password" :error="passwordMismatchError" />
          </div>

          <!-- Submission Button -->
          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              class="px-6 py-2.5 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading || uploadingProfilePic || !!passwordMismatchError || !formData.profilePicUrl"
            >
              <span v-if="isLoading">Creating Account...</span>
              <span v-else>Create Rider Account</span>
            </button>
          </div>
        </form>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import apiService from '@/services/apiService';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';

defineOptions({
  name: 'AdminCreateRider'
});

const currentPageTitle = ref('Create Rider');
const router = useRouter();
const authStore = useAuthStore();

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const uploadingProfilePic = ref(false);
const uploadError = ref<string | null>(null);

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  nin: '',
  guarantorName: '',
  guarantorAddress: '',
  guarantorPhone: '',
  vehicleType: '',
  profilePictureFile: null as File | null,
  profilePicUrl: '',
  password: '',
  confirmPassword: '',
  branchId: authStore.currentUser?.branch_id?.toString() || '' // Pre-fill if admin has branch_id
});

const vehicleTypeOptions = [
  { value: 'Keke', text: 'Keke (Tricycle)' },
  { value: 'Car', text: 'Car' },
  { value: 'Bike', text: 'Motorcycle/Bike' },
  { value: 'Other', text: 'Other' },
];

const passwordMismatchError = computed(() => {
  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
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
  formData.profilePicUrl = ''; 

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
          throw new Error(data.error?.message || 'Cloudinary upload failed.');
      }
      formData.profilePicUrl = data.secure_url;
      uploadError.value = null;
  } catch (error: unknown) {
     if (error instanceof Error) {
        uploadError.value = `Upload failed: ${error.message}`;
    } else {
        uploadError.value = 'An unknown error occurred during upload.';
    }
    formData.profilePictureFile = null;
    formData.profilePicUrl = '';
  } finally {
    uploadingProfilePic.value = false;
  }
};

const submitForm = async () => {
  errorMessage.value = null;
  uploadError.value = null;

  if (passwordMismatchError.value) {
    errorMessage.value = passwordMismatchError.value; return;
  }
  if (!formData.profilePicUrl) {
      errorMessage.value = "Profile picture is required."; return;
  }
  if (!formData.branchId) {
      errorMessage.value = "Branch ID is required for assigning the rider."; return;
  }

  isLoading.value = true;

  const fd = new FormData();
  fd.append('fullname', formData.name);
  fd.append('email', formData.email);
  fd.append('phone', formData.phone);
  fd.append('password', formData.password);
  fd.append('password_confirmation', formData.confirmPassword);
  fd.append('role', 'Rider'); // Role is fixed to Rider
  fd.append('nin', formData.nin);
  fd.append('vehicle_type', formData.vehicleType.toLowerCase());
  fd.append('guarantors_name', formData.guarantorName);
  fd.append('guarantors_phone', formData.guarantorPhone);
  fd.append('guarantors_address', formData.guarantorAddress);
  fd.append('address', formData.address);
  fd.append('profilePicUrl', formData.profilePicUrl);
  fd.append('branch_id', formData.branchId);
  // Note: The backend for registerRider might need to be adjusted if it doesn't expect branch_id or created_by_admin_id
  // Or use a different endpoint if one exists for admin creating rider.
  
  const token = authStore.token;
  if (!token) {
    errorMessage.value = "Authentication token not found. Please log in again.";
    isLoading.value = false;
    return;
  }

  try {
    // Ideally, there would be a specific endpoint like /api/admin/create-rider
    // For now, we use registerRider and assume backend handles admin context or we add a flag
    // If registerRider is strictly for public signup, this will need a new backend endpoint.
    const response = await apiService.post('/api/admin/create-rider', fd, token); 
    // Or: await registerRider(fd, true); // if registerRider is adapted to take an isAdmin flag
    
    console.log('Admin Create Rider Success Response:', response);
    alert('Rider account created successfully!');
    router.push('/admin/riders'); // Redirect to riders list or specific rider profile

  } catch (error: unknown) {
    console.error("Admin Create Rider Error:", error);
     if (error instanceof Error) {
        errorMessage.value = error.message || 'An unexpected error occurred.';
    } else {
        errorMessage.value = 'An unexpected error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.form-label {
  @apply block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}

.form-file-input {
    @apply block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400;
}
</style> 