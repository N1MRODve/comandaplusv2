<template>
  <div class="flex items-center text-sm">
    <ClockIcon :class="['w-4 h-4 mr-1', getIconColorClass()]" />
    <span :class="getTextColorClass()">
      {{ tiempoFormateado }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

interface Props {
  minutos: number
}

const props = defineProps<Props>()

const minutosSeguro = computed(() => {
  return props.minutos || 0
})

const tiempoFormateado = computed(() => {
  const minutos = minutosSeguro.value
  
  if (minutos < 1) {
    return 'Ahora mismo'
  } else if (minutos < 60) {
    return `${minutos} min`
  } else {
    const horas = Math.floor(minutos / 60)
    const minutosRestantes = minutos % 60
    return `${horas}h ${minutosRestantes}m`
  }
})

const getIconColorClass = () => {
  if (minutosSeguro.value > 60) return 'text-red-500'
  if (minutosSeguro.value > 30) return 'text-yellow-500'
  return 'text-gray-400'
}

const getTextColorClass = () => {
  if (minutosSeguro.value > 60) return 'text-red-700 font-semibold'
  if (minutosSeguro.value > 30) return 'text-yellow-700 font-medium'
  return 'text-gray-600'
}
</script>