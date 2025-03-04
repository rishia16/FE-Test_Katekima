<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const currentLocale = ref(locale.value);

const changeLocale = () => {
  locale.value = currentLocale.value;
  localStorage.setItem('locale', currentLocale.value);
};
</script>

<template>
  <nav class="bg-gradient-to-r from-purple-600 to-indigo-800 text-white p-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <router-link :to="{ name: 'Home' }" class="text-2xl font-extrabold tracking-wide hover:text-gray-200 transition duration-200">
          RishiAstasachindra FE Test
        </router-link>
      </div>

      <div class="flex items-center space-x-4">
        <select
          v-model="currentLocale"
          @change="changeLocale"
          class="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
        </select>
      </div>
    </div>
  </nav>
</template>
