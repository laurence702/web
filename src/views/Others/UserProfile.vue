<template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <profile-card :user="userPropData" :branch="branchData" v-if="userPropData && branchData"/>
      <personal-info-card :user="userPropData" :branch="branchData" v-if="userPropData && branchData"/>
      <address-card :user="userPropData" :branch="branchData" v-if="userPropData && branchData"/>
    </div>
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted, computed } from 'vue'
import ProfileCard from '../../components/profile/ProfileCard.vue'
import PersonalInfoCard from '../../components/profile/PersonalInfoCard.vue'
import AddressCard from '../../components/profile/AddressCard.vue'
import { useAuthStore } from '@/stores/auth'
import { apiService } from '@/services/apiService'
import type { ApiUser } from '@/services/apiService'

// Define branch data interface
interface BranchData {
  id: number;
  name: string;
  location?: string;
  branch_phone?: string;
  branch_admin?: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
  };
  profileError: string | null;
}

const currentPageTitle = ref('User Profile')
const authStore = useAuthStore()
const branchData = ref<BranchData | null>(null)

// Computed property to explicitly type authStore.currentUser
const currentUserData = computed<ApiUser | null>(() => authStore.currentUser);

// Computed property to prepare data for the user prop, ensuring it matches ApiUser | null structure
const userPropData = computed<ApiUser | null>(() => {
  if (!currentUserData.value) {
    return null;
  }
  // Explicitly create an object that conforms to ApiUser structure
  const user: ApiUser = {
    ...currentUserData.value,
    branch: currentUserData.value.branch === undefined ? null : currentUserData.value.branch, // Ensure branch is null if undefined
    // Add other properties from ApiUser that might be missing or undefined
    // based on what's expected vs what might be in currentUserData.value initially
    // e.g., banned_at: currentUserData.value.banned_at === undefined ? null : currentUserData.value.banned_at,
  };
  return user;
});

// Fetch branch data if user has a branch_id
onMounted(async () => {
  try {
    // Check if we need to fetch the user profile first
    if (!authStore.currentUser) {
      await authStore.fetchProfile()
    }
    
    // Fetch branch data if needed
    if (authStore.currentUser?.branch_id && authStore.token) {
      const branchId = authStore.currentUser.branch_id
      
      const response = await apiService.get<{data: BranchData}>(`/api/branches/${branchId}`, authStore.token)
      branchData.value = response.data
    }
  } catch (error) {
    console.error('Error fetching branch data:', error)
  }
})
</script>
