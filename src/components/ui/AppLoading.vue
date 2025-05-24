<template>
  <div 
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    v-if="show"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      <p class="mt-4 text-gray-700 text-center">{{ message || 'Cargando...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  message?: string
}>()
</script>