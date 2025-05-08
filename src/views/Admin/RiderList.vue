<template>
  <div>
    <PageHeader title="All Riders" />
    <div class="mt-6">
      <RiderListComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue';
import RiderListComponent from '@/components/admin/RiderListComponent.vue';

// No additional logic needed for this simple wrapper view
</script> 