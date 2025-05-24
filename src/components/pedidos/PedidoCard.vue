<template>
  <div 
    :class="[
      'bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md',
      getEstadoClasses(pedido.estado)
    ]"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-900">{{ pedido.numero_pedido }}</h3>
          <p class="text-sm text-gray-600">Mesa {{ pedido.numero_mesa }}</p>
        </div>
        <div class="text-right">
          <span :class="getEstadoBadgeClasses(pedido.estado)" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ getEstadoTexto(pedido.estado) }}
          </span>
          <p class="text-sm text-gray-500 mt-1">{{ formatTime(pedido.creado_el) }}</p>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-4">
      <!-- Información del cliente -->
      <div v-if="pedido.cliente_nombre || pedido.nombre_cliente" class="mb-3">
        <p class="text-sm text-gray-600">
          Cliente: {{ pedido.cliente_nombre || pedido.nombre_cliente }}
        </p>
      </div>

      <!-- Resumen de items -->
      <div class="mb-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">{{ pedido.total_items || pedido.items || 0 }} productos</span>
          <span class="font-semibold text-gray-900">€{{ pedido.total.toFixed(2) }}</span>
        </div>
        
        <!-- Progreso de items listos -->
        <div v-if="pedido.items_listos !== undefined && pedido.total_items" class="mt-2">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progreso</span>
            <span>{{ pedido.items_listos }}/{{ pedido.total_items }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              :class="[
                'h-2 rounded-full transition-all duration-300',
                pedido.items_listos === pedido.total_items ? 'bg-green-500' : 'bg-blue-500'
              ]"
              :style="{ width: `${(pedido.items_listos / pedido.total_items) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tiempo transcurrido -->
      <div class="mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ getTimeSinceOrder(pedido.creado_el) }}</span>
        </div>
      </div>

      <!-- Notas -->
      <div v-if="pedido.notas" class="mb-4 p-2 bg-yellow-50 rounded-lg">
        <p class="text-sm text-gray-700">
          <strong>Nota:</strong> {{ pedido.notas }}
        </p>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap gap-2">
        <!-- Botones según el estado -->
        <button
          v-if="pedido.estado === 'pendiente'"
          @click="$emit('update-estado', pedido.id, 'en_preparacion')"
          class="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Comenzar
        </button>

        <button
          v-if="pedido.estado === 'en_preparacion'"
          @click="$emit('update-estado', pedido.id, 'listo')"
          class="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          Marcar listo
        </button>

        <button
          v-if="pedido.estado === 'listo'"
          @click="$emit('update-estado', pedido.id, 'entregado')"
          class="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
        >
          Entregar
        </button>

        <!-- Botón de detalles -->
        <button
          @click="$emit('ver-detalles', pedido)"
          class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Detalles
        </button>

        <!-- Botón de cancelar (solo para pendientes) -->
        <button
          v-if="pedido.estado === 'pendiente'"
          @click="$emit('update-estado', pedido.id, 'cancelado')"
          class="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Indicador de tiempo crítico -->
    <div 
      v-if="isOverTime(pedido.creado_el) && !['entregado', 'cancelado'].includes(pedido.estado)"
      class="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium"
    >
      ⚠️ Tiempo de espera excedido
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Pedido {
  id: string
  numero_pedido: string
  numero_mesa: string
  estado: string
  total: number
  creado_el: string
  cliente_nombre?: string
  nombre_cliente?: string
  notas?: string
  total_items?: number
  items_listos?: number
  items?: number
}

interface Props {
  pedido: Pedido
}

interface Emits {
  (e: 'update-estado', pedidoId: string, nuevoEstado: string): void
  (e: 'ver-detalles', pedido: Pedido): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Métodos para formateo y estado
const getEstadoClasses = (estado: string) => {
  const classes = {
    'pendiente': 'border-yellow-300 bg-yellow-50',
    'en_preparacion': 'border-blue-300 bg-blue-50',
    'listo': 'border-green-300 bg-green-50',
    'entregado': 'border-gray-300 bg-gray-50',
    'cancelado': 'border-red-300 bg-red-50'
  }
  return classes[estado as keyof typeof classes] || 'border-gray-300'
}

const getEstadoBadgeClasses = (estado: string) => {
  const classes = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'en_preparacion': 'bg-blue-100 text-blue-800',
    'listo': 'bg-green-100 text-green-800',
    'entregado': 'bg-gray-100 text-gray-800',
    'cancelado': 'bg-red-100 text-red-800'
  }
  return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getEstadoTexto = (estado: string) => {
  const textos = {
    'pendiente': 'Pendiente',
    'en_preparacion': 'En preparación',
    'listo': 'Listo',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  }
  return textos[estado as keyof typeof textos] || estado
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getTimeSinceOrder = (timestamp: string) => {
  const now = new Date()
  const orderTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Ahora mismo'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const remainingMinutes = diffInMinutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
}

const isOverTime = (timestamp: string) => {
  const now = new Date()
  const orderTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))
  
  // Considerar "tiempo excedido" después de 30 minutos
  return diffInMinutes > 30
}
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>