<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/PiniaProduct.ts';
import type { Product } from '../types/Product.ts';
import SkeletonLoader from './AppSkelektonLoader.vue';

const { t } = useI18n();
const router = useRouter();
const productStore = useProductStore();

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  productId: {
    type: [Number, String],
    default: null
  }
});

const formData = ref<Product>({
  title: '',
  price: 0,
  description: '',
  image: '',
  category: ''
});

onMounted(async () => {
  if (props.isEdit && props.productId) {
    const id = typeof props.productId === 'string' ? parseInt(props.productId) : props.productId;
    await productStore.fetchProduct(id);

    if (productStore.product) {
      formData.value = { ...productStore.product };
    }
  } else {
    const id = Math.floor(Math.random() * 20 + 1);
    await productStore.fetchProduct(typeof id === 'string' ? parseInt(id) : id);
    if (productStore.product) {
      formData.value = { ...productStore.product };
    }
  }
});

const submitForm = async () => {
  if (props.isEdit && props.productId) {
    const id = typeof props.productId === 'string' ? parseInt(props.productId) : props.productId;
    const success = await productStore.updateProduct(id, formData.value);

    if (success) {
      setTimeout(() => {
        router.push({ name: 'Home' });
      }, 2000);
    }
  } else {
    const success = await productStore.addProduct(formData.value);

    if (success) {
      formData.value = {
        title: '',
        price: 0,
        description: '',
        image: '',
        category: ''
      };

      setTimeout(() => {
        router.push({ name: 'Home' });
      }, 2000);
    }
  }
};
</script>

<template>
  <div class="w-full p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-2xl shadow-2xl">
    <form @submit.prevent="submitForm" class="space-y-6 p-6 bg-white rounded-2xl shadow-xl">
      <div v-if="productStore.addSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ t(isEdit ? 'product.edit.success' : 'product.add.success') }}
      </div>
      <button
            type="button"
            @click="router.push({ name: 'Home' })"
            class="px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            {{ t('product.form.cancel') }}
          </button>
      <div v-if="productStore.loading">
        <SkeletonLoader type="form" />
      </div>
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              {{ t('product.form.title') }} *
            </label>
            <div class="relative mt-1">
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                :placeholder="t('product.form.titlePlaceholder')"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border pl-10"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">📦</span>
            </div>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">
              {{ t('product.form.price') }} *
            </label>
            <div class="relative mt-1">
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                required
                step="0.01"
                min="0"
                :placeholder="t('product.form.pricePlaceholder')"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border pl-10"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">💲</span>
            </div>
          </div>

          <div class="col-span-1 md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">
              {{ t('product.form.description') }} *
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              required
              rows="4"
              :placeholder="t('product.form.descriptionPlaceholder')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            ></textarea>
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              {{ t('product.form.image') }} *
            </label>
            <div class="relative mt-1">
              <input
                id="image"
                v-model="formData.image"
                type="text"
                required
                :placeholder="t('product.form.imagePlaceholder')"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border pl-10"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">🖼️</span>
            </div>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">
              {{ t('product.form.category') }} *
            </label>
            <div class="relative mt-1">
              <input
                id="category"
                v-model="formData.category"
                type="text"
                required
                :placeholder="t('product.form.categoryPlaceholder')"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border pl-10"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">📁</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          >
            {{ t('product.form.submit') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Optional: Add any additional styles here */
</style>

