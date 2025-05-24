<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <!-- Modal -->
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            Pedido {{ pedido.numero_pedido }}
          </h2>
          <p class="text-sm text-gray-600">
            Mesa {{ pedido.numero_mesa }} • {{ formatDate(pedido.creado_el) }}
          </p>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Estado e información general -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Estado actual -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">Estado actual</h3>
            <span :class="getEstadoBadgeClasses(pedido.estado)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ getEstadoTexto(pedido.estado) }}
            </span>
            <p class="text-sm text-gray-600 mt-2">
              {{ getTimeSinceOrder(pedido.creado_el) }}
            </p>
          </div>

          <!-- Información del cliente -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">Cliente</h3>
            <p class="text-sm text-gray-700">
              {{ pedido.cliente_nombre || pedido.nombre_cliente || 'Cliente anónimo' }}
            </p>
            <p v-if="pedido.telefono_cliente" class="text-sm text-gray-600">
              {{ pedido.telefono_cliente }}
            </p>
          </div>
        </div>

        <!-- Timeline del pedido -->
        <div v-if="timeline.length > 0" class="mb-6">
          <h3 class="font-medium text-gray-900 mb-4">Timeline del pedido</h3>
          <div class="space-y-3">
            <div 
              v-for="(event, index) in timeline" 
              :key="index"
              class="flex items-center space-x-3"
            >
              <div :class="[
                'w-3 h-3 rounded-full flex-shrink-0',
                event.completed ? 'bg-green-500' : 'bg-gray-300'
              ]"></div>
              <div class="flex-1">
                <p :class="[
                  'text-sm font-medium',
                  event.completed ? 'text-gray-900' : 'text-gray-500'
                ]">
                  {{ event.label }}
                </p>
                <p v-if="event.time" class="text-xs text-gray-500">
                  {{ formatTime(event.time) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Items del pedido -->
        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-4">Items del pedido</h3>
          
          <!-- Loading items -->
          <div v-if="loadingItems" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>

          <!-- Lista de items -->
          <div v-else-if="items.length > 0" class="space-y-3">
            <div 
              v-for="item in items" 
              :key="item.id"
              class="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900">{{ item.nombre_plato }}</h4>
                  <span :class="getItemEstadoBadgeClasses(item.estado)" class="px-2 py-1 rounded text-xs font-medium">
                    {{ getEstadoTexto(item.estado) }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between mt-1">
                  <p class="text-sm text-gray-600">
                    Cantidad: {{ item.cantidad }} × €{{ item.precio.toFixed(2) }}
                  </p>
                  <p class="font-medium text-gray-900">
                    €{{ (item.cantidad * item.precio).toFixed(2) }}
                  </p>
                </div>

                <!-- Notas del item -->
                <p v-if="item.notas" class="text-sm text-gray-600 mt-1">
                  <strong>Nota:</strong> {{ item.notas }}
                </p>

                <!-- Modificaciones -->
                <div v-if="item.modificaciones && item.modificaciones.length > 0" class="mt-1">
                  <p class="text-xs text-gray-500">
                    Modificaciones: {{ item.modificaciones.join(', ') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin items -->
          <div v-else class="text-center py-4 text-gray-500">
            No se pudieron cargar los items del pedido
          </div>
        </div>

        <!-- Notas del pedido -->
        <div v-if="pedido.notas" class="mb-6">
          <h3 class="font-medium text-gray-900 mb-2">Notas del pedido</h3>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-sm text-gray-700">{{ pedido.notas }}</p>
          </div>
        </div>

        <!-- Resumen financiero -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-3">Resumen</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">€{{ calculateSubtotal().toFixed(2) }}</span>
            </div>
            <div v-if="pedido.descuentos && pedido.descuentos > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Descuentos</span>
              <span class="font-medium text-green-600">-€{{ pedido.descuentos.toFixed(2) }}</span>
            </div>
            <div v-if="pedido.propina && pedido.propina > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Propina</span>
              <span class="font-medium">€{{ pedido.propina.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>€{{ pedido.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con acciones -->
      <div class="border-t p-6">
        <div class="flex flex-wrap gap-3">
          <!-- Botones de cambio de estado -->
          <button
            v-if="pedido.estado === 'pendiente'"
            @click="updateEstado('en_preparacion')"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Comenzar preparación
          </button>

          <button
            v-if="pedido.estado === 'en_preparacion'"
            @click="updateEstado('listo')"
            class="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Marcar como listo
          </button>

          <button
            v-if="pedido.estado === 'listo'"
            @click="updateEstado('entregado')"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Marcar como entregado
          </button>

          <!-- Botón de cancelar -->
          <button
            v-if="['pendiente', 'en_preparacion'].includes(pedido.estado)"
            @click="updateEstado('cancelado')"
            class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Cancelar pedido
          </button>

          <!-- Botón cerrar -->
          <button
            @click="$emit('close')"
            class="ml-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'

interface Pedido {
  id: string
  numero_pedido: string
  numero_mesa: string
  estado: string
  total: number
  creado_el: string
  hora_confirmacion?: string
  hora_preparacion?: string
  hora_listo?: string
  hora_entrega?: string
  cliente_nombre?: string
  nombre_cliente?: string
  telefono_cliente?: string
  notas?: string
  descuentos?: number
  propina?: number
}

interface Props {
  pedido: Pedido
}

interface Emits {
  (e: 'close'): void
  (e: 'update-estado', pedidoId: string, nuevoEstado: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { supabase } = useSupabase()

// Estado
const items = ref<any[]>([])
const loadingItems = ref(false)

// Timeline del pedido
const timeline = computed(() => {
  const events = [
    { label: 'Pedido realizado', time: props.pedido.creado_el, completed: true },
    { label: 'En preparación', time: props.pedido.hora_preparacion, completed: !!props.pedido.hora_preparacion },
    { label: 'Listo para servir', time: props.pedido.hora_listo, completed: !!props.pedido.hora_listo },
    { label: 'Entregado', time: props.pedido.hora_entrega, completed: !!props.pedido.hora_entrega }
  ]
  
  return events
})

// Métodos
const cargarItems = async () => {
  try {
    loadingItems.value = true
    
    const { data, error } = await supabase
      .from('items_pedido')
      .select(`
        *,
        plato:platos(nombre, url_imagen)
      `)
      .eq('pedido_id', props.pedido.id)
      .order('creado_el', { ascending: true })

    if (error) throw error
    
    items.value = data || []
  } catch (error) {
    console.error('Error cargando items:', error)
  } finally {
    loadingItems.value = false
  }
}

const updateEstado = (nuevoEstado: string) => {
  emit('update-estado', props.pedido.id, nuevoEstado)
}

const calculateSubtotal = () => {
  return items.value.reduce((total, item) => total + (item.cantidad * item.precio), 0)
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

const getItemEstadoBadgeClasses = (estado: string) => {
  const classes = {
    'pendiente': 'bg-yellow-100 text-yellow-700',
    'en_preparacion': 'bg-blue-100 text-blue-700',
    'listo': 'bg-green-100 text-green-700',
    'servido': 'bg-gray-100 text-gray-700',
    'cancelado': 'bg-red-100 text-red-700'
  }
  return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const getEstadoTexto = (estado: string) => {
  const textos = {
    'pendiente': 'Pendiente',
    'en_preparacion': 'En preparación',
    'listo': 'Listo',
    'entregado': 'Entregado',
    'servido': 'Servido',
    'cancelado': 'Cancelado'
  }
  return textos[estado as keyof typeof textos] || estado
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
    return `Hace ${diffInMinutes} minutos`
  } else {
    const hours = Math.floor(diffInMinutes / 60)
    const remainingMinutes = diffInMinutes % 60
    return `Hace ${hours}h ${remainingMinutes}m`
  }
}

// Lifecycle
onMounted(() => {
  cargarItems()
})
</script>