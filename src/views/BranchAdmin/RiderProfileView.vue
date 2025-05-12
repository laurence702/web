<template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
    
    <div v-else-if="error" class="space-y-5">
      <BaseCard>
        <div class="flex flex-col items-center justify-center p-10 text-center">
          <ExclamationCircleIcon class="h-16 w-16 text-error-500 mb-4" />
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">Error Loading Rider Profile</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error }}</p>
          <button
            @click="goBack"
            class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
          >
            Go Back
          </button>
        </div>
      </BaseCard>
    </div>
    
    <div v-else class="space-y-5">
      <!-- Rider Profile Card -->
      <BaseCard>
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            <!-- Profile Picture and QR Code -->
            <div class="flex flex-col items-center space-y-4 w-full md:w-1/3 lg:w-1/4">
              <div class="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img v-if="rider.user_profile?.profile_pic_url" :src="rider.user_profile.profile_pic_url" alt="Rider" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-3xl font-semibold text-gray-500 dark:text-gray-400">
                  {{ getInitials(rider.fullname) }}
                </div>
              </div>
              
              <div class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <img
                  :src="generateQRCode(rider.id)"
                  alt="Rider QR Code"
                  class="w-32 h-32 object-contain"
                />
                <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  Rider ID: {{ formatRiderId(rider.id) }}
                </p>
              </div>
              
              <div class="flex flex-col w-full space-y-2">
                <button
                  @click="openNewOrderModal"
                  class="flex justify-center items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
                >
                  <ShoppingCartIcon class="h-5 w-5 mr-2" />
                  Buy Product
                </button>
                
                <button
                  @click="viewPaymentHistory"
                  class="flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  <ClockIcon class="h-5 w-5 mr-2" />
                  Payment History
                </button>
              </div>
            </div>
            
            <!-- Profile Details -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2 class="text-2xl font-semibold text-gray-800 dark:text-white/90">{{ rider.fullname }}</h2>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ rider.user_profile?.vehicle_type ? capitalizeFirstLetter(rider.user_profile.vehicle_type) : 'Rider' }}
                  </p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <div
                    :class="{
                      'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': rider.verification_status === 'verified',
                      'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': rider.verification_status === 'pending',
                      'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': rider.verification_status === 'rejected'
                    }"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ capitalizeFirstLetter(rider.verification_status || 'pending') }}
                  </div>
                  
                  <div
                    v-if="rider.banned_at"
                    class="bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    Banned
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <PhoneIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.phone }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <EnvelopeIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.email }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <MapPinIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.user_profile?.address || 'No address provided' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Personal Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <IdentificationIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">NIN</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.user_profile?.nin || 'Not provided' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <TruckIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Vehicle Type</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.user_profile?.vehicle_type ? capitalizeFirstLetter(rider.user_profile.vehicle_type) : 'Not specified' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <CurrencyNairaIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Balance</p>
                        <p class="text-gray-800 dark:text-white/90">₦{{ formatAmount(rider.balance || 0) }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <CalendarIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Registered</p>
                        <p class="text-gray-800 dark:text-white/90">{{ formatDate(rider.created_at) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Guarantor Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <UserIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Name</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.user_profile?.guarantors_name || 'Not provided' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <PhoneIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Phone</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.user_profile?.guarantors_phone || 'Not provided' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <MapPinIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Address</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider.user_profile?.guarantors_address || 'Not provided' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  UserIcon, 
  IdentificationIcon, 
  TruckIcon, 
  CalendarIcon,
  ExclamationCircleIcon,
  ShoppingCartIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';
import apiService from '@/services/apiService';

// Define component name
defineOptions({
  name: 'BranchAdminRiderProfileView'
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const currentPageTitle = ref('Rider Profile');
const isLoading = ref(true);
const error = ref<string | null>(null);

// Define Rider interface
interface UserProfile {
  address?: string;
  vehicle_type?: string;
  nin?: string;
  guarantors_name?: string;
  guarantors_phone?: string;
  guarantors_address?: string;
  profile_pic_url?: string;
}

interface Rider {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  verification_status: string;
  user_profile: UserProfile | null;
  balance: number;
  banned_at?: string;
  created_at: string;
  updated_at: string;
}

// Rider data
const rider = ref<Rider>({
  id: '',
  fullname: '',
  email: '',
  phone: '',
  role: 'rider',
  verification_status: 'pending',
  user_profile: null,
  balance: 0,
  created_at: '',
  updated_at: ''
});

// CurrencyNairaIcon component
interface IconProps {
  class?: string;
}

const CurrencyNairaIcon = (props: IconProps) => {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    class: props.class
  }, [
    h('path', { d: 'M4 5h16M4 9h16M4 15h16M4 19h16M7 5v14M17 5v14' })
  ]);
};

// Load rider data
onMounted(async () => {
  const riderId = route.params.id as string;
  
  if (!riderId) {
    error.value = 'Rider ID not provided';
    isLoading.value = false;
    return;
  }
  
  try {
    isLoading.value = true;
    
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated');
    }
    
    // Define the response type
    interface RiderResponse {
      data: Rider;
    }
    
    const response = await apiService.get<RiderResponse>(`/api/users/${riderId}`, token);
    
    if (response && response.data) {
      rider.value = response.data;
      currentPageTitle.value = `Rider: ${rider.value.fullname}`;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err: unknown) {
    console.error('Error fetching rider data:', err);
    if (err instanceof Error) {
      error.value = err.message || 'Failed to load rider profile';
    } else {
      error.value = 'An unknown error occurred';
    }
  } finally {
    isLoading.value = false;
  }
});

// Utility functions
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatRiderId(id: string): string {
  if (!id) return 'N/A';
  return id.length > 8 ? id.slice(0, 8) + '...' : id;
}

function generateQRCode(id: string): string {
  // In a real app, we'd generate an actual QR code
  // For this mock, we'll return a placeholder image
  return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(id);
}

function openNewOrderModal() {
  // Would open the order modal in a real implementation
  alert('Order modal would open here. In a real implementation, this would show a modal to create a new order.');
}

function viewPaymentHistory() {
  // In a real app, we'd navigate to a payment history page
  // For now, we'll just log a message
  console.log('Viewing payment history for rider', rider.value.id);
  alert('Payment history would show here. In a real implementation, this would navigate to a payment history page.');
}

function goBack() {
  router.go(-1);
}
</script> 