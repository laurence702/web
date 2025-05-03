<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <BaseInput
      label="Full Name"
      v-model="formData.name"
      placeholder="Enter admin's full name"
      required
      :error="formErrors.name"
    />
    <BaseInput
      label="Email Address"
      v-model="formData.email"
      type="email"
      placeholder="admin@example.com"
      :disabled="isEditMode"
      required
      :error="formErrors.email"
    />
    <BaseInput
      label="Branch ID"
      v-model="formData.branchId"
      placeholder="Enter assigned branch ID (e.g., branch_01)"
      :required="!isEditMode"
      :error="formErrors.branchId"
    />

    <hr v-if="isEditMode" class="my-6 border-gray-200 dark:border-gray-700">
    <p v-if="isEditMode" class="text-sm text-gray-600 dark:text-gray-400">
      Only fill password fields below if you want to change the admin's password.
    </p>

    <BaseInput
      label="Password"
      v-model="formData.password"
      type="password"
      placeholder="Enter password"
      :required="!isEditMode"
      :error="formErrors.password"
    />
    <BaseInput
      label="Confirm Password"
      v-model="formData.confirmPassword"
      type="password"
      placeholder="Confirm password"
      :required="!isEditMode || !!formData.password"
      :error="formErrors.confirmPassword"
    />

    <div class="pt-2">
       <button type="submit" class="btn btn-primary w-full">
         {{ isEditMode ? 'Update Admin' : 'Create Admin' }}
       </button>
    </div>

  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import BaseInput from '@/components/common/BaseInput.vue';

// Define the structure for the form data and potential initial data
type AdminFormData = {
  id?: string;
  name: string;
  email: string;
  branchId: string;
  password?: string | null; // Revert to optional
  confirmPassword?: string | null;
};

type FormErrors = Partial<Record<keyof Omit<AdminFormData, 'id'>, string>>;

const props = defineProps({
  initialData: {
    type: Object as PropType<Partial<AdminFormData>>,
    default: () => ({})
  }
});

const emit = defineEmits(['submit']);

const isEditMode = computed(() => !!props.initialData?.id);

// Initialize with empty strings or null
const formData = ref<AdminFormData>({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  branchId: props.initialData?.branchId || '',
  password: '', // Ensure initialized as string
  confirmPassword: '', // Ensure initialized as string
  ...(props.initialData?.id && { id: props.initialData.id })
});

const formErrors = ref<FormErrors>({});

// Watch for initialData changes
watch(() => props.initialData, (newData) => {
  formData.value = {
    name: newData?.name || '',
    email: newData?.email || '',
    branchId: newData?.branchId || '',
    password: '', // Reset passwords to empty string
    confirmPassword: '', // Reset passwords to empty string
    ...(newData?.id && { id: newData.id })
  };
  formErrors.value = {};
}, { deep: true });

const validateForm = (): boolean => {
    formErrors.value = {};
    let isValid = true;

    if (!formData.value.name) {
        formErrors.value.name = 'Name is required.';
        isValid = false;
    }
    if (!formData.value.email) {
        formErrors.value.email = 'Email is required.';
        isValid = false;
    }
    if (!isEditMode.value && !formData.value.branchId) {
        formErrors.value.branchId = 'Branch ID is required.';
        isValid = false;
    }

    const requiresPassword = !isEditMode.value || !!formData.value.password;
    if (requiresPassword) {
        if (!formData.value.password) {
            formErrors.value.password = 'Password is required.';
            isValid = false;
        } else if (formData.value.password.length < 6) {
            formErrors.value.password = 'Password must be at least 6 characters.';
            isValid = false;
        }
        if (formData.value.password && !formData.value.confirmPassword) {
             formErrors.value.confirmPassword = 'Please confirm password.';
             isValid = false;
        } else if (formData.value.password !== formData.value.confirmPassword) {
            formErrors.value.confirmPassword = 'Passwords do not match.';
            isValid = false;
        }
    }

    return isValid;
};

const submitForm = () => {
  if (validateForm()) {
    // Create a base object without password/confirmPassword
    const dataToSubmit: Omit<AdminFormData, 'password' | 'confirmPassword'> & { password?: string } = {
        id: formData.value.id,
        name: formData.value.name,
        email: formData.value.email,
        branchId: formData.value.branchId,
    };

    // Add password only if it was set/changed
    if (formData.value.password) {
        dataToSubmit.password = formData.value.password;
    }

    emit('submit', dataToSubmit);
  }
};

</script> 