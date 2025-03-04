<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ProductForm from '../components/AppForm.vue';

const { t } = useI18n();
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ t('product.add.title') }}</h1>
    <div class="bg-yellow-300 rounded-lg shadow-lg p-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">{{ t('product.add.subtitle') }}</h2>
      <ProductForm />
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add custom styles if needed */
.container {
  max-width: 800px; /* Limit the width for better readability */
}
</style>
