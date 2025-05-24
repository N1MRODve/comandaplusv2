<template>
  <Teleport to="body">
    <div
      v-if="abierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="$emit('cerrar')"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                Detalles del Pedido {{ pedido.numero_pedido || 'Sin número' }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">
                Mesa {{ pedido.numero_mesa || 'N/A' }} • {{ formatTime(pedido.hora_pedido) }}
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <EstadoBadge :estado="pedido.estado || 'pendiente'" size="lg" />
              <button
                @click="$emit('cerrar')"
                class="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Información del pedido -->
              <div class="lg:col-span-2">
                <!-- Información del cliente -->
                <div v-if="clienteNombre" class="mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Cliente</h3>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-900">
                      {{ clienteNombre }}
                    </p>
                    <p v-if="pedido.telefono_cliente" class="text-sm text-gray-500 mt-1">
                      {{ pedido.telefono_cliente }}
                    </p>
                  </div>
                </div>

                <!-- Items del pedido -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Items del pedido</h3>
                    <button
                      v-if="!cargandoItems"
                      @click="cargarItemsPedido"
                      class="text-sm text-orange-600 hover:text-orange-800"
                    >
                      Actualizar
                    </button>
                  </div>

                  <!-- Loading de items -->
                  <div v-if="cargandoItems" class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>

                  <!-- Error en la carga -->
                  <div v-else-if="errorItems" class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex">
                      <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-2" />
                      <div>
                        <h4 class="text-sm font-medium text-red-800">Error al cargar items</h4>
                        <p class="text-sm text-red-700 mt-1">{{ errorItems }}</p>
                        <button
                          @click="cargarItemsPedido"
                          class="mt-2 text-sm text-red-800 underline hover:text-red-900"
                        >
                          Intentar de nuevo
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Items -->
                  <div v-else class="space-y-3">
                    <!-- Si tenemos items en el objeto pedido -->
                    <div
                      v-for="item in itemsParaMostrar"
                      :key="item.id"
                      class="bg-gray-50 rounded-lg p-4"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <h4 class="font-medium text-gray-900">{{ item.nombre_plato || 'Plato sin nombre' }}</h4>
                            <span class="text-sm text-gray-500">x{{ item.cantidad || 1 }}</span>
                          </div>
                          
                          <!-- Modificaciones -->
                          <div v-if="item.modificaciones && Array.isArray(item.modificaciones) && item.modificaciones.length > 0" class="mb-2">
                            <p class="text-xs text-blue-600 font-medium">Modificaciones:</p>
                            <ul class="text-xs text-blue-600 list-disc list-inside">
                              <li v-for="mod in item.modificaciones" :key="mod">{{ mod }}</li>
                            </ul>
                          </div>
                          
                          <!-- Notas -->
                          <div v-if="item.notas" class="mb-2">
                            <p class="text-xs text-orange-600">
                              <span class="font-medium">Nota:</span> {{ item.notas }}
                            </p>
                          </div>
                          
                          <div class="flex items-center justify-between">
                            <EstadoBadge :estado="item.estado || 'pendiente'" size="sm" />
                            <span class="text-sm font-medium text-gray-900">
                              €{{ calcularPrecioItem(item) }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Botones de estado del item -->
                      <div v-if="!['servido', 'cancelado'].includes(item.estado || 'pendiente')" class="mt-3 flex gap-2">
                        <button
                          v-if="item.estado === 'pendiente'"
                          @click="$emit('cambiar-estado-item', item.id, 'en_preparacion')"
                          class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Iniciar
                        </button>
                        <button
                          v-if="item.estado === 'en_preparacion'"
                          @click="$emit('cambiar-estado-item', item.id, 'listo')"
                          class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          Listo
                        </button>
                        <button
                          v-if="item.estado === 'listo'"
                          @click="$emit('cambiar-estado-item', item.id, 'servido')"
                          class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                          Servir
                        </button>
                      </div>
                    </div>

                    <!-- Si no hay items -->
                    <div v-if="itemsParaMostrar.length === 0" class="text-center py-8 text-gray-500">
                      <p>No se encontraron items para este pedido</p>
                      <button
                        @click="cargarItemsPedido"
                        class="mt-2 text-sm text-orange-600 hover:text-orange-800"
                      >
                        Intentar cargar de nuevo
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Notas del pedido -->
                <div v-if="pedido.notas" class="mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Notas del pedido</h3>
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-sm text-gray-900">{{ pedido.notas }}</p>
                  </div>
                </div>

                <!-- Notas de cocina -->
                <div v-if="pedido.notas_cocina" class="mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Notas para cocina</h3>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p class="text-sm text-gray-900">{{ pedido.notas_cocina }}</p>
                  </div>
                </div>
              </div>

              <!-- Panel lateral con resumen -->
              <div>
                <!-- Resumen del tiempo -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-3">Tiempos</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Pedido realizado:</span>
                      <span class="font-medium">{{ formatTime(pedido.hora_pedido) }}</span>
                    </div>
                    <div v-if="pedido.hora_confirmacion" class="flex justify-between">
                      <span class="text-gray-600">Confirmado:</span>
                      <span class="font-medium">{{ formatTime(pedido.hora_confirmacion) }}</span>
                    </div>
                    <div v-if="pedido.hora_preparacion" class="flex justify-between">
                      <span class="text-gray-600">Iniciado:</span>
                      <span class="font-medium">{{ formatTime(pedido.hora_preparacion) }}</span>
                    </div>
                    <div v-if="pedido.hora_listo" class="flex justify-between">
                      <span class="text-gray-600">Listo:</span>
                      <span class="font-medium">{{ formatTime(pedido.hora_listo) }}</span>
                    </div>
                    <div v-if="pedido.hora_entrega" class="flex justify-between">
                      <span class="text-gray-600">Entregado:</span>
                      <span class="font-medium">{{ formatTime(pedido.hora_entrega) }}</span>
                    </div>
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                      <span class="text-gray-600">Tiempo transcurrido:</span>
                      <TiempoTranscurrido :minutos="calcularTiempoTranscurrido()" />
                    </div>
                  </div>
                </div>

                <!-- Resumen financiero -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-3">Resumen</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Subtotal:</span>
                      <span class="font-medium">€{{ (pedido.subtotal || pedido.total || 0).toFixed(2) }}</span>
                    </div>
                    <div v-if="pedido.descuentos && pedido.descuentos > 0" class="flex justify-between">
                      <span class="text-gray-600">Descuentos:</span>
                      <span class="font-medium text-red-600">-€{{ pedido.descuentos.toFixed(2) }}</span>
                    </div>
                    <div v-if="pedido.impuestos && pedido.impuestos > 0" class="flex justify-between">
                      <span class="text-gray-600">Impuestos:</span>
                      <span class="font-medium">€{{ pedido.impuestos.toFixed(2) }}</span>
                    </div>
                    <div v-if="pedido.propina && pedido.propina > 0" class="flex justify-between">
                      <span class="text-gray-600">Propina:</span>
                      <span class="font-medium">€{{ pedido.propina.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                      <span class="text-gray-900 font-semibold">Total:</span>
                      <span class="font-bold text-lg">€{{ (pedido.total || 0).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Progreso de items -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-3">Progreso</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Items completados:</span>
                      <span class="font-medium">{{ itemsListos }}/{{ itemsTotal }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        class="bg-green-500 h-3 rounded-full transition-all duration-300"
                        :style="{ width: `${progresoItems}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Acciones rápidas -->
                <div class="space-y-3">
                  <button
                    v-if="pedido.estado === 'pendiente'"
                    @click="$emit('cambiar-estado', pedido.id, 'en_preparacion')"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Comenzar preparación
                  </button>
                  
                  <button
                    v-if="pedido.estado === 'en_preparacion' && todosLosItemsListos"
                    @click="$emit('cambiar-estado', pedido.id, 'listo')"
                    class="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Marcar como listo
                  </button>
                  
                  <button
                    v-if="pedido.estado === 'listo'"
                    @click="$emit('cambiar-estado', pedido.id, 'entregado')"
                    class="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Marcar como entregado
                  </button>
                  
                  <button
                    v-if="['pendiente', 'en_preparacion'].includes(pedido.estado)"
                    @click="confirmarCancelacion"
                    class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancelar pedido
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              @click="$emit('cerrar')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import EstadoBadge from './EstadoBadge.vue'
import TiempoTranscurrido from './TiempoTranscurrido.vue'
import { supabase } from '@/lib/supabase'

interface Pedido {
  id: string
  numero_pedido?: string
  numero_mesa?: string
  cliente_nombre?: string
  nombre_cliente?: string
  telefono_cliente?: string
  estado: string
  subtotal?: number
  descuentos?: number
  impuestos?: number
  propina?: number
  total?: number
  notas?: string
  notas_cocina?: string
  hora_pedido?: string
  hora_confirmacion?: string
  hora_preparacion?: string
  hora_listo?: string
  hora_entrega?: string
  items?: ItemPedido[]
}

interface ItemPedido {
  id: string
  pedido_id: string
  plato_id: string
  nombre_plato?: string
  cantidad?: number
  precio?: number
  precio_unitario?: number
  estado?: string
  notas?: string
  modificaciones?: string[] | any
}

interface Props {
  pedido: Pedido
  abierto: boolean
}

interface Emits {
  (e: 'cerrar'): void
  (e: 'cambiar-estado', pedidoId: string, nuevoEstado: string): void
  (e: 'cambiar-estado-item', itemId: string, nuevoEstado: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const itemsPedido = ref<ItemPedido[]>([])
const cargandoItems = ref(false)
const errorItems = ref<string | null>(null)

// Computed properties
const clienteNombre = computed(() => {
  const nombre = props.pedido.cliente_nombre || props.pedido.nombre_cliente
  return nombre || null
})

// Usar items del pedido si existen, sino los cargados por separado
const itemsParaMostrar = computed(() => {
  if (props.pedido.items && props.pedido.items.length > 0) {
    return props.pedido.items
  }
  return itemsPedido.value
})

const itemsTotal = computed(() => itemsParaMostrar.value.length)
const itemsListos = computed(() => 
  itemsParaMostrar.value.filter(item => ['listo', 'servido'].includes(item.estado || 'pendiente')).length
)
const progresoItems = computed(() => {
  if (itemsTotal.value === 0) return 0
  return Math.round((itemsListos.value / itemsTotal.value) * 100)
})

const todosLosItemsListos = computed(() => 
  itemsParaMostrar.value.length > 0 && itemsParaMostrar.value.every(item => 
    ['listo', 'servido'].includes(item.estado || 'pendiente')
  )
)

// Métodos
const formatTime = (timestamp?: string) => {
  if (!timestamp) return '--:--'
  try {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch {
    return '--:--'
  }
}

const calcularTiempoTranscurrido = (): number => {
  const fechaPedido = props.pedido.hora_pedido
  if (!fechaPedido) return 0
  
  try {
    const ahora = new Date()
    const creacion = new Date(fechaPedido)
    return Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60))
  } catch {
    return 0
  }
}

const calcularPrecioItem = (item: ItemPedido): string => {
  const precio = item.precio_unitario || item.precio || 0
  const cantidad = item.cantidad || 1
  return (precio * cantidad).toFixed(2)
}

const cargarItemsPedido = async () => {
  if (!props.pedido?.id) return
  
  try {
    cargandoItems.value = true
    errorItems.value = null
    
    console.log('Cargando items para pedido:', props.pedido.id)
    
    const { data, error } = await supabase
      .from('items_pedido')
      .select(`
        id,
        pedido_id,
        plato_id,
        nombre_plato,
        cantidad,
        precio,
        precio_unitario,
        estado,
        notas,
        modificaciones,
        estacion_preparacion,
        prioridad
      `)
      .eq('pedido_id', props.pedido.id)
      .order('creado_el', { ascending: true })
    
    if (error) {
      console.error('Error cargando items del pedido:', error)
      errorItems.value = error.message
      return
    }
    
    console.log('Items cargados:', data)
    itemsPedido.value = data || []
    
  } catch (err: any) {
    console.error('Error inesperado cargando items:', err)
    errorItems.value = err.message || 'Error inesperado'
  } finally {
    cargandoItems.value = false
  }
}

const confirmarCancelacion = () => {
  if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
    emit('cambiar-estado', props.pedido.id, 'cancelado')
  }
}

// Lifecycle
onMounted(() => {
  if (props.abierto) {
    // Solo cargar items si no vienen en el objeto pedido
    if (!props.pedido.items || props.pedido.items.length === 0) {
      cargarItemsPedido()
    }
  }
})

// Watchers
watch(() => props.abierto, (nuevo) => {
  if (nuevo) {
    // Solo cargar items si no vienen en el objeto pedido
    if (!props.pedido.items || props.pedido.items.length === 0) {
      cargarItemsPedido()
    }
  }
})

watch(() => props.pedido?.id, (nuevoId) => {
  if (nuevoId && props.abierto) {
    // Solo cargar items si no vienen en el objeto pedido
    if (!props.pedido.items || props.pedido.items.length === 0) {
      cargarItemsPedido()
    }
  }
})
</script>