<template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
    
    <div v-else class="space-y-5">
      <!-- Overview Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <BaseCard>
          <div class="flex flex-col p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Total Riders</h5>
              <UserCircleIcon class="h-8 w-8 text-brand-500" />
            </div>
            <div class="text-3xl font-bold text-gray-800 dark:text-white/90">{{ branchStats.totalRiders || 0 }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span class="font-medium text-success-500">+{{ branchStats.newRidersThisMonth || 0 }}</span> new this month
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex flex-col p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Active Orders</h5>
              <ClipboardDocumentListIcon class="h-8 w-8 text-brand-500" />
            </div>
            <div class="text-3xl font-bold text-gray-800 dark:text-white/90">{{ branchStats.activeOrders || 0 }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span class="font-medium text-success-500">{{ branchStats.completionRate || '0%' }}</span> completion rate
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex flex-col p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Weekly Revenue</h5>
              <BanknotesIcon class="h-8 w-8 text-brand-500" />
            </div>
            <div class="text-3xl font-bold text-gray-800 dark:text-white/90">₦{{ formatAmount(branchStats.weeklyRevenue) }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span class="font-medium" :class="branchStats.revenueChange > 0 ? 'text-success-500' : 'text-error-500'">
                {{ branchStats.revenueChange > 0 ? '+' : '' }}{{ branchStats.revenueChange || 0 }}%
              </span> compared to last week
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex flex-col p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Pending Approvals</h5>
              <ClockIcon class="h-8 w-8 text-brand-500" />
            </div>
            <div class="text-3xl font-bold text-gray-800 dark:text-white/90">{{ branchStats.pendingApprovals || 0 }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <router-link to="/admin/registration-approval" class="text-brand-500 hover:underline">View all</router-link>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Branch Information -->
      <BaseCard>
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Branch Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="branchData">
              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Branch Name</h3>
                <p class="text-gray-800 dark:text-white/90">{{ branchData.name }}</p>
              </div>
              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h3>
                <p class="text-gray-800 dark:text-white/90">{{ branchData.location }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Number</h3>
                <p class="text-gray-800 dark:text-white/90">{{ branchData.branch_phone }}</p>
              </div>
            </div>
            <div v-if="branchData && branchData.branch_admin">
              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Branch Manager</h3>
                <p class="text-gray-800 dark:text-white/90">{{ branchData.branch_admin.fullname }}</p>
              </div>
              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Manager Email</h3>
                <p class="text-gray-800 dark:text-white/90">{{ branchData.branch_admin.email }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Manager Phone</h3>
                <p class="text-gray-800 dark:text-white/90">{{ branchData.branch_admin.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Recent Activities -->
      <BaseCard>
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Recent Activities</h2>
            <router-link to="/admin/orders" class="text-sm text-brand-500 hover:underline">View All</router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rider
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(activity, index) in recentActivities" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.type }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {{ getInitials(activity.rider) }}
                        </span>
                      </div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.rider }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">₦{{ formatAmount(activity.amount) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{
                        'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': activity.status === 'Completed',
                        'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': activity.status === 'Pending',
                        'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': activity.status === 'Failed'
                      }"
                    >
                      {{ activity.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ activity.date }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BaseCard>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { UserCircleIcon, ClipboardDocumentListIcon, BanknotesIcon, ClockIcon } from '@heroicons/vue/24/solid';
import apiService from '@/services/apiService';

// Define component name
defineOptions({
  name: 'BranchAdminDashboard'
});

const currentPageTitle = ref('Branch Dashboard');
const isLoading = ref(true);
const authStore = useAuthStore();

const branchStats = ref({
  totalRiders: 0,
  newRidersThisMonth: 0,
  activeOrders: 0,
  completionRate: '0%',
  weeklyRevenue: 0,
  revenueChange: 0,
  pendingApprovals: 0
});

// Mock data for recent activities - this would be replaced with API data
const recentActivities = ref([
  {
    type: 'Fuel Purchase',
    rider: 'John Doe',
    amount: 15000,
    status: 'Completed',
    date: '2023-05-15'
  },
  {
    type: 'Registration',
    rider: 'Jane Smith',
    amount: 5000,
    status: 'Pending',
    date: '2023-05-14'
  },
  {
    type: 'Fuel Purchase',
    rider: 'Michael Johnson',
    amount: 12000,
    status: 'Completed',
    date: '2023-05-13'
  },
  {
    type: 'Payment',
    rider: 'Chris Wilson',
    amount: 8000,
    status: 'Failed',
    date: '2023-05-12'
  },
  {
    type: 'Fuel Purchase',
    rider: 'Sarah Taylor',
    amount: 10000,
    status: 'Completed',
    date: '2023-05-11'
  }
]);

// Define the branch data interface
interface BranchDataType {
  id: number;
  name: string;
  location: string;
  branch_phone: string;
  branch_admin?: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
  };
}

interface BranchResponse {
  data: BranchDataType;
}

const branchData = ref<BranchDataType | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    
    // Fetch branch data
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated');
    }
    
    // Assuming the admin is associated with the branch ID 1
    // In a real app, we'd get this from the user's profile or the API
    const branchId = authStore.currentUser?.branch_id || 1;
    
    const response = await apiService.get<BranchResponse>(`/branches/${branchId}`, token);
    
    // Extract the branch data from the response
    branchData.value = response.data;

    // For now, we'll use mock data for the statistics
    // In a real app, we'd fetch this from a dedicated endpoint
    branchStats.value = {
      totalRiders: 42,
      newRidersThisMonth: 8,
      activeOrders: 15,
      completionRate: '89%',
      weeklyRevenue: 250000,
      revenueChange: 12,
      pendingApprovals: 7
    };
    
  } catch (error) {
    console.error('Error fetching branch data:', error);
    // Handle error appropriately (show notification, etc.)
  } finally {
    isLoading.value = false;
  }
});

function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}
</script> 