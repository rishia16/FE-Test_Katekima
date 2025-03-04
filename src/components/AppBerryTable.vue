<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBerryStore } from '@/stores/PiniaBerry.ts';
import Pagination from './AppPagination.vue';

const { t } = useI18n();
const berryStore = useBerryStore();

const searchQuery = ref(berryStore.searchQuery);
const currentPage = ref(berryStore.currentPage);
const itemsPerPage = ref(berryStore.itemsPerPage);

const berries = computed(() => berryStore.paginatedBerries);
const totalPages = computed(() => berryStore.totalPages);
const loading = computed(() => berryStore.loading);

const showDeleteModal = ref(false);
const berryToDelete = ref('');

const openDeleteModal = (name: string) => {
  berryToDelete.value = name;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  berryToDelete.value = '';
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const perPage = urlParams.get('perPage');
  const search = urlParams.get('search');

  if (page) {
    currentPage.value = parseInt(page);
    berryStore.setPage(currentPage.value);
  }

  if (perPage) {
    itemsPerPage.value = parseInt(perPage);
    berryStore.setItemsPerPage(itemsPerPage.value);
  }

  if (search) {
    searchQuery.value = search;
    berryStore.setSearchQuery(searchQuery.value);
  }

  berryStore.fetchBerries();
});

watch([currentPage, itemsPerPage, searchQuery], () => {
  const params = new URLSearchParams();
  params.set('page', currentPage.value.toString());
  params.set('perPage', itemsPerPage.value.toString());

  if (searchQuery.value) {
    params.set('search', searchQuery.value);
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);

  berryStore.setPage(currentPage.value);
  berryStore.setItemsPerPage(itemsPerPage.value);
  berryStore.setSearchQuery(searchQuery.value);
});

const onPageChange = (page: number) => {
  currentPage.value = page;
  berryStore.setPage(page);
};

const onItemsPerPageChange = (items: number) => {
  itemsPerPage.value = items;
  berryStore.setItemsPerPage(items);
};

const getBerryId = (url: string): number => {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1]) : 1;
};

const showSuccessAlert = ref(false);
const confirmDelete = () => {
  berryStore.deleteBerry(berryToDelete.value);
  showDeleteModal.value = false;
  showSuccessAlert.value = true;

  setTimeout(() => {
    showSuccessAlert.value = false;
  }, 3000);
};
</script>

<template>
  <div class="w-full p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-2xl shadow-2xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-extrabold text-gray-900">{{ t('table.title') }}</h2>
      <router-link :to="{ name: 'AddProduct' }" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-xl">
        {{ t('table.addButton') }}
      </router-link>
    </div>

    <div class="mb-8 flex items-center space-x-4">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('table.search')"
        class="w-full p-4 border border-purple-400 rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <template v-if="loading">
        <div class="animate-pulse">
          <div class="bg-gray-300 h-40 rounded-2xl"></div>
        </div>
      </template>
      <template v-else-if="berries.length === 0">
        <div class="col-span-full text-center text-gray-700 text-lg">{{ t('common.noData') }}</div>
      </template>
      <template v-else>
        <div v-for="(berry, index) in berries" :key="berry.name" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 hover:bg-blue-50">
          <h3 class="text-xl font-bold text-gray-800 capitalize">Name: {{ berry.name }}</h3>
          <div class="flex justify-between items-center mt-6">
            <span class="text-gray-700 font-medium">No: {{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
            <div class="flex space-x-3">
              <router-link :to="{ name: 'Detail', params: { name: berry.name } }" class="bg-green-100 text-green-600 hover:bg-green-200 font-semibold px-4 py-2 rounded-full shadow">{{ t('table.detail') }}</router-link>
              <router-link :to="{ name: 'EditProduct', params: { id: getBerryId(berry.url) } }" class="bg-yellow-200 text-yellow-700 hover:bg-yellow-300 font-semibold px-4 py-2 rounded-full shadow">{{ t('table.edit') }}</router-link>
              <button @click="openDeleteModal(berry.name)" class="bg-red-300 text-red-800 hover:bg-red-400 font-semibold px-4 py-2 rounded-full shadow">{{ t('table.delete') }}</button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :items-per-page="itemsPerPage"
      :items-per-page-options="[10, 30, 50]"
      @page-change="onPageChange"
      @items-per-page-change="onItemsPerPageChange"
    />

    <div v-if="showDeleteModal" class="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl w-1/3" @keydown.esc="closeDeleteModal" @keydown.enter="confirmDelete" tabindex="0" autofocus>
      <h3 class="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
      <p>Apakah Anda yakin ingin menghapus {{ berryToDelete }}?</p>
      <div class="flex justify-end space-x-4 mt-4">
        <button @click="closeDeleteModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded-full">Batal</button>
        <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded-full">Hapus</button>
      </div>
    </div>

    <div v-if="showSuccessAlert" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-2xl shadow-2xl space-x-2 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Berhasil menghapus {{ berryToDelete }}!</span>
    </div>
  </div>
</template>


<style scoped>
.material-icons {
  font-size: 24px;
}
</style>
