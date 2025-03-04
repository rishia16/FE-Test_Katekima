<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useBerryStore } from '../stores/PiniaBerry.ts';
import SkeletonLoader from '../components/AppSkelektonLoader.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const berryStore = useBerryStore();

const selectedBerryName = ref('');
const berries = computed(() => berryStore.berries);
const berryDetails = computed(() => berryStore.selectedBerry);
const loading = computed(() => berryStore.loading);

// Load data on component mount
onMounted(async () => {
  if (berries.value.length === 0) {
    await berryStore.fetchBerries();
  }

  const berryName = route.params.name as string;
  if (berryName) {
    selectedBerryName.value = berryName;
    await berryStore.fetchBerryDetails(berryName);
  }
});

const fetchBerryDetails = async () => {
  if (selectedBerryName.value) {
    router.push({ name: 'Detail', params: { name: selectedBerryName.value } });
    await berryStore.fetchBerryDetails(selectedBerryName.value);
  }
};
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-purple-800 mb-6">{{ t('detail.title') }}</h1>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          v-model="selectedBerryName"
          class="border border-gray-300 rounded px-3 py-2 mb-2 md:mb-0 md:flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option v-for="berry in berries" :key="berry.name" :value="berry.name">
            {{ berry.name }}
          </option>
        </select>
        <button
          @click="fetchBerryDetails"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md"
        >
          {{ t('detail.moveButton') }}
        </button>
      </div>

      <div v-if="loading">
        <SkeletonLoader type="detail" />
      </div>

      <div v-else-if="berryDetails">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.id') }}</div>
            <div class="text-gray-600">{{ berryDetails.id }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.name') }}</div>
            <div class="text-gray-600">{{ berryDetails.name }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.growthTime') }}</div>
            <div class="text-gray-600">{{ berryDetails.growth_time }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.maxHarvest') }}</div>
            <div class="text-gray-600">{{ berryDetails.max_harvest }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.naturalGiftPower') }}</div>
            <div class="text-gray-600">{{ berryDetails.natural_gift_power }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.size') }}</div>
            <div class="text-gray-600">{{ berryDetails.size }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.smoothness') }}</div>
            <div class="text-gray-600">{{ berryDetails.smoothness }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.soilDryness') }}</div>
            <div class="text-gray-600">{{ berryDetails.soil_dryness }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.firmness') }}</div>
            <div class="text-gray-600">{{ berryDetails.firmness.name }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.item') }}</div>
            <div class="text-gray-600">{{ berryDetails.item.name }}</div>
          </div>

          <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md">
            <div class="font-bold text-gray-700">{{ t('detail.properties.naturalGiftType') }}</div>
            <div class="text-gray-600">{{ berryDetails.natural_gift_type.name }}</div>
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
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        {{ t('common.noData') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px; /* Limit the width for better readability */
  background: url('/path/to/your/background-pattern.png') no-repeat center center fixed; /* Optional background pattern */
  background-size: cover; /* Optional background size */
}
</style>
