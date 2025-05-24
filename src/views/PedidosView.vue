<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con estadísticas rápidas -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ authStore.currentRestaurant?.nombre }} - {{ totalPedidosActivos }} pedidos activos
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Stats rápidas -->
            <div class="flex items-center space-x-6">
              <div class="text-center">
                <div class="text-lg font-semibold text-orange-600">{{ estadoPedidos.pendientes }}</div>
                <div class="text-xs text-gray-500">Pendientes</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-blue-600">{{ estadoPedidos.en_preparacion }}</div>
                <div class="text-xs text-gray-500">En preparación</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-green-600">{{ estadoPedidos.listos }}</div>
                <div class="text-xs text-gray-500">Listos</div>
              </div>
            </div>
            
            <!-- Indicador de tiempo real -->
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-2 h-2 rounded-full',
                dashboardStore.isRealTimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              ]"></div>
              <span class="text-sm text-gray-600">
                {{ dashboardStore.isRealTimeConnected ? 'Tiempo real' : 'Desconectado' }}
              </span>
            </div>
            
            <!-- Botón actualizar -->
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y controles -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Filtros por estado -->
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Filtrar por estado:</span>
            <div class="flex space-x-1">
              <button
                v-for="estado in estadosDisponibles"
                :key="estado.value"
                @click="toggleFiltroEstado(estado.value)"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  filtroEstado.includes(estado.value)
                    ? `${estado.bgColor} ${estado.textColor}`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ estado.label }} ({{ contarPorEstado(estado.value) }})
              </button>
            </div>
          </div>

          <!-- Filtros adicionales -->
          <div class="flex items-center space-x-4">
            <!-- Filtro por mesa -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Mesa:</label>
              <select
                v-model="filtroMesa"
                class="rounded-md border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Todas</option>
                <option v-for="mesa in mesasConPedidos" :key="mesa" :value="mesa">
                  Mesa {{ mesa }}
                </option>
              </select>
            </div>

            <!-- Filtro por tiempo -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Tiempo:</label>
              <select
                v-model="filtroTiempo"
                class="rounded-md border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="todos">Todos</option>
                <option value="recientes">Últimos 30 min</option>
                <option value="atrasados">Más de 30 min</option>
                <option value="muy_atrasados">Más de 1 hora</option>
              </select>
            </div>

            <!-- Vista -->
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">Vista:</span>
              <div class="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  @click="vistaActual = 'lista'"
                  :class="[
                    'px-3 py-1 text-sm font-medium',
                    vistaActual === 'lista'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  Lista
                </button>
                <button
                  @click="vistaActual = 'cocina'"
                  :class="[
                    'px-3 py-1 text-sm font-medium border-l border-gray-300',
                    vistaActual === 'cocina'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  Cocina
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-2" />
          <div>
            <h3 class="text-sm font-medium text-red-800">Error al cargar pedidos</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button
              @click="refreshData"
              class="mt-2 text-sm text-red-800 underline hover:text-red-900"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>

      <!-- Vista Lista con Detalles -->
      <div v-else-if="vistaActual === 'lista'" class="space-y-4">
        <!-- Cada pedido como una tarjeta -->
        <div
          v-for="pedido in pedidosFiltrados"
          :key="pedido.id"
          :class="[
            'bg-white rounded-lg shadow border transition-all duration-200 hover:shadow-md',
            calcularTiempoTranscurrido(pedido) > 60 && 'border-red-300 bg-red-50',
            calcularTiempoTranscurrido(pedido) > 30 && calcularTiempoTranscurrido(pedido) <= 60 && 'border-yellow-300 bg-yellow-50'
          ]"
        >
          <!-- Header del pedido -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <!-- Información básica -->
              <div class="flex items-center space-x-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ pedido.numero_pedido }}</h3>
                  <p class="text-sm text-gray-500">{{ formatTime(pedido.hora_pedido) }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Mesa {{ pedido.numero_mesa }}
                  </span>
                  <EstadoBadge :estado="pedido.estado" />
                </div>
              </div>

              <!-- Información del cliente y total -->
              <div class="flex items-center space-x-6">
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ obtenerNombreCliente(pedido) }}</p>
                  <p class="text-lg font-bold text-gray-900">€{{ pedido.total.toFixed(2) }}</p>
                </div>
                <TiempoTranscurrido :minutos="calcularTiempoTranscurrido(pedido)" />
              </div>

              <!-- Acciones -->
              <div class="flex items-center space-x-2">
                <button
                  @click="abrirDetallesPedido(pedido)"
                  class="text-orange-600 hover:text-orange-900 p-2"
                  title="Ver detalles completos"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="pedido.estado !== 'entregado'"
                  @click="mostrarMenuEstados(pedido, $event)"
                  class="text-blue-600 hover:text-blue-900 p-2"
                  title="Cambiar estado"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Progreso de items -->
            <div class="mt-3">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progreso del pedido</span>
                <span>{{ contarItemsListos(pedido) }}/{{ contarItemsTotal(pedido) }} items</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${calcularProgresoItems(pedido)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Detalles de items -->
          <div class="px-6 py-4">
            <!-- Notas del pedido -->
            <div v-if="pedido.notas" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-start">
                <svg class="w-4 h-4 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-yellow-800">Nota del pedido:</p>
                  <p class="text-sm text-yellow-700">{{ pedido.notas }}</p>
                </div>
              </div>
            </div>

            <!-- Lista de items -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Items del pedido:</h4>
              
              <!-- Loading items -->
              <div v-if="cargandoItemsPedido(pedido.id)" class="flex justify-center py-4">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              </div>

              <!-- Items -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="item in obtenerItemsPedido(pedido)"
                  :key="item.id"
                  :class="[
                    'p-3 rounded-lg border-2 transition-all duration-200',
                    getItemClasses(item.estado || 'pendiente')
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h5 class="font-medium text-gray-900 text-sm">{{ item.nombre_plato || 'Plato sin nombre' }}</h5>
                        <span class="text-xs text-gray-500">x{{ item.cantidad || 1 }}</span>
                      </div>
                      
                      <!-- Estado del item -->
                      <div class="flex items-center justify-between">
                        <EstadoBadge :estado="item.estado || 'pendiente'" size="sm" />
                        <span class="text-sm font-medium text-gray-700">
                          €{{ calcularPrecioItem(item) }}
                        </span>
                      </div>

                      <!-- Modificaciones y notas -->
                      <div v-if="item.modificaciones && Array.isArray(item.modificaciones) && item.modificaciones.length > 0" class="mt-2">
                        <p class="text-xs text-blue-600 font-medium">Modificaciones:</p>
                        <ul class="text-xs text-blue-600">
                          <li v-for="mod in item.modificaciones.slice(0, 2)" :key="mod">• {{ mod }}</li>
                          <li v-if="item.modificaciones.length > 2" class="text-blue-500">+{{ item.modificaciones.length - 2 }} más...</li>
                        </ul>
                      </div>

                      <div v-if="item.notas" class="mt-2">
                        <p class="text-xs text-orange-600">
                          <span class="font-medium">Nota:</span> {{ item.notas.length > 50 ? item.notas.substring(0, 50) + '...' : item.notas }}
                        </p>
                      </div>

                      <!-- Botones de acción rápida -->
                      <div v-if="!['servido', 'cancelado'].includes(item.estado || 'pendiente')" class="mt-2 flex gap-1">
                        <button
                          v-if="item.estado === 'pendiente'"
                          @click="cambiarEstadoItem(item.id, 'en_preparacion')"
                          class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Iniciar
                        </button>
                        <button
                          v-if="item.estado === 'en_preparacion'"
                          @click="cambiarEstadoItem(item.id, 'listo')"
                          class="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Listo
                        </button>
                        <button
                          v-if="item.estado === 'listo'"
                          @click="cambiarEstadoItem(item.id, 'servido')"
                          class="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                        >
                          Servir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Si no hay items -->
              <div v-if="!cargandoItemsPedido(pedido.id) && obtenerItemsPedido(pedido).length === 0" class="text-center py-6 text-gray-500">
                <p class="text-sm">No se encontraron items para este pedido</p>
                <button
                  @click="cargarItemsParaPedido(pedido.id)"
                  class="mt-2 text-sm text-orange-600 hover:text-orange-800"
                >
                  Cargar items
                </button>
              </div>
            </div>
          </div>

          <!-- Footer con acciones rápidas -->
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div class="flex items-center justify-between">
              <!-- Acciones de estado del pedido -->
              <div class="flex space-x-2">
                <button
                  v-if="pedido.estado === 'pendiente'"
                  @click="cambiarEstadoPedido(pedido.id, 'en_preparacion')"
                  class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Comenzar pedido
                </button>
                <button
                  v-if="pedido.estado === 'en_preparacion' && todosItemsListos(pedido)"
                  @click="cambiarEstadoPedido(pedido.id, 'listo')"
                  class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                >
                  Marcar listo
                </button>
                <button
                  v-if="pedido.estado === 'listo'"
                  @click="cambiarEstadoPedido(pedido.id, 'entregado')"
                  class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Entregar
                </button>
              </div>

              <!-- Información adicional -->
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span v-if="pedido.tipo_servicio !== 'mesa'">{{ pedido.tipo_servicio }}</span>
                <span>{{ contarItemsTotal(pedido) }} items</span>
                <span v-if="calcularTiempoTranscurrido(pedido) > 30" class="text-red-600 font-medium">
                  ⚠️ {{ calcularTiempoTranscurrido(pedido) > 60 ? 'Muy atrasado' : 'Atrasado' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="pedidosFiltrados.length === 0" class="text-center py-12">
          <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
          <p class="mt-1 text-sm text-gray-500">
            No se encontraron pedidos con los filtros seleccionados.
          </p>
        </div>
      </div>

      <!-- Vista Cocina -->
      <div v-else-if="vistaActual === 'cocina'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Items de Cocina -->
        <div class="bg-white rounded-lg shadow">
          <div class="bg-red-500 px-4 py-3">
            <h3 class="text-white font-medium">Cocina ({{ itemsCocina.length }})</h3>
          </div>
          <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
            <ItemCocinaCard
              v-for="item in itemsCocina"
              :key="item.id"
              :item="item"
              @cambiar-estado="cambiarEstadoItem"
              @cambiar-prioridad="cambiarPrioridadItem"
            />
            <div v-if="itemsCocina.length === 0" class="text-center py-8 text-gray-500 text-sm">
              No hay items pendientes en cocina
            </div>
          </div>
        </div>

        <!-- Items de Barra -->
        <div class="bg-white rounded-lg shadow">
          <div class="bg-purple-500 px-4 py-3">
            <h3 class="text-white font-medium">Barra ({{ itemsBarra.length }})</h3>
          </div>
          <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
            <ItemCocinaCard
              v-for="item in itemsBarra"
              :key="item.id"
              :item="item"
              @cambiar-estado="cambiarEstadoItem"
              @cambiar-prioridad="cambiarPrioridadItem"
            />
            <div v-if="itemsBarra.length === 0" class="text-center py-8 text-gray-500 text-sm">
              No hay items pendientes en barra
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del pedido -->
    <DetallesPedidoModal
      v-if="pedidoSeleccionado"
      :pedido="pedidoSeleccionado"
      :abierto="modalDetallesAbierto"
      @cerrar="cerrarDetallesPedido"
      @cambiar-estado="cambiarEstadoPedido"
      @cambiar-estado-item="cambiarEstadoItem"
    />

    <!-- Menu contextual para cambiar estados -->
    <MenuEstados
      v-if="menuEstadosVisible"
      :pedido="pedidoMenuEstados"
      :abierto="menuEstadosVisible"
      :posicion="posicionMenuEstados"
      @cambiar-estado="cambiarEstadoPedido"
      @cerrar="cerrarMenuEstados"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { useOrdersStore } from '@/stores/orders'
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

// Components
import PedidoCard from '@/components/pedidos/PedidoCard.vue'
import EstadoBadge from '@/components/pedidos/EstadoBadge.vue'
import TiempoTranscurrido from '@/components/pedidos/TiempoTranscurrido.vue'
import ItemCocinaCard from '@/components/pedidos/ItemCocinaCard.vue'
import DetallesPedidoModal from '@/components/pedidos/DetallesPedidoModal.vue'
import MenuEstados from '@/components/pedidos/MenuEstados.vue'

// Stores
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const ordersStore = useOrdersStore()

// Estado local
const loading = ref(false)
const error = ref<string | null>(null)
const vistaActual = ref<'lista' | 'cocina'>('lista')
const itemsPorPedido = ref<Record<string, any[]>>({})
const cargandoItems = ref<Record<string, boolean>>({})

// Filtros
const filtroEstado = ref<string[]>(['pendiente', 'confirmado', 'en_preparacion', 'listo'])
const filtroMesa = ref('')
const filtroTiempo = ref('todos')

// Modal y menu
const pedidoSeleccionado = ref<any>(null)
const modalDetallesAbierto = ref(false)
const menuEstadosVisible = ref(false)
const pedidoMenuEstados = ref<any>(null)
const posicionMenuEstados = ref({ x: 0, y: 0 })

// Computed properties principales
const pedidosActivos = computed(() => {
  return ordersStore.orders.filter(pedido => 
    !['cancelado'].includes(pedido.estado)
  )
})

const itemsPendientes = computed(() => {
  const items: any[] = []
  pedidosActivos.value.forEach(pedido => {
    const itemsPedido = obtenerItemsPedido(pedido)
    itemsPedido.forEach(item => {
      if (!['servido', 'cancelado'].includes(item.estado)) {
        items.push({
          ...item,
          numero_pedido: pedido.numero_pedido,
          numero_mesa: pedido.numero_mesa,
          tiempo_transcurrido: calcularTiempoTranscurrido(pedido)
        })
      }
    })
  })
  return items
})

const totalPedidosActivos = computed(() => pedidosActivos.value.length)

const estadoPedidos = computed(() => {
  const estados = {
    pendientes: 0,
    en_preparacion: 0,
    listos: 0,
    entregados: 0
  }
  
  pedidosActivos.value.forEach(pedido => {
    switch (pedido.estado) {
      case 'pendiente':
      case 'confirmado':
        estados.pendientes++
        break
      case 'en_preparacion':
        estados.en_preparacion++
        break
      case 'listo':
        estados.listos++
        break
      case 'entregado':
        estados.entregados++
        break
    }
  })
  
  return estados
})

// Estados disponibles para filtros
const estadosDisponibles = [
  { value: 'pendiente', label: 'Pendiente', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  { value: 'confirmado', label: 'Confirmado', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { value: 'en_preparacion', label: 'En preparación', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'listo', label: 'Listo', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 'entregado', label: 'Entregado', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
]

// Pedidos filtrados
const pedidosFiltrados = computed(() => {
  let pedidos = [...pedidosActivos.value]

  if (filtroEstado.value.length > 0) {
    pedidos = pedidos.filter(p => filtroEstado.value.includes(p.estado))
  }

  if (filtroMesa.value) {
    pedidos = pedidos.filter(p => p.numero_mesa === filtroMesa.value)
  }

  if (filtroTiempo.value !== 'todos') {
    pedidos = pedidos.filter(p => {
      const tiempoTranscurrido = calcularTiempoTranscurrido(p)
      
      switch (filtroTiempo.value) {
        case 'recientes':
          return tiempoTranscurrido <= 30
        case 'atrasados':
          return tiempoTranscurrido > 30 && tiempoTranscurrido <= 60
        case 'muy_atrasados':
          return tiempoTranscurrido > 60
        default:
          return true
      }
    })
  }

  return pedidos.sort((a, b) => new Date(a.hora_pedido).getTime() - new Date(b.hora_pedido).getTime())
})

// Items agrupados por estación
const itemsCocina = computed(() => 
  itemsPendientes.value.filter(i => !i.estacion_preparacion || i.estacion_preparacion === 'cocina')
)
const itemsBarra = computed(() => 
  itemsPendientes.value.filter(i => i.estacion_preparacion === 'barra')
)

// Mesas con pedidos
const mesasConPedidos = computed(() => {
  const mesas = [...new Set(pedidosActivos.value.map(p => p.numero_mesa))]
  return mesas.sort((a, b) => parseInt(a) - parseInt(b))
})

// Métodos principales
const refreshData = async () => {
  try {
    loading.value = true
    error.value = null
    await ordersStore.loadOrders()
    // Cargar items para cada pedido
    await cargarTodosLosItems()
  } catch (err: any) {
    error.value = err.message || 'Error al actualizar datos'
  } finally {
    loading.value = false
  }
}

const cargarTodosLosItems = async () => {
  for (const pedido of pedidosActivos.value) {
    if (!pedido.items || pedido.items.length === 0) {
      await cargarItemsParaPedido(pedido.id)
    }
  }
}

const cargarItemsParaPedido = async (pedidoId: string) => {
  if (cargandoItems.value[pedidoId]) return
  
  try {
    cargandoItems.value[pedidoId] = true
    
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
      .eq('pedido_id', pedidoId)
      .order('creado_el', { ascending: true })
    
    if (error) {
      console.error('Error cargando items del pedido:', error)
      return
    }
    
    itemsPorPedido.value[pedidoId] = data || []
    
  } catch (err) {
    console.error('Error inesperado cargando items:', err)
  } finally {
    cargandoItems.value[pedidoId] = false
  }
}

const obtenerItemsPedido = (pedido: any): any[] => {
  if (pedido.items && pedido.items.length > 0) {
    return pedido.items
  }
  return itemsPorPedido.value[pedido.id] || []
}

const cargandoItemsPedido = (pedidoId: string): boolean => {
  return cargandoItems.value[pedidoId] || false
}

const toggleFiltroEstado = (estado: string) => {
  const index = filtroEstado.value.indexOf(estado)
  if (index > -1) {
    filtroEstado.value.splice(index, 1)
  } else {
    filtroEstado.value.push(estado)
  }
}

const contarPorEstado = (estado: string) => {
  return pedidosActivos.value.filter(p => p.estado === estado).length
}

const cambiarEstadoPedido = async (pedidoId: string, nuevoEstado: string) => {
  try {
    await ordersStore.updateOrder(pedidoId, { estado: nuevoEstado })
    await refreshData()
    cerrarMenuEstados()
  } catch (err: any) {
    error.value = err.message || 'Error al cambiar estado del pedido'
  }
}

const cambiarEstadoItem = async (itemId: string, nuevoEstado: string) => {
  try {
    await ordersStore.updateOrderItem(itemId, { estado: nuevoEstado })
    await refreshData()
  } catch (err: any) {
    error.value = err.message || 'Error al cambiar estado del item'
  }
}

const cambiarPrioridadItem = async (itemId: string, nuevaPrioridad: number) => {
  try {
    await ordersStore.updateOrderItem(itemId, { prioridad: nuevaPrioridad })
    await refreshData()
  } catch (err: any) {
    error.value = err.message || 'Error al cambiar prioridad del item'
  }
}

const abrirDetallesPedido = (pedido: any) => {
  pedidoSeleccionado.value = pedido
  modalDetallesAbierto.value = true
}

const cerrarDetallesPedido = () => {
  pedidoSeleccionado.value = null
  modalDetallesAbierto.value = false
}

const mostrarMenuEstados = (pedido: any, event?: MouseEvent) => {
  pedidoMenuEstados.value = pedido
  if (event) {
    posicionMenuEstados.value = { x: event.clientX, y: event.clientY }
  }
  menuEstadosVisible.value = true
}

const cerrarMenuEstados = () => {
  menuEstadosVisible.value = false
  pedidoMenuEstados.value = null
}

const formatTime = (date: string | Date | null) => {
  if (!date) return '--:--'
  try {
    const d = new Date(date)
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return '--:--'
  }
}

const calcularTiempoTranscurrido = (pedido: any): number => {
  try {
    const ahora = new Date()
    const creacion = new Date(pedido.hora_pedido)
    return Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60))
  } catch {
    return 0
  }
}

const obtenerNombreCliente = (pedido: any): string => {
  return pedido.cliente_nombre || pedido.nombre_cliente || 'Cliente anónimo'
}

const contarItemsTotal = (pedido: any): number => {
  const items = obtenerItemsPedido(pedido)
  return items.length
}

const contarItemsListos = (pedido: any): number => {
  const items = obtenerItemsPedido(pedido)
  return items.filter((item: any) => ['listo', 'servido'].includes(item.estado)).length
}

const calcularProgresoItems = (pedido: any): number => {
  const total = contarItemsTotal(pedido)
  const listos = contarItemsListos(pedido)
  return total > 0 ? Math.round((listos / total) * 100) : 0
}

const todosItemsListos = (pedido: any): boolean => {
  const items = obtenerItemsPedido(pedido)
  return items.length > 0 && items.every((item: any) => 
    ['listo', 'servido'].includes(item.estado || 'pendiente')
  )
}

const calcularPrecioItem = (item: any): string => {
  const precio = item.precio_unitario || item.precio || 0
  const cantidad = item.cantidad || 1
  return (precio * cantidad).toFixed(2)
}

const getItemClasses = (estado: string) => {
  const classes = {
    'pendiente': 'border-yellow-300 bg-yellow-50',
    'en_preparacion': 'border-blue-300 bg-blue-50',
    'listo': 'border-green-300 bg-green-50',
    'servido': 'border-gray-300 bg-gray-50',
    'cancelado': 'border-red-300 bg-red-50'
  }
  return classes[estado as keyof typeof classes] || 'border-gray-300 bg-gray-50'
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})

onUnmounted(() => {
  // Cleanup si es necesario
})

// Watchers
watch(() => authStore.currentRestaurant?.id, async (newId) => {
  if (newId) {
    await refreshData()
  }
})

// Import necesario
import { supabase } from '@/lib/supabase'
</script>