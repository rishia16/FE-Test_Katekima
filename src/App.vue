<script setup lang="ts">
import Navbar from './components/AppNavbar.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>
