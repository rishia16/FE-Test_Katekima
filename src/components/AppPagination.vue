<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  itemsPerPageOptions: {
    type: Array as () => number[],
    default: () => [10, 30, 50]
  }
});

const emit = defineEmits(['page-change', 'items-per-page-change']);

const localItemsPerPage = ref(props.itemsPerPage);

watch(() => props.itemsPerPage, (newValue) => {
  localItemsPerPage.value = newValue;
});

const onPageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};

const onItemsPerPageChange = () => {
  emit('items-per-page-change', localItemsPerPage.value);
};

const pageNumbers = computed(() => {
  const numbers: (number | string)[] = [];

  if (props.totalPages <= 7) {
    for (let i = 1; i <= props.totalPages; i++) {
      numbers.push(i);
    }
  } else {
    numbers.push(1);

    if (props.currentPage > 3) {
      numbers.push('...');
    }

    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(props.totalPages - 1, props.currentPage + 1);

    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }

    if (props.currentPage < props.totalPages - 2) {
      numbers.push('...');
    }

    numbers.push(props.totalPages);
  }

  return numbers;
});
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="onPageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        Previous
      </button>
      <button
        @click="onPageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        Next
      </button>
    </div>

    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ t('table.itemsPerPage') }}:
          <select v-model="localItemsPerPage" @change="onItemsPerPageChange" class="ml-1 text-gray-700 bg-white border border-gray-300 rounded-md">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </p>
      </div>

      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            @click="onPageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            <span class="sr-only">Previous</span>
            &lt;
          </button>

          <template v-for="page in pageNumbers" :key="page">
  <button
    v-if="page !== '...'"
    @click="onPageChange(Number(page))"
    :class="[
      Number(page) === currentPage
        ? 'relative z-10 inline-flex items-center bg-red-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
        : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-100 focus:z-20 focus:outline-offset-0'
    ]"
  >
    {{ page }}
  </button>
  <span
    v-else
    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
  >
    ...
  </span>
</template>

          <button
            @click="onPageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            <span class="sr-only">Next</span>
            &gt;
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
