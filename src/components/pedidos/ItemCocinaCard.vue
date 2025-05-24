<template>
  <div 
    :class="[
      'bg-white border rounded-lg p-3 transition-all duration-200',
      getPrioridadClasses(),
      tiempoTranscurrido > 20 && 'border-red-300 bg-red-50',
      tiempoTranscurrido > 10 && tiempoTranscurrido <= 20 && 'border-yellow-300 bg-yellow-50'
    ]"
  >
    <!-- Header con pedido y mesa -->
    <div class="flex justify-between items-start mb-2">
      <div>
        <div class="font-semibold text-sm text-gray-900">
          {{ item.numero_pedido || `Pedido ${(item.pedido_id || '').slice(-4)}` }}
        </div>
        <div class="text-xs text-gray-500">
          Mesa {{ item.numero_mesa || 'N/A' }}
        </div>
      </div>
      <div class="text-right">
        <TiempoTranscurrido :minutos="tiempoTranscurrido" />
        <div v-if="prioridadSegura > 0" class="mt-1">
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon class="w-3 h-3 mr-1" />
            Prioridad {{ prioridadSegura }}
          </span>
        </div>
      </div>
    </div>

    <!-- Información del plato -->
    <div class="mb-3">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900 text-sm">{{ item.nombre_plato || 'Plato sin nombre' }}</h4>
        <span class="text-sm font-semibold text-gray-700">x{{ item.cantidad || 1 }}</span>
      </div>
      
      <!-- Modificaciones o notas -->
      <div v-if="item.notas || (item.modificaciones && item.modificaciones.length > 0)" class="mt-1">
        <div v-if="item.modificaciones && item.modificaciones.length > 0" class="text-xs text-blue-600">
          <span class="font-medium">Modificaciones:</span>
          <ul class="list-disc list-inside mt-1">
            <li v-for="mod in item.modificaciones" :key="mod">{{ mod }}</li>
          </ul>
        </div>
        <div v-if="item.notas" class="text-xs text-orange-600 mt-1">
          <span class="font-medium">Nota:</span> {{ item.notas }}
        </div>
      </div>

      <!-- Tiempo estimado -->
      <div v-if="item.tiempo_preparacion_estimado" class="mt-1 text-xs text-gray-500">
        Tiempo estimado: {{ item.tiempo_preparacion_estimado }} min
      </div>
    </div>

    <!-- Estado actual -->
    <div class="mb-3">
      <EstadoBadge :estado="item.estado || 'pendiente'" size="sm" />
    </div>

    <!-- Botones de acción -->
    <div class="flex gap-2">
      <button
        v-if="item.estado === 'pendiente'"
        @click="$emit('cambiar-estado', item.id, 'en_preparacion')"
        class="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        Iniciar
      </button>

      <button
        v-if="item.estado === 'en_preparacion'"
        @click="$emit('cambiar-estado', item.id, 'listo')"
        class="flex-1 bg-green-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors"
      >
        Listo
      </button>

      <button
        v-if="item.estado === 'listo'"
        @click="$emit('cambiar-estado', item.id, 'servido')"
        class="flex-1 bg-gray-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-600 transition-colors"
      >
        Servir
      </button>

      <!-- Botón de prioridad -->
      <button
        v-if="!['servido', 'cancelado'].includes(item.estado || 'pendiente')"
        @click="togglePrioridad"
        :class="[
          'px-2 py-1.5 rounded text-sm font-medium transition-colors',
          prioridadSegura > 0 
            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <ExclamationTriangleIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Indicador de tiempo crítico -->
    <div 
      v-if="tiempoTranscurrido > 20 && !['servido', 'cancelado'].includes(item.estado || 'pendiente')"
      class="mt-2 bg-red-500 text-white px-2 py-1 rounded text-center text-xs font-medium"
    >
      ⚠️ Tiempo crítico excedido
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import TiempoTranscurrido from './TiempoTranscurrido.vue'
import EstadoBadge from './EstadoBadge.vue'

interface ItemPedido {
  id: string
  pedido_id: string
  plato_id: string
  nombre_plato: string
  cantidad: number
  precio: number
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'servido' | 'cancelado'
  estacion_preparacion?: string
  notas?: string
  modificaciones?: string[]
  tiempo_transcurrido: number
  prioridad: number
  tiempo_preparacion_estimado?: number
  numero_pedido?: string
  numero_mesa?: string
}

interface Props {
  item: ItemPedido
}

interface Emits {
  (e: 'cambiar-estado', itemId: string, nuevoEstado: string): void
  (e: 'cambiar-prioridad', itemId: string, nuevaPrioridad: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tiempoTranscurrido = computed(() => {
  return props.item.tiempo_transcurrido || 0
})

const prioridadSegura = computed(() => {
  return props.item.prioridad || 0
})

const getPrioridadClasses = () => {
  if (prioridadSegura.value > 2) return 'border-red-500 shadow-md'
  if (prioridadSegura.value > 0) return 'border-orange-400'
  return 'border-gray-200'
}

const togglePrioridad = () => {
  const nuevaPrioridad = prioridadSegura.value > 0 ? 0 : 1
  emit('cambiar-prioridad', props.item.id, nuevaPrioridad)
}
</script>