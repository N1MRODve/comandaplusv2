<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Gestión del Salón</h1>
    <!-- Métricas del salón -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="demo-card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Ocupación</dt>
              <dd class="text-2xl font-bold text-gray-900">
                {{ demoStore.mesasOcupadas }}/{{ demoStore.totalMesas }}
              </dd>
              <dd class="text-sm text-gray-600">
                {{ demoStore.porcentajeOcupacion.toFixed(0) }}% ocupado
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="demo-card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Ingresos hoy</dt>
              <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(demoStore.ingresosDelDia) }}</dd>
              <dd class="text-sm text-gray-600">Del salón</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="demo-card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Tiempo promedio</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ tiempoPromedio }}min</dd>
              <dd class="text-sm text-gray-600">Por mesa</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="demo-card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Rotación</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ demoStore.rotacionDelDia }}</dd>
              <dd class="text-sm text-gray-600">Servicios hoy</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros rápidos -->
    <div class="demo-card p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Vista rápida:</span>
          <div class="flex space-x-2">
            <button
              @click="filtroRapido = ''"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                filtroRapido === '' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Todas ({{ demoStore.totalMesas }})
            </button>
            <button
              @click="filtroRapido = 'ocupada'"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                filtroRapido === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Ocupadas ({{ demoStore.mesasOcupadas }})
            </button>
            <button
              @click="filtroRapido = 'libre'"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                filtroRapido === 'libre' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Libres ({{ demoStore.mesasLibres }})
            </button>
            <button
              @click="filtroRapido = 'atencion'"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                filtroRapido === 'atencion' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Requiere atención ({{ mesasQueNecesitanAtencion.length }})
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Leyenda:</span>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-xs text-gray-600">Libre</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-xs text-gray-600">Ocupada</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-xs text-gray-600">Atención</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapa del salón -->
    <div class="demo-card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Mapa del Salón - Vista Interactiva
        <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Haz clic en las mesas para interactuar
        </span>
      </h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div
          v-for="mesa in mesasFiltradas"
          :key="mesa.id"
          @click="seleccionarMesa(mesa)"
          :class="[
            'relative cursor-pointer rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg',
            getMesaClasses(mesa)
          ]"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="text-lg font-bold text-gray-900">{{ mesa.numero }}</div>
              <div :class="[
                'w-3 h-3 rounded-full',
                getMesaIndicatorClasses(mesa),
                necesitaAtencionUrgente(mesa) ? 'animate-pulse' : ''
              ]"></div>
            </div>

            <div class="text-xs text-gray-600 mb-3">
              <div class="flex items-center justify-between">
                <span>{{ mesa.capacidad }} personas</span>
                <span v-if="mesa.ubicacion" class="text-gray-500 capitalize">{{ mesa.ubicacion }}</span>
              </div>
            </div>

            <!-- Información del pedido activo -->
            <div v-if="mesa.estado === 'ocupada'" class="space-y-2">
              <div v-if="pedidoActivoMesa(mesa)" class="bg-gray-50 rounded-lg p-2">
                <div class="text-xs font-medium text-gray-900">{{ pedidoActivoMesa(mesa)?.numero_pedido }}</div>
                <div class="flex items-center justify-between mt-1">
                  <span :class="[
                    'text-xs font-medium',
                    tiempoOcupacionMesa(mesa) > 60 ? 'text-red-600' :
                    tiempoOcupacionMesa(mesa) > 30 ? 'text-yellow-600' :
                    'text-green-600'
                  ]">
                    {{ tiempoOcupacionMesa(mesa) }}min
                  </span>
                  <span class="text-xs font-bold text-gray-900">€{{ pedidoActivoMesa(mesa)?.total.toFixed(2) }}</span>
                </div>
              </div>

              <div class="text-xs text-gray-600 flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {{ pedidoActivoMesa(mesa)?.comensales || 2 }} comensales
              </div>

              <div class="text-xs">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  pedidoActivoMesa(mesa)?.estado === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                  pedidoActivoMesa(mesa)?.estado === 'en_preparacion' ? 'bg-blue-100 text-blue-800' :
                  pedidoActivoMesa(mesa)?.estado === 'listo' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ getEstadoTexto(pedidoActivoMesa(mesa)?.estado || '') }}
                </span>
              </div>
            </div>

            <!-- Mesa libre -->
            <div v-else-if="mesa.estado === 'libre'" class="text-center py-2">
              <div class="text-green-600 font-medium text-sm">✅ Disponible</div>
              <div v-if="mesa.ingresos_hoy > 0" class="text-xs text-gray-500 mt-1">
                Hoy: €{{ mesa.ingresos_hoy.toFixed(0) }} ({{ mesa.servicios_hoy }} servicios)
              </div>
            </div>

            <!-- Mesa reservada -->
            <div v-else-if="mesa.estado === 'reservada'" class="text-center py-2">
              <div class="text-yellow-600 font-medium text-sm">📅 Reservada</div>
              <div v-if="mesa.nombre_reserva" class="text-xs text-gray-600 mt-1">{{ mesa.nombre_reserva }}</div>
              <div v-if="mesa.hora_reserva" class="text-xs text-gray-600">{{ mesa.hora_reserva }}</div>
            </div>

            <!-- Mesa fuera de servicio -->
            <div v-else-if="mesa.estado === 'fuera_servicio'" class="text-center py-2">
              <div class="text-blue-600 font-medium text-sm">🔧 Mantenimiento</div>
              <div v-if="mesa.tiempo_limpieza" class="text-xs text-gray-600 mt-1">
                Limpieza: {{ mesa.tiempo_limpieza }}min
              </div>
            </div>

            <!-- Indicador de atención urgente -->
            <div v-if="necesitaAtencionUrgente(mesa)" class="absolute top-2 left-2">
              <div class="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="mesasFiltradas.length === 0" class="demo-card p-12 text-center col-span-full">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay mesas que coincidan</h3>
        <p class="text-gray-600">Prueba a cambiar el filtro seleccionado</p>
      </div>
    </div>

    <!-- Modal de detalles de mesa -->
    <div v-if="mesaSeleccionada" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Mesa {{ mesaSeleccionada.numero }}</h3>
          <button @click="mesaSeleccionada = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Información básica -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado actual</label>
              <select
                v-model="mesaSeleccionada.estado"
                @change="actualizarEstadoMesa"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="libre">Libre</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
                <option value="fuera_servicio">Fuera de servicio</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
              <div class="text-lg font-medium text-gray-900 py-2">{{ mesaSeleccionada.capacidad }} personas</div>
            </div>
          </div>

          <!-- Información del pedido activo -->
          <div v-if="pedidoActivoMesa(mesaSeleccionada)" class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">🍽️ Pedido Activo</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Número:</span>
                <span class="font-medium ml-2">{{ pedidoActivoMesa(mesaSeleccionada)?.numero_pedido }}</span>
              </div>
              <div>
                <span class="text-gray-600">Cliente:</span>
                <span class="font-medium ml-2">{{ pedidoActivoMesa(mesaSeleccionada)?.cliente_nombre }}</span>
              </div>
              <div>
                <span class="text-gray-600">Comensales:</span>
                <span class="font-medium ml-2">{{ pedidoActivoMesa(mesaSeleccionada)?.comensales }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tiempo:</span>
                <span :class="[
                  'font-medium ml-2',
                  tiempoOcupacionMesa(mesaSeleccionada) > 60 ? 'text-red-600' :
                  tiempoOcupacionMesa(mesaSeleccionada) > 30 ? 'text-yellow-600' :
                  'text-green-600'
                ]">
                  {{ tiempoOcupacionMesa(mesaSeleccionada) }}min
                </span>
              </div>
              <div>
                <span class="text-gray-600">Total:</span>
                <span class="font-bold ml-2">€{{ pedidoActivoMesa(mesaSeleccionada)?.total.toFixed(2) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Estado:</span>
                <span :class="[
                  'ml-2 px-2 py-1 text-xs font-medium rounded-full',
                  getEstadoBadgeClasses(pedidoActivoMesa(mesaSeleccionada)?.estado || '')
                ]">
                  {{ getEstadoTexto(pedidoActivoMesa(mesaSeleccionada)?.estado || '') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Rendimiento de hoy -->
          <div v-if="mesaSeleccionada.ingresos_hoy > 0" class="bg-green-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">📊 Rendimiento de Hoy</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Ingresos:</span>
                <span class="font-bold ml-2 text-green-700">€{{ mesaSeleccionada.ingresos_hoy.toFixed(2) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Servicios:</span>
                <span class="font-medium ml-2">{{ mesaSeleccionada.servicios_hoy }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tiempo promedio:</span>
                <span class="font-medium ml-2">{{ mesaSeleccionada.tiempo_promedio_hoy }}min</span>
              </div>
              <div>
                <span class="text-gray-600">Rotación:</span>
                <span class="font-medium ml-2">{{ (mesaSeleccionada.servicios_hoy / 8).toFixed(1) }}/hora</span>
              </div>
            </div>
          </div>

          <!-- Historial reciente -->
          <div v-if="mesaSeleccionada.historial_reciente.length > 0">
            <h4 class="font-medium text-gray-900 mb-3">📋 Historial Reciente</h4>
            <div class="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div v-for="evento in mesaSeleccionada.historial_reciente.slice(0, 3)" :key="evento.id" class="text-xs text-gray-600 mb-2 last:mb-0">
                <span class="font-medium">{{ formatearFecha(evento.fecha) }}</span> - {{ evento.descripcion }}
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
          <button
            v-if="mesaSeleccionada.estado === 'ocupada'"
            @click="liberarMesa(mesaSeleccionada)"
            class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            ✅ Liberar mesa
          </button>
          <button
            v-if="mesaSeleccionada.estado === 'libre'"
            @click="ocuparMesa(mesaSeleccionada)"
            class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            🔴 Marcar ocupada
          </button>
          <button
            @click="mesaSeleccionada = null"
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDemoStore } from '@/demo/stores/useDemoStore'

const demoStore = useDemoStore()

// Estado local
const filtroRapido = ref('')
const mesaSeleccionada = ref<any>(null)

// Computed
const mesasFiltradas = computed(() => {
  let mesas = demoStore.mesas
  
  if (filtroRapido.value) {
    if (filtroRapido.value === 'atencion') {
      mesas = mesasQueNecesitanAtencion.value
    } else {
      mesas = mesas.filter(mesa => mesa.estado === filtroRapido.value)
    }
  }
  
  return mesas
})

const mesasQueNecesitanAtencion = computed(() => {
  return demoStore.mesas.filter(mesa => necesitaAtencionUrgente(mesa))
})

const tiempoPromedio = computed(() => {
  const mesasConTiempo = demoStore.mesas.filter(mesa => 
    mesa.estado === 'ocupada' && mesa.hora_ocupacion
  )
  
  if (mesasConTiempo.length === 0) return 45 // Promedio por defecto
  
  const sumaMinutos = mesasConTiempo.reduce((sum, mesa) => 
    sum + demoStore.calcularTiempoTranscurrido(mesa.hora_ocupacion!), 0
  )
  
  return Math.round(sumaMinutos / mesasConTiempo.length)
})

// Métodos
const getMesaClasses = (mesa: any) => {
  if (necesitaAtencionUrgente(mesa)) {
    return 'bg-red-50 border-red-300 hover:bg-red-100'
  }
  
  switch (mesa.estado) {
    case 'libre':
      return 'bg-green-50 border-green-200 hover:bg-green-100'
    case 'ocupada':
      return 'bg-red-50 border-red-200 hover:bg-red-100'
    case 'reservada':
      return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    case 'fuera_servicio':
      return 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    default:
      return 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  }
}

const getMesaIndicatorClasses = (mesa: any) => {
  if (necesitaAtencionUrgente(mesa)) {
    return 'bg-red-500'
  }
  
  if (mesa.estado === 'pagada') {
    return 'bg-green-500 animate-pulse'
  }
  
  switch (mesa.estado) {
    case 'libre': return 'bg-green-500'
    case 'ocupada': return 'bg-red-500'
    case 'reservada': return 'bg-yellow-500'
    case 'fuera_servicio': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}

const necesitaAtencionUrgente = (mesa: any) => {
  if (mesa.estado !== 'ocupada') return false
  
  const pedido = pedidoActivoMesa(mesa)
  if (!pedido) return false
  
  const tiempoOcupacion = tiempoOcupacionMesa(mesa)
  return tiempoOcupacion > 60 || pedido.estado === 'listo'
}

const pedidoActivoMesa = (mesa: any) => {
  return demoStore.pedidosActivos.find(p => p.numero_mesa === mesa.numero)
}

const tiempoOcupacionMesa = (mesa: any) => {
  if (!mesa.hora_ocupacion) return 0
  return demoStore.calcularTiempoTranscurrido(mesa.hora_ocupacion)
}

const getEstadoTexto = (estado: string): string => {
  const textos: Record<string, string> = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En preparación',
    'listo': 'Listo',
    'entregado': 'Entregado',
    'servido': 'Servido'
  }
  return textos[estado] || estado
}

const getEstadoBadgeClasses = (estado: string) => {
  const classes: Record<string, string> = {
    'pendiente': 'bg-orange-100 text-orange-800',
    'confirmado': 'bg-yellow-100 text-yellow-800',
    'en_preparacion': 'bg-blue-100 text-blue-800',
    'listo': 'bg-green-100 text-green-800',
    'entregado': 'bg-gray-100 text-gray-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
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

// Acciones
const seleccionarMesa = (mesa: any) => {
  mesaSeleccionada.value = { ...mesa }
}

const actualizarEstadoMesa = () => {
  if (!mesaSeleccionada.value) return
  
  demoStore.actualizarEstadoMesa(mesaSeleccionada.value.id, mesaSeleccionada.value.estado)
  
  const mensaje = `Mesa ${mesaSeleccionada.value.numero} marcada como ${mesaSeleccionada.value.estado}`
  mostrarNotificacion(mensaje, 'success')
  
  // Cerrar modal
  mesaSeleccionada.value = null
}

const liberarMesa = (mesa: any) => {
  demoStore.actualizarEstadoMesa(mesa.id, 'libre')
  mostrarNotificacion(`Mesa ${mesa.numero} liberada`, 'success')
  mesaSeleccionada.value = null
}

const ocuparMesa = (mesa: any) => {
  demoStore.actualizarEstadoMesa(mesa.id, 'ocupada')
  mostrarNotificacion(`Mesa ${mesa.numero} marcada como ocupada`, 'success')
  mesaSeleccionada.value = null
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
  }, 2000)
}
</script>