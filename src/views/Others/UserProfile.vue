<template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
      <profile-card :user="authStore.currentUser" :branch="branchData" v-if="authStore.currentUser && branchData"/>
      <personal-info-card :user="authStore.currentUser" :branch="branchData" v-if="authStore.currentUser && branchData"/>
      <address-card :user="authStore.currentUser" :branch="branchData" v-if="authStore.currentUser && branchData"/>
    </div>
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted } from 'vue'
import ProfileCard from '../../components/profile/ProfileCard.vue'
import PersonalInfoCard from '../../components/profile/PersonalInfoCard.vue'
import AddressCard from '../../components/profile/AddressCard.vue'
import { useAuthStore } from '@/stores/auth'
import { apiService } from '@/services/apiService'

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
}

const currentPageTitle = ref('User Profile')
const authStore = useAuthStore()
const branchData = ref<BranchData | null>(null)

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
