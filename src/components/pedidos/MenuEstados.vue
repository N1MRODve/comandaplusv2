<template>
  <Teleport to="body">
    <div
      v-if="abierto"
      class="fixed inset-0 z-50"
      @click="$emit('cerrar')"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-25"></div>
      
      <!-- Menu -->
      <div
        :style="{ left: `${posicion.x}px`, top: `${posicion.y}px` }"
        class="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50"
        @click.stop
      >
        <div class="px-3 py-2 border-b border-gray-100">
          <h3 class="text-sm font-medium text-gray-900">Cambiar estado</h3>
          <p class="text-xs text-gray-500">{{ pedido?.numero_pedido || 'Pedido sin número' }}</p>
        </div>
        
        <div class="py-1">
          <button
            v-for="opcion in opcionesEstado"
            :key="opcion.estado"
            @click="cambiarEstado(opcion.estado)"
            :disabled="opcion.estado === estadoActual"
            :class="[
              'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed',
              opcion.estado === estadoActual && 'bg-gray-100'
            ]"
          >
            <component :is="opcion.icono" class="w-4 h-4 mr-2" :class="opcion.colorIcono" />
            <span>{{ opcion.texto }}</span>
            <span v-if="opcion.estado === estadoActual" class="ml-auto text-xs text-gray-500">
              (Actual)
            </span>
          </button>
        </div>
        
        <div class="border-t border-gray-100 py-1">
          <button
            @click="$emit('cerrar')"
            class="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  HandRaisedIcon,
  XCircleIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'

interface Pedido {
  id: string
  numero_pedido?: string
  estado: string
}

interface Props {
  pedido: Pedido | null
  abierto: boolean
  posicion: { x: number; y: number }
}

interface Emits {
  (e: 'cambiar-estado', pedidoId: string, nuevoEstado: string): void
  (e: 'cerrar'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const estadoActual = computed(() => {
  return props.pedido?.estado || 'pendiente'
})

const todosLosEstados = [
  {
    estado: 'pendiente',
    texto: 'Pendiente',
    icono: ClockIcon,
    colorIcono: 'text-yellow-500',
    disponibleDesde: []
  },
  {
    estado: 'confirmado',
    texto: 'Confirmar pedido',
    icono: CheckCircleIcon,
    colorIcono: 'text-orange-500',
    disponibleDesde: ['pendiente']
  },
  {
    estado: 'en_preparacion',
    texto: 'En preparación',
    icono: PlayIcon,
    colorIcono: 'text-blue-500',
    disponibleDesde: ['pendiente', 'confirmado']
  },
  {
    estado: 'listo',
    texto: 'Marcar como listo',
    icono: CheckCircleIcon,
    colorIcono: 'text-green-500',
    disponibleDesde: ['en_preparacion']
  },
  {
    estado: 'entregado',
    texto: 'Entregar pedido',
    icono: HandRaisedIcon,
    colorIcono: 'text-gray-500',
    disponibleDesde: ['listo']
  },
  {
    estado: 'pagado',
    texto: 'Marcar como pagado',
    icono: CreditCardIcon,
    colorIcono: 'text-emerald-500',
    disponibleDesde: ['entregado']
  },
  {
    estado: 'cancelado',
    texto: 'Cancelar pedido',
    icono: XCircleIcon,
    colorIcono: 'text-red-500',
    disponibleDesde: ['pendiente', 'confirmado', 'en_preparacion']
  }
]

const opcionesEstado = computed(() => {
  if (!props.pedido) return []
  
  return todosLosEstados.filter(opcion => {
    // Mostrar el estado actual
    if (opcion.estado === estadoActual.value) return true
    
    // Mostrar estados disponibles desde el estado actual
    return opcion.disponibleDesde.includes(estadoActual.value)
  })
})

const cambiarEstado = (nuevoEstado: string) => {
  if (props.pedido && nuevoEstado !== estadoActual.value) {
    emit('cambiar-estado', props.pedido.id, nuevoEstado)
  }
}
</script>