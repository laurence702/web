<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Admin Management">
      <template #actions>
        <button @click="openCreateModal" class="btn btn-primary">
          Create Admin
        </button>
      </template>
    </PageHeader>

    <BaseTable
        :columns="columns"
        :data="admins"
        :loading="loading"
        :totalItems="admins.length"
        :showPagination="true"
      >
      <!-- Assuming client-side data for now -->
      <!-- Custom cell rendering -->
      <template #cell-status="{ row }">
        <!-- ... status badge ... -->
         <span
          :class="[
            'px-2 py-0.5 rounded text-xs font-medium',
            row.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
            row.status === 'banned' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          {{ row.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #actions="{ row }">
        <div class="flex justify-end space-x-2">
          <button @click="viewAdmin(row.id as string)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">View</button>
          <button @click="openEditModal(row as AdminUser)" class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm">Edit</button>
          <button v-if="row.status !== 'banned'" @click="banAdmin(row.id as string)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm">Ban</button>
           <button v-else @click="unbanAdmin(row.id as string)" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm">Unban</button>
        </div>
      </template>
    </BaseTable>

    <!-- Create Admin Modal -->
    <BaseModal v-model="showCreateAdminModal" title="Create New Admin">
       <template #body>
          <AdminForm @submit="handleCreateAdmin" />
       </template>
    </BaseModal>

    <!-- Edit Admin Modal -->
     <BaseModal v-model="showEditAdminModal" title="Edit Admin">
       <template #body>
          <AdminForm
            :initialData="editingAdminData"
            @submit="handleUpdateAdmin"
          />
       </template>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseTable from '@/components/common/BaseTable.vue';
import BaseModal from '@/components/common/BaseModal.vue'; // Import BaseModal
import AdminForm from '@/components/SuperAdmin/AdminForm.vue'; // Import AdminForm
import allUsers from '@/mockData/users.json';

// Define Admin type based on user structure
type AdminUser = {
    id: string;
    email: string;
    role: string;
    name: string;
    branchId?: string;
    status: 'active' | 'banned';
};

// --- Table State & Data ---
const loading = ref(false);
const admins = ref<AdminUser[]>(
    allUsers
        .filter(user => user.role === 'branchAdmin')
        .map(admin => ({
            ...admin,
            status: (admin.status || 'active') as 'active' | 'banned'
        }))
);

const columns = ref([
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'branchId', label: 'Branch ID', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]);

// --- Modal State ---
const showCreateAdminModal = ref(false);
const showEditAdminModal = ref(false);
const editingAdminData = ref<Partial<AdminUser> | undefined>(undefined);

// --- Modal Openers ---
const openCreateModal = () => {
    editingAdminData.value = undefined; // Clear editing state
    showCreateAdminModal.value = true;
}

const openEditModal = (admin: AdminUser) => {
    editingAdminData.value = { ...admin }; // Pass admin data to form
    showEditAdminModal.value = true;
}

// --- Form Submission Handlers ---
const handleCreateAdmin = (formData: Omit<AdminUser, 'status' | 'role'> & { password?: string }) => {
    console.log("Create Admin Data:", formData);
    // Mock adding to the list
    const newAdmin: AdminUser = {
        ...formData,
        id: `admin_${Math.random().toString(36).substring(2, 9)}`, // Mock ID
        role: 'branchAdmin',
        status: 'active'
    };
    admins.value.unshift(newAdmin); // Add to beginning of list
    showCreateAdminModal.value = false; // Close modal
    alert('Mock: Admin created successfully!');
}

const handleUpdateAdmin = (formData: Partial<AdminUser> & { password?: string }) => {
     console.log("Update Admin Data:", formData);
     const index = admins.value.findIndex(a => a.id === formData.id);
     if (index !== -1) {
         // Update existing admin data - carefully merge
         admins.value[index] = {
             ...admins.value[index], // Keep existing data like status, role
             name: formData.name || admins.value[index].name,
             email: formData.email || admins.value[index].email, // Should ideally not change
             branchId: formData.branchId || admins.value[index].branchId,
             // Password handling would be done server-side usually
         };
        alert('Mock: Admin updated successfully!');
     } else {
         alert('Error: Could not find admin to update.');
     }
     showEditAdminModal.value = false; // Close modal
     editingAdminData.value = undefined; // Clear editing state
}

// --- Action Handlers ---
const viewAdmin = (id: string) => {
  console.log('View admin:', id);
  alert('View functionality not implemented yet.')
};

const banAdmin = (id: string) => {
  console.log('Ban admin:', id);
  const adminIndex = admins.value.findIndex(a => a.id === id);
  if (adminIndex !== -1) {
    admins.value[adminIndex].status = 'banned';
    alert(`Admin ${id} banned (mock).`);
  }
};

const unbanAdmin = (id: string) => {
    console.log('Unban admin:', id);
    const adminIndex = admins.value.findIndex(a => a.id === id);
    if (adminIndex !== -1) {
      admins.value[adminIndex].status = 'active';
      alert(`Admin ${id} unbanned (mock).`);
    }
};

</script>

<style scoped>
/* Add simple button styling if not globally available */
/* .btn {
    @apply px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
}
.btn-primary {
    @apply bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500;
} */
</style>
