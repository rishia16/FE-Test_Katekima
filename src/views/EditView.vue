<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ProductForm from '../components/AppForm.vue';

const { t } = useI18n();

defineProps<{
  id: string;
}>();
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">{{ t('product.edit.title') }}</h1>
    <div class="bg-yellow-400 rounded-lg shadow-md p-6">
      <ProductForm :is-edit="true" :product-id="id" />
    </div>
  </div>
</template>
