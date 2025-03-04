<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'table',
    validator: (value: string) => ['table', 'detail', 'form'].includes(value)
  },
  rows: {
    type: Number,
    default: 5
  }
});
</script>

<template>
  <div class="animate-pulse">
    <div v-if="type === 'table'" class="space-y-4">
      <div v-for="i in rows" :key="i" class="flex w-full">
        <div class="w-16 h-10 bg-gray-200 rounded"></div>
        <div class="flex-1 h-10 mx-4 bg-gray-200 rounded"></div>
        <div class="w-32 h-10 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else-if="type === 'detail'" class="space-y-4">
      <div class="h-8 w-1/3 bg-gray-200 rounded"></div>
      <div class="h-6 w-full bg-gray-200 rounded"></div>
      <div class="h-6 w-full bg-gray-200 rounded"></div>
      <div class="h-6 w-2/3 bg-gray-200 rounded"></div>
      <div class="h-6 w-full bg-gray-200 rounded"></div>
      <div class="h-6 w-full bg-gray-200 rounded"></div>
    </div>

    <div v-else-if="type === 'form'" class="space-y-6">
      <div class="space-y-2">
        <div class="h-6 w-24 bg-gray-200 rounded"></div>
        <div class="h-10 w-full bg-gray-200 rounded"></div>
      </div>
      <div class="space-y-2">
        <div class="h-6 w-24 bg-gray-200 rounded"></div>
        <div class="h-10 w-full bg-gray-200 rounded"></div>
      </div>
      <div class="space-y-2">
        <div class="h-6 w-24 bg-gray-200 rounded"></div>
        <div class="h-32 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>
