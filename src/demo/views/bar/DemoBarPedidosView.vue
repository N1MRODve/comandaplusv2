<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
    <!-- Header específico para pedidos de bar -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">Gestión de Pedidos - Bar</h1>
            <p class="text-purple-100 mt-1">
              The Cocktail Lounge · Control de barra y cocina
            </p>
          </div>
          
          <div class="flex items-center space-x-6">
            <!-- Stats rápidas -->
            <div class="flex items-center space-x-6">
              <div class="text-center">
                <div class="text-lg font-semibold text-purple-100">{{ barPedidos.filter(p => p.estado === 'pendiente').length }}</div>
                <div class="text-xs text-purple-200">Pendientes</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-blue-200">{{ barPedidos.filter(p => p.estado === 'en_preparacion').length }}</div>
                <div class="text-xs text-purple-200">En barra</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-green-200">{{ barPedidos.filter(p => p.estado === 'listo').length }}</div>
                <div class="text-xs text-purple-200">Listos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filtros específicos para bar -->
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
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
            <!-- Filtro por ubicación -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Ubicación:</label>
              <select
                v-model="filtroUbicacion"
                class="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Todas</option>
                <option value="barra">Barra</option>
                <option value="mesa">Mesas</option>
                <option value="terraza">Terraza</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <!-- Botón simular -->
            <button
              @click="simularNuevoPedidoBar"
              class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Simular Pedido</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de pedidos del bar -->
      <div class="space-y-6">
        <div
          v-for="pedido in pedidosFiltrados"
          :key="pedido.id"
          :class="[
            'bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl transition-all duration-200 hover:shadow-2xl',
            calcularTiempoTranscurrido(pedido.hora_pedido) > 45 && 'border-red-300 bg-red-50/50',
            calcularTiempoTranscurrido(pedido.hora_pedido) > 20 && calcularTiempoTranscurrido(pedido.hora_pedido) <= 45 && 'border-yellow-300 bg-yellow-50/50'
          ]"
        >
          <!-- Header del pedido -->
          <div class="px-6 py-4 border-b border-gray-200/50">
            <div class="flex items-center justify-between">
              <!-- Información básica -->
              <div class="flex items-center space-x-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ pedido.numero_pedido }}</h3>
                  <p class="text-sm text-gray-500">{{ formatTime(pedido.hora_pedido) }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    pedido.tipo_servicio === 'barra' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  ]">
                    {{ pedido.numero_mesa }}
                  </span>
                  <span :class="getEstadoBadgeClasses(pedido.estado)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getEstadoTexto(pedido.estado) }}
                  </span>
                </div>
              </div>

              <!-- Información del cliente y total -->
              <div class="flex items-center space-x-6">
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ pedido.cliente_nombre }}</p>
                  <p class="text-lg font-bold text-gray-900">€{{ formatCurrency(pedido.total) }}</p>
                </div>
                <div class="text-right">
                  <div :class="[
                    'text-sm font-medium',
                    calcularTiempoTranscurrido(pedido.hora_pedido) > 45 ? 'text-red-600' :
                    calcularTiempoTranscurrido(pedido.hora_pedido) > 20 ? 'text-yellow-600' :
                    'text-green-600'
                  ]">
                    {{ calcularTiempoTranscurrido(pedido.hora_pedido) }} min
                  </div>
                  <p class="text-xs text-gray-500">transcurridos</p>
                </div>
              </div>
            </div>

            <!-- Progreso de items -->
            <div class="mt-3">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progreso del pedido</span>
                <span>{{ contarItemsListos(pedido) }}/{{ pedido.items.length }} items</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${calcularProgresoItems(pedido)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Detalles de items -->
          <div class="px-6 py-4">
            <!-- Notas del pedido -->
            <div v-if="pedido.notas" class="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div class="flex items-start">
                <svg class="w-4 h-4 text-purple-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-purple-800">Nota del pedido:</p>
                  <p class="text-sm text-purple-700">{{ pedido.notas }}</p>
                </div>
              </div>
            </div>

            <!-- Lista de items -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Bebidas y tapas del pedido:</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="item in pedido.items"
                  :key="item.id"
                  :class="[
                    'p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md',
                    getItemClasses(item.estado)
                  ]"
                  @click="cambiarEstadoItem(item)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h5 class="font-medium text-gray-900 text-sm">{{ item.nombre_plato }}</h5>
                        <span class="text-xs text-gray-500">x{{ item.cantidad }}</span>
                      </div>
                      
                      <!-- Estado del item -->
                      <div class="flex items-center justify-between mb-2">
                        <span :class="getItemEstadoBadgeClasses(item.estado)" class="px-2 py-1 rounded text-xs font-medium">
                          {{ getEstadoTexto(item.estado) }}
                        </span>
                        <span class="text-sm font-medium text-gray-700">
                          €{{ formatCurrency(item.subtotal) }}
                        </span>
                      </div>

                      <!-- Modificaciones y notas -->
                      <div v-if="item.modificaciones && item.modificaciones.length > 0" class="mb-2">
                        <p class="text-xs text-blue-600 font-medium">Modificaciones:</p>
                        <ul class="text-xs text-blue-600">
                          <li v-for="mod in item.modificaciones.slice(0, 2)" :key="mod">• {{ mod }}</li>
                          <li v-if="item.modificaciones.length > 2" class="text-blue-500">+{{ item.modificaciones.length - 2 }} más...</li>
                        </ul>
                      </div>

                      <div v-if="item.notas" class="mb-2">
                        <p class="text-xs text-orange-600">
                          <span class="font-medium">Nota:</span> {{ item.notas }}
                        </p>
                      </div>

                      <!-- Botón de acción rápida -->
                      <div v-if="!['servido', 'cancelado'].includes(item.estado)" class="mt-2">
                        <button
                          @click.stop="avanzarEstadoItem(item)"
                          :class="[
                            'w-full px-2 py-1 rounded text-xs font-medium transition-colors',
                            item.estado === 'pendiente' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                            item.estado === 'en_preparacion' ? 'bg-green-500 text-white hover:bg-green-600' :
                            item.estado === 'listo' ? 'bg-gray-500 text-white hover:bg-gray-600' :
                            'bg-gray-300 text-gray-600'
                          ]"
                        >
                          {{ 
                            item.estado === 'pendiente' ? 'Iniciar en barra' :
                            item.estado === 'en_preparacion' ? 'Marcar como listo' :
                            item.estado === 'listo' ? 'Servir' :
                            'Completado'
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con acciones del pedido -->
          <div class="px-6 py-3 bg-gray-50/50 border-t border-gray-200/50 rounded-b-2xl">
            <div class="flex items-center justify-between">
              <!-- Acciones de estado del pedido -->
              <div class="flex space-x-2">
                <button
                  v-if="pedido.estado === 'pendiente'"
                  @click="cambiarEstadoPedido(pedido.id, 'en_preparacion')"
                  class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Comenzar en barra
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
                  Servir
                </button>
              </div>

              <!-- Información adicional -->
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>{{ pedido.items.length }} items</span>
                <span>{{ pedido.comensales }} personas</span>
                <span>{{ pedido.tipo_servicio === 'barra' ? '🍸 Barra' : '🪑 Mesa' }}</span>
                <span v-if="calcularTiempoTranscurrido(pedido.hora_pedido) > 20" class="text-red-600 font-medium">
                  ⚠️ {{ calcularTiempoTranscurrido(pedido.hora_pedido) > 45 ? 'Muy atrasado' : 'Atrasado' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="pedidosFiltrados.length === 0" class="bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
          <p class="text-gray-600 mb-4">
            No se encontraron pedidos con los filtros seleccionados.
          </p>
          <button
            @click="simularNuevoPedidoBar"
            class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Simular nuevo pedido de bar
          </button>
        </div>
      </div>

      <!-- Vista de barra y cocina -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <!-- Items de Barra -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
          <div class="bg-purple-500 px-4 py-3 rounded-t-2xl">
            <h3 class="text-white font-medium">🍸 Barra ({{ itemsBarra.length }})</h3>
          </div>
          <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="item in itemsBarra"
              :key="item.id"
              :class="[
                'bg-white border rounded-lg p-3 transition-all duration-200 cursor-pointer hover:shadow-md',
                calcularTiempoTranscurrido(item.hora_pedido) > 15 && 'border-yellow-300 bg-yellow-50',
                calcularTiempoTranscurrido(item.hora_pedido) > 30 && 'border-red-300 bg-red-50'
              ]"
              @click="avanzarEstadoItem(item)"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-semibold text-sm text-gray-900">{{ item.numero_pedido }}</div>
                  <div class="text-xs text-gray-500">{{ item.numero_mesa }}</div>
                </div>
                <div class="text-right">
                  <div :class="[
                    'text-sm font-medium',
                    calcularTiempoTranscurrido(item.hora_pedido) > 30 ? 'text-red-600' :
                    calcularTiempoTranscurrido(item.hora_pedido) > 15 ? 'text-yellow-600' :
                    'text-green-600'
                  ]">
                    {{ calcularTiempoTranscurrido(item.hora_pedido) }} min
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900 text-sm">{{ item.nombre_plato }}</h4>
                  <span class="text-sm font-semibold text-gray-700">x{{ item.cantidad }}</span>
                </div>
                
                <div v-if="item.modificaciones && item.modificaciones.length > 0" class="mt-1">
                  <div class="text-xs text-blue-600">
                    <span class="font-medium">Modificaciones:</span>
                    <ul class="list-disc list-inside mt-1">
                      <li v-for="mod in item.modificaciones" :key="mod">{{ mod }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span :class="getItemEstadoBadgeClasses(item.estado)" class="px-2 py-1 rounded text-xs font-medium">
                  {{ getEstadoTexto(item.estado) }}
                </span>
                <button
                  @click.stop="avanzarEstadoItem(item)"
                  :class="[
                    'px-3 py-1 rounded text-xs font-medium transition-colors',
                    item.estado === 'pendiente' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                    item.estado === 'en_preparacion' ? 'bg-green-500 text-white hover:bg-green-600' :
                    'bg-gray-300 text-gray-600'
                  ]"
                >
                  {{ 
                    item.estado === 'pendiente' ? 'Preparar' :
                    item.estado === 'en_preparacion' ? 'Listo' :
                    'Servir'
                  }}
                </button>
              </div>
            </div>

            <div v-if="itemsBarra.length === 0" class="text-center py-8 text-gray-500 text-sm">
              🎉 ¡Excelente! No hay bebidas pendientes en barra
            </div>
          </div>
        </div>

        <!-- Items de Cocina (tapas) -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
          <div class="bg-orange-500 px-4 py-3 rounded-t-2xl">
            <h3 class="text-white font-medium">🍽️ Cocina ({{ itemsCocina.length }})</h3>
          </div>
          <div class="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="item in itemsCocina"
              :key="item.id"
              class="bg-white border rounded-lg p-3 transition-all duration-200 cursor-pointer hover:shadow-md"
              @click="avanzarEstadoItem(item)"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-semibold text-sm text-gray-900">{{ item.numero_pedido }}</div>
                  <div class="text-xs text-gray-500">{{ item.numero_mesa }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-green-600">{{ calcularTiempoTranscurrido(item.hora_pedido) }} min</div>
                </div>
              </div>

              <div class="mb-3">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900 text-sm">{{ item.nombre_plato }}</h4>
                  <span class="text-sm font-semibold text-gray-700">x{{ item.cantidad }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span :class="getItemEstadoBadgeClasses(item.estado)" class="px-2 py-1 rounded text-xs font-medium">
                  {{ getEstadoTexto(item.estado) }}
                </span>
                <button
                  @click.stop="avanzarEstadoItem(item)"
                  :class="[
                    'px-3 py-1 rounded text-xs font-medium transition-colors',
                    item.estado === 'pendiente' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                    item.estado === 'en_preparacion' ? 'bg-green-500 text-white hover:bg-green-600' :
                    'bg-gray-300 text-gray-600'
                  ]"
                >
                  {{ 
                    item.estado === 'pendiente' ? 'Preparar' :
                    item.estado === 'en_preparacion' ? 'Listo' :
                    'Servir'
                  }}
                </button>
              </div>
            </div>

            <div v-if="itemsCocina.length === 0" class="text-center py-8 text-gray-500 text-sm">
              🎉 ¡Perfecto! No hay tapas pendientes en cocina
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { barAnalytics } from '@/demo/data/bar/mockAnalytics'
import { barPedidos } from '@/demo/data/bar/mockPedidos'
import { barMesas } from '@/demo/data/bar/mockMesas'

// Estado local
const filtroEstado = ref<string[]>(['pendiente', 'confirmado', 'en_preparacion', 'listo'])
const filtroUbicacion = ref('')

// Estados disponibles para filtros
const estadosDisponibles = [
  { value: 'pendiente', label: 'Pendiente', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  { value: 'confirmado', label: 'Confirmado', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { value: 'en_preparacion', label: 'En barra', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'listo', label: 'Listo', bgColor: 'bg-green-100', textColor: 'text-green-800' }
]

// Computed
const pedidosFiltrados = computed(() => {
  let pedidos = barPedidos.filter(p => !['entregado', 'pagado', 'cancelado'].includes(p.estado))

  if (filtroEstado.value.length > 0) {
    pedidos = pedidos.filter(p => filtroEstado.value.includes(p.estado))
  }

  if (filtroUbicacion.value) {
    if (filtroUbicacion.value === 'barra') {
      pedidos = pedidos.filter(p => p.tipo_servicio === 'barra')
    } else if (filtroUbicacion.value === 'mesa') {
      pedidos = pedidos.filter(p => p.tipo_servicio === 'mesa')
    }
  }

  return pedidos.sort((a, b) => new Date(a.hora_pedido).getTime() - new Date(b.hora_pedido).getTime())
})

const itemsBarra = computed(() => {
  const items: any[] = []
  pedidosFiltrados.value.forEach(pedido => {
    pedido.items.forEach(item => {
      if (!['servido', 'cancelado'].includes(item.estado) && item.estacion_preparacion === 'barra') {
        items.push({
          ...item,
          numero_pedido: pedido.numero_pedido,
          numero_mesa: pedido.numero_mesa,
          hora_pedido: pedido.hora_pedido
        })
      }
    })
  })
  return items
})

const itemsCocina = computed(() => {
  const items: any[] = []
  pedidosFiltrados.value.forEach(pedido => {
    pedido.items.forEach(item => {
      if (!['servido', 'cancelado'].includes(item.estado) && (!item.estacion_preparacion || item.estacion_preparacion === 'cocina')) {
        items.push({
          ...item,
          numero_pedido: pedido.numero_pedido,
          numero_mesa: pedido.numero_mesa,
          hora_pedido: pedido.hora_pedido
        })
      }
    })
  })
  return items
})

// Métodos
const toggleFiltroEstado = (estado: string) => {
  const index = filtroEstado.value.indexOf(estado)
  if (index > -1) {
    filtroEstado.value.splice(index, 1)
  } else {
    filtroEstado.value.push(estado)
  }
}

const contarPorEstado = (estado: string) => {
  return barPedidos.filter(p => p.estado === estado).length
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const calcularTiempoTranscurrido = (fechaCreacion: string): number => {
  const ahora = new Date()
  const creacion = new Date(fechaCreacion)
  return Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60))
}

const getEstadoTexto = (estado: string): string => {
  const textos: Record<string, string> = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En barra',
    'listo': 'Listo',
    'entregado': 'Servido',
    'servido': 'Servido',
    'cancelado': 'Cancelado'
  }
  return textos[estado] || estado
}

const getEstadoBadgeClasses = (estado: string) => {
  const classes: Record<string, string> = {
    'pendiente': 'bg-orange-100 text-orange-800',
    'confirmado': 'bg-yellow-100 text-yellow-800',
    'en_preparacion': 'bg-blue-100 text-blue-800',
    'listo': 'bg-green-100 text-green-800',
    'entregado': 'bg-gray-100 text-gray-800',
    'cancelado': 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getItemEstadoBadgeClasses = (estado: string) => {
  return getEstadoBadgeClasses(estado)
}

const getItemClasses = (estado: string) => {
  const classes: Record<string, string> = {
    'pendiente': 'border-yellow-300 bg-yellow-50',
    'en_preparacion': 'border-blue-300 bg-blue-50',
    'listo': 'border-green-300 bg-green-50',
    'servido': 'border-gray-300 bg-gray-50',
    'cancelado': 'border-red-300 bg-red-50'
  }
  return classes[estado] || 'border-gray-300 bg-gray-50'
}

const contarItemsListos = (pedido: any): number => {
  return pedido.items.filter((item: any) => ['listo', 'servido'].includes(item.estado)).length
}

const calcularProgresoItems = (pedido: any): number => {
  const total = pedido.items.length
  const listos = contarItemsListos(pedido)
  return total > 0 ? Math.round((listos / total) * 100) : 0
}

const todosItemsListos = (pedido: any): boolean => {
  return pedido.items.length > 0 && pedido.items.every((item: any) => 
    ['listo', 'servido'].includes(item.estado)
  )
}

// Acciones
const cambiarEstadoPedido = (pedidoId: string, nuevoEstado: string) => {
  const pedido = barPedidos.find(p => p.id === pedidoId)
  if (pedido) {
    pedido.estado = nuevoEstado as any
    mostrarNotificacion(`Pedido actualizado a "${getEstadoTexto(nuevoEstado)}"`, 'success')
  }
}

const cambiarEstadoItem = (item: any) => {
  const estadosDisponibles: Record<string, string> = {
    'pendiente': 'en_preparacion',
    'en_preparacion': 'listo',
    'listo': 'servido'
  }
  
  const nuevoEstado = estadosDisponibles[item.estado]
  if (nuevoEstado) {
    item.estado = nuevoEstado
    mostrarNotificacion(`${item.nombre_plato} → ${getEstadoTexto(nuevoEstado)}`, 'success')
  }
}

const avanzarEstadoItem = (item: any) => {
  cambiarEstadoItem(item)
}

const simularNuevoPedidoBar = () => {
  const mesasLibres = barMesas.filter(m => m.estado === 'libre')
  if (mesasLibres.length === 0) {
    mostrarNotificacion('No hay espacios libres para simular un nuevo pedido', 'warning')
    return
  }
  
  const mesaAleatoria = mesasLibres[Math.floor(Math.random() * mesasLibres.length)]
  const clientesDemo = ['Alex Martín', 'Sofia López', 'Carlos Vega', 'Elena Ruiz', 'Miguel Santos']
  const clienteAleatorio = clientesDemo[Math.floor(Math.random() * clientesDemo.length)]
  
  mostrarNotificacion(`¡Nuevo pedido de bar simulado! En ${mesaAleatoria.numero}`, 'success')
}

const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'warning' | 'error') => {
  const colores = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 ${colores[tipo]} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`
  notification.textContent = mensaje
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}
</script>

<style scoped>
/* Estilos específicos para el demo del bar */
.bar-glow {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>