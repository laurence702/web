<template>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div class="col-span-12 space-y-6 xl:col-span-5">
      <ecommerce-metrics />
      <monthly-target />
    </div>
    <div class="col-span-12 xl:col-span-7">
      <recent-orders />
    </div>

    <div class="col-span-12">
      <statistics-chart />
    </div>

    <div class="col-span-12 xl:col-span-5">
      <customer-demographic />
    </div>

    <div class="col-span-12 xl:col-span-7">
      <recent-orders />
    </div>
  </div>
</template>

<script lang="ts">
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
export default {
  components: {
    EcommerceMetrics,
    MonthlyTarget,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Ecommerce',
}
</script>
