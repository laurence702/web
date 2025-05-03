<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Super Admin Dashboard" />

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <StatsCard
        title="Total Income"
        :value="formatCurrency(stats.totalIncome)"
        change="+12.5%"
        changeType="increase"
      />
       <StatsCard
        title="Total Outstanding Debts"
        :value="formatCurrency(stats.totalDebt)"
        viewLink="/admin/debts"
      />
       <StatsCard
        title="Total Transactions"
        :value="stats.totalTransactions"
        change="-1.8%"
        changeType="decrease"
      />
       <StatsCard
        title="Active Riders"
        :value="stats.activeRiders"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
       <div class="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Income Overview</h3>
          <VueApexCharts
            type="line"
            height="350"
            :options="incomeChartOptions"
            :series="incomeChartSeries"
          ></VueApexCharts>
       </div>
       <div class="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
         <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Branch Performance</h3>
          <VueApexCharts
            type="bar"
            height="350"
            :options="branchChartOptions"
            :series="branchChartSeries"
          ></VueApexCharts>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import StatsCard from '@/components/common/StatsCard.vue';
// Import chart component
import VueApexCharts from 'vue3-apexcharts';

// Mock Stats Data
const stats = ref({
  totalIncome: 1250000,
  totalDebt: 185000,
  totalTransactions: 1567,
  activeRiders: 245,
});

// Helper function for currency formatting (adjust as needed)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

// --- Chart Data and Options ---

// Income Overview Chart (Line)
const incomeChartOptions = ref({
  chart: {
    id: 'income-overview-chart',
    type: 'line',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example months
    labels: { style: { colors: '#8E95A9' } } // Adjust label color for dark mode potentially
  },
  yaxis: {
    title: { text: 'Income (NGN)' },
     labels: { style: { colors: '#8E95A9' } }
  },
   stroke: {
     curve: 'smooth'
   },
    markers: {
      size: 4
    },
     tooltip: {
       theme: 'dark' // Or use a computed prop based on uiStore dark mode
     },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
       theme: {
         mode: 'light' // TODO: Link this to dark mode state
       }
});

const incomeChartSeries = ref([
  {
    name: 'Total Income',
    data: [850000, 920000, 1100000, 1050000, 1300000, 1250000], // Example data
  },
]);

// Branch Performance Chart (Bar)
const branchChartOptions = ref({
  chart: {
    id: 'branch-performance-chart',
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: { enabled: false }, // Keep it clean
  xaxis: {
    categories: ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E'], // Example branches
     labels: { style: { colors: '#8E95A9' } }
  },
  yaxis: {
    title: { text: 'Transactions' },
     labels: { style: { colors: '#8E95A9' } }
  },
  tooltip: {
     theme: 'dark'
   },
    grid: {
      borderColor: '#e7e7e7',
      row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
    },
     theme: {
       mode: 'light' // TODO: Link this to dark mode state
     }
});

const branchChartSeries = ref([
  {
    name: 'Transaction Volume',
    data: [450, 620, 380, 510, 490], // Example data
  },
]);

// TODO: Make chart theme dynamic based on dark mode
// import { useUiStore } from '@/stores/ui';
// const uiStore = useUiStore();
// const chartTheme = computed(() => uiStore.isDarkMode ? 'dark' : 'light');
// Watch chartTheme and update chart options dynamically or pass theme prop

</script> 