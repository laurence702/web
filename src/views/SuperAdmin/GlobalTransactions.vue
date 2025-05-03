<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Global Transactions">
       <template #actions>
         <!-- Placeholder for Filters/Search/Export -->
         <div class="flex items-center space-x-2">
            <input type="text" placeholder="Search Txn ID or User..." class="form-input form-input-sm w-48">
            <button class="btn btn-secondary">Filter</button>
            <button class="btn btn-outline">Export</button>
         </div>
       </template>
    </PageHeader>

    <BaseTable
      :columns="columns"
      :data="transactions"
      :loading="loading"
      :totalItems="transactions.length"
      :showPagination="true"
    >
      <!-- Client-side for now -->
       <!-- Custom Status Cell -->
      <template #cell-status="{ row }">
        <span
          :class="[
            'px-2 py-0.5 rounded text-xs font-medium capitalize',
             getStatusClass(row.status as string)
          ]"
        >
          {{ (row.status as string)?.replace('_', ' ') }}
        </span>
      </template>

       <!-- Custom Amount Cell -->
       <template #cell-amount="{ value }">
           {{ formatCurrency(value as number) }}
       </template>

        <!-- Custom Date Cell -->
       <template #cell-date="{ value }">
           {{ formatDate(value as string) }}
       </template>

       <!-- Actions -->
      <template #actions="{ row }">
        <div class="flex justify-end space-x-2">
          <button @click="viewTransaction(row.id as string)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">View</button>
        </div>
      </template>
    </BaseTable>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseTable from '@/components/common/BaseTable.vue';
import transactionsData from '@/mockData/transactions.json';

const loading = ref(false);
const transactions = ref(transactionsData);

const columns = ref([
  { key: 'id', label: 'Txn ID', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'userName', label: 'User Name', sortable: true },
  { key: 'branchName', label: 'Branch', sortable: true },
  { key: 'productName', label: 'Product' },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]);

// Helper to get status badge class
const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
    case 'pending approval':
    case 'pending_payment':
    case 'pending payment':
       return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Helper function for currency formatting
const formatCurrency = (value: number | unknown): string => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

// Helper function for date formatting
const formatDate = (dateString: string | unknown): string => {
  if (typeof dateString !== 'string' || !dateString) return 'Invalid Date';
  try {
       const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
       return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
       return 'Invalid Date';
  }
};

// Action Handlers
const viewTransaction = (id: string) => {
  console.log('View Transaction:', id);
  alert('View transaction details functionality not implemented yet.');
}

</script>

<style scoped>
/* Scoped styles, including basic button styles if needed */
.form-input-sm {
    @apply h-9 text-sm;
}
.form-input {
  @apply block w-full rounded-md border border-gray-300 bg-transparent px-3 py-1.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:bg-gray-800;
}
.btn {
    @apply px-3 py-1.5 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
}
.btn-secondary {
    @apply bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500;
}
.btn-outline {
     @apply bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-brand-500;
}
</style>
