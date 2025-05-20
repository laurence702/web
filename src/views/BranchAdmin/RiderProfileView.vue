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
      <!-- Alert Message for API responses -->
      <Alert 
        v-if="alertInfo.show" 
        :variant="alertInfo.type" 
        :title="alertInfo.title" 
        :message="alertInfo.message"
        :showLink="false"
        class="mb-4"
      />

      <!-- Eligibility Alert -->
      <Alert 
        v-if="Number(rider.balance) > 0" 
        variant="error" 
        title="Not Eligible for Purchase" 
        message="Please clear your debts before making a new purchase."
        :showLink="false"
      />

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
              
              <div v-if="rider.balance == 0" class="flex flex-col w-full space-y-2">
                <button
                  @click="openNewOrderModal"
                  class="flex justify-center items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
                  :disabled="Number(rider.balance) > 0"
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
                
                <div v-if="rider.banned_at" class="flex items-center space-x-2">
                  <div
                    class="bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500 px-3 py-1 rounded-full text-sm font-medium"
                  >
                   Rider has been Banned
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
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Unpaid Balance</p>
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

                    <div class="flex items-start">
                      <CheckBadgeIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                        <div
                          :class="{
                            'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': rider.verification_status === 'verified',
                            'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': rider.verification_status === 'pending',
                            'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': rider.verification_status === 'rejected'
                          }"
                          class="inline-block px-3 py-1 rounded-full text-sm font-medium mt-1"
                        >
                          {{ capitalizeFirstLetter(rider.verification_status || 'pending') }}
                        </div>
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

    <!-- Order Purchase Modal -->
    <Modal v-if="showOrderModal" :fullScreenBackdrop="true" @close="closeOrderModal">
      <template #body>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Order</h3>
            <button 
              @click="closeOrderModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          
          <!-- Modal Body - Order Form -->
          <div class="p-6">
            <form @submit.prevent="createOrder">
              <!-- Product Selection -->
              <div class="mb-4">
                <label for="product" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                <select 
                  id="product" 
                  v-model="orderForm.product" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  @change="handleProductChange"
                >
                  <option value="" disabled>Select a product</option>
                  <option value="pms">PMS (Premium Motor Spirit)</option>
                  <option value="cng">CNG (Compressed Natural Gas)</option>
                  <option value="lpg">LPG (Liquefied Petroleum Gas)</option>
                </select>
              </div>
              
              <!-- Payment Method -->
              <div class="mb-4">
                <label for="payment_method" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                <select 
                  id="payment_method" 
                  v-model="orderForm.payment_method" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="" disabled>Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              
              <!-- Payment Type -->
              <div class="mb-4">
                <label for="payment_type" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Type</label>
                <select 
                  id="payment_type" 
                  v-model="orderForm.payment_type" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  @change="handlePaymentTypeChange"
                >
                  <option value="" disabled>Select payment type</option>
                  <option value="full">Full Payment</option>
                  <option value="part">Partial Payment</option>
                </select>
              </div>
              
              <!-- Amount Due -->
              <div class="mb-4">
                <label for="amount_due" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Amount Due (₦)</label>
                <select 
                  id="amount_due" 
                  v-model="orderForm.amount_due" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  @change="handleAmountDueChange"
                >
                  <option value="" disabled>Select amount</option>
                  <option v-for="value in amountDueOptions" :key="value" :value="value">₦{{ formatAmount(value) }}</option>
                </select>
              </div>
              
              <!-- Amount Paid (for partial payment) -->
              <div class="mb-5" v-if="orderForm.payment_type === 'part'">
                <label for="amount_paid" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Amount Paid (₦)</label>
                <select 
                  id="amount_paid" 
                  v-model="orderForm.amount_paid" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="" disabled>Select amount</option>
                  <option v-for="value in availableAmountOptions" :key="value" :value="value">₦{{ formatAmount(value) }}</option>
                </select>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Balance: ₦{{ formatAmount(Number(orderForm.amount_due) - Number(orderForm.amount_paid || 0)) }}
                </p>
              </div>
              
              <!-- Submit Button -->
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="closeOrderModal"
                  class="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-md shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                  <span v-else>Create Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Payment History Modal -->
    <Modal v-if="showPaymentHistoryModal" :fullScreenBackdrop="true" @close="closePaymentHistoryModal">
      <template #body>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h3>
            <button 
              @click="closePaymentHistoryModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          
          <!-- Modal Body - Payment History -->
          <div class="p-6">
            <div v-if="isLoadingPayments" class="flex justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
            </div>
            
            <div v-else-if="paymentHistoryError" class="flex flex-col items-center justify-center p-6 text-center">
              <ExclamationCircleIcon class="h-12 w-12 text-error-500 mb-3" />
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Error Loading Payment History</h4>
              <p class="text-gray-500 dark:text-gray-400">{{ paymentHistoryError }}</p>
            </div>
            
            <div v-else-if="paymentHistory.length === 0" class="flex flex-col items-center justify-center p-10 text-center">
              <ClipboardDocumentIcon class="h-12 w-12 text-gray-400 mb-3" />
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">No Payment Records</h4>
              <p class="text-gray-500 dark:text-gray-400">This rider has not made any payments yet.</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="payment in paymentHistory" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ payment.product }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₦{{ formatAmount(payment.amount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{
                          'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': payment.status === 'completed',
                          'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': payment.status === 'pending',
                          'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': payment.status === 'failed'
                        }"
                      >
                        {{ capitalizeFirstLetter(payment.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(payment.created_at) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- See All Orders Link -->
            <div v-if="paymentHistory.length > 0" class="mt-4 text-right">
                <button 
                  @click="goToOrderHistoryForRider"
                  class="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 focus:outline-none"
                >
                  See all orders
                </button>
            </div>

          </div>
        </div>
      </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import Modal from '@/components/ui/Modal.vue';
import Alert from '@/components/ui/Alert.vue';
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
  ClockIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline';
import apiService from '@/services/apiService';
import { generateAmountOptions, generatePartialPaymentOptions } from '@/services/productRules';

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

function formatAmount(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.00'; // Or some other default like 'N/A'
  }
  return Number(amount).toLocaleString();
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

// Order Modal
const showOrderModal = ref(false);
const isSubmitting = ref(false);

// Alert Info
const alertInfo = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  title: '',
  message: ''
});

// Order Form
const orderForm = ref({
  product: '',
  payment_method: '',
  payment_type: '',
  amount_due: '' as string | number,
  amount_paid: '' as string | number
});

// Available amount options
const availableAmountOptions = ref<number[]>([]);
const amountDueOptions = ref<number[]>([]);

// Get rider's vehicle type 
function getRiderVehicleType(): string {
  return rider.value?.user_profile?.vehicle_type || 'other';
}

// Handle product change
function handleProductChange() {
  // Reset amount-related fields
  orderForm.value.amount_due = '';
  orderForm.value.amount_paid = '';
  
  // Generate amount due options based on product and vehicle type
  const vehicleType = getRiderVehicleType();
  amountDueOptions.value = generateAmountOptions(orderForm.value.product, vehicleType);
  
  // Clear partial payment options until amount_due is selected
  availableAmountOptions.value = [];
}

// Handle payment type change
function handlePaymentTypeChange() {
  if (orderForm.value.payment_type === 'full') {
    orderForm.value.amount_paid = orderForm.value.amount_due;
  } else if (orderForm.value.payment_type === 'part') {
    orderForm.value.amount_paid = '';
    // Generate options based on amount due, product, and vehicle type
    updatePartialPaymentOptions();
  }
}

// Handle amount due change
function handleAmountDueChange() {
  if (orderForm.value.payment_type === 'full') {
    orderForm.value.amount_paid = orderForm.value.amount_due;
  } else if (orderForm.value.payment_type === 'part') {
    orderForm.value.amount_paid = '';
    // Regenerate partial payment options
    updatePartialPaymentOptions();
  }
}

// Update partial payment options based on amount due, product, and vehicle type
function updatePartialPaymentOptions() {
  const fullAmount = Number(orderForm.value.amount_due);
  if (fullAmount > 0 && orderForm.value.product) {
    const vehicleType = getRiderVehicleType();
    availableAmountOptions.value = generatePartialPaymentOptions(
      fullAmount, 
      orderForm.value.product, 
      vehicleType
    );
  } else {
    availableAmountOptions.value = [];
  }
}

// Open and close modal functions
function openNewOrderModal() {
  showOrderModal.value = true;
  
  // Reset form fields
  orderForm.value = {
    product: '',
    payment_method: '',
    payment_type: '',
    amount_due: '',
    amount_paid: ''
  };
  
  // Reset options
  amountDueOptions.value = [];
  availableAmountOptions.value = [];
}

function closeOrderModal() {
  showOrderModal.value = false;
}

// Create a new order
async function createOrder() {
  try {
    isSubmitting.value = true;
    
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated');
    }
    
    // Prepare order data
    const orderData = {
      payer_id: rider.value.id,
      ...orderForm.value
    };
    
    console.log('orderData', orderData);
    // Make API call to create order
    await apiService.post('/api/branch-admin/orders', orderData, token);
    
    // Show success message
    alertInfo.value = {
      show: true,
      type: 'success',
      title: 'Order Created',
      message: `Order for ${orderForm.value.product} has been created successfully.`
    };
    
    // Close modal
    closeOrderModal();
    
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      alertInfo.value.show = false;
    }, 5000);
    
  } catch (err: unknown) {
    console.error('Error creating order:', err);
    
    // Show error message
    alertInfo.value = {
      show: true,
      type: 'error',
      title: 'Order Creation Failed',
      message: err instanceof Error ? err.message : 'An unknown error occurred'
    };
    
  } finally {
    isSubmitting.value = false;
  }
}

// Payment History Modal
const showPaymentHistoryModal = ref(false);
const isLoadingPayments = ref(false);
const paymentHistoryError = ref<string | null>(null);

// Define Payment interface
interface Payment {
  id: string;
  order_id: string;
  rider_id: string;
  product: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

// Payment history
const paymentHistory = ref<Payment[]>([]);

async function viewPaymentHistory() {
  showPaymentHistoryModal.value = true;
  await fetchPaymentHistory();
}

async function fetchPaymentHistory() {
  try {
    isLoadingPayments.value = true;
    paymentHistoryError.value = null;
    
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated');
    }
    
    // Make real API call to fetch payment history
    const response = await apiService.get<{ data: Payment[] }>(
      `/api/payment-histories?rider_id=${rider.value.id}`, 
      token
    );
    
    if (response && response.data) {
      paymentHistory.value = response.data;
    } else {
      paymentHistory.value = [];
    }
    
  } catch (err: unknown) {
    console.error('Error fetching payment history:', err);
    paymentHistoryError.value = err instanceof Error ? err.message : 'An unknown error occurred';
    paymentHistory.value = []; // Reset to empty array on error
  } finally {
    isLoadingPayments.value = false;
  }
}

// Close payment history modal
function closePaymentHistoryModal() {
  showPaymentHistoryModal.value = false;
}

// Navigate to Order History page for this rider
function goToOrderHistoryForRider() {
  router.push({
    path: '/branch-admin/order-history',
    query: { rider_id: rider.value.id }
  });
}

function goBack() {
  router.go(-1);
}
</script>