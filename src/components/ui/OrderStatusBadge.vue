<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const statusText = computed(() => {
  const statusMap: Record<string, string> = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En preparación',
    'listo': 'Listo',
    'entregado': 'Entregado',
    'pagado': 'Pagado',
    'cancelado': 'Cancelado'
  }
  return statusMap[props.status] || props.status
})

const statusClasses = computed(() => {
  const classMap: Record<string, string> = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'confirmado': 'bg-blue-100 text-blue-800',
    'en_preparacion': 'bg-orange-100 text-orange-800',
    'listo': 'bg-green-100 text-green-800',
    'entregado': 'bg-purple-100 text-purple-800',
    'pagado': 'bg-gray-100 text-gray-800',
    'cancelado': 'bg-red-100 text-red-800'
  }
  return classMap[props.status] || 'bg-gray-100 text-gray-800'
})
</script>