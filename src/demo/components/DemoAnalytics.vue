<template>
  <div class="space-y-8">
    <!-- Controles de período -->
    <div class="demo-card p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Analytics y Reportes</h2>
          <p class="text-sm text-gray-600">
            Análisis detallado del rendimiento del restaurante
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Selector de período -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Período:</label>
            <select 
              v-model="periodoSeleccionado"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 3 meses</option>
            </select>
          </div>
          
          <!-- Botón exportar -->
          <div class="relative">
            <button 
              @click="showExportMenu = !showExportMenu"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exportar</span>
            </button>
            
            <!-- Menú de exportación -->
            <div v-if="showExportMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
              <div class="py-1">
                <button 
                  @click="exportData('ventas', 'csv')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  📊 Ventas (CSV)
                </button>
                <button 
                  @click="exportData('platos', 'csv')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  🍽️ Productos (CSV)
                </button>
                <button 
                  @click="exportData('empleados', 'csv')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  👥 Empleados (CSV)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Ventas del período -->
      <div class="demo-card p-6 hover:shadow-2xl transition-all duration-300">
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
              <dt class="text-sm font-medium text-gray-500 truncate">Ventas del Período</dt>
              <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(ventasDelPeriodo) }}</dd>
              <dd class="text-sm text-green-600">
                +{{ demoStore.analytics.comparativa_periodos.crecimiento_ventas.toFixed(1) }}% vs período anterior
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Pedidos del período -->
      <div class="demo-card p-6 hover:shadow-2xl transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Pedidos del Período</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ pedidosDelPeriodo }}</dd>
              <dd class="text-sm text-blue-600">
                +{{ demoStore.analytics.comparativa_periodos.crecimiento_pedidos.toFixed(1) }}% vs período anterior
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Ticket medio -->
      <div class="demo-card p-6 hover:shadow-2xl transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Ticket Medio</dt>
              <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(ticketMedio) }}</dd>
              <dd class="text-sm text-gray-600">
                vs €{{ formatCurrency(demoStore.analytics.ticket_medio_hoy) }} hoy
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Hora pico -->
      <div class="demo-card p-6 hover:shadow-2xl transition-all duration-300">
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
              <dt class="text-sm font-medium text-gray-500 truncate">Hora Pico</dt>
              <dd class="text-2xl font-bold text-gray-900">
                {{ horaPico ? formatHour(horaPico.hora) : 'N/A' }}
              </dd>
              <dd v-if="horaPico" class="text-sm text-gray-600">
                {{ horaPico.pedidos }} pedidos ({{ horaPico.porcentaje_dia.toFixed(1) }}%)
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos principales -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Ventas por día -->
      <div class="demo-card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Evolución de Ventas
        </h3>
        
        <div class="space-y-4">
          <div 
            v-for="venta in ventasPorDiaFiltradas.slice(-10)" 
            :key="venta.fecha"
            class="flex items-center space-x-4"
          >
            <div class="w-20 text-sm text-gray-600">
              {{ formatShortDate(venta.fecha) }}
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    class="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    :style="{ width: `${getVentasBarWidth(venta.total_ventas)}%` }"
                  >
                    <span class="text-xs font-medium text-white">
                      €{{ formatCurrency(venta.total_ventas) }}
                    </span>
                  </div>
                </div>
                <div class="w-16 text-sm text-gray-600 text-right">
                  {{ venta.numero_pedidos }} pedidos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Análisis por horas -->
      <div class="demo-card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Distribución por Horas
        </h3>
        
        <div class="space-y-2">
          <div 
            v-for="hora in getHorasActivas()" 
            :key="hora.hora"
            class="flex items-center space-x-3"
          >
            <div class="w-12 text-sm text-gray-600">
              {{ formatHour(hora.hora) }}
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    class="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500"
                    :style="{ width: `${hora.porcentaje_dia}%` }"
                  ></div>
                </div>
                <div class="w-12 text-xs text-gray-600 text-right">
                  {{ hora.pedidos }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos y empleados -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Productos más vendidos -->
      <div class="demo-card">
        <div class="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Top Productos
            <span class="ml-2 demo-badge bg-orange-100 text-orange-800">
              {{ demoStore.analytics.platos_populares.length }}
            </span>
          </h3>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          <div class="space-y-4">
            <div 
              v-for="(producto, index) in demoStore.analytics.platos_populares" 
              :key="producto.plato_id"
              class="flex items-center space-x-3"
            >
              <div class="flex-shrink-0">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                ]">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ producto.nombre_plato }}</p>
                <p class="text-sm text-gray-600">
                  {{ producto.categoria }} · {{ producto.cantidad_vendida }} vendidos
                </p>
                <p class="text-sm text-green-600 font-medium">
                  €{{ formatCurrency(producto.ingresos_totales) }} ({{ producto.porcentaje_total.toFixed(1) }}%)
                </p>
              </div>
              <div class="flex-shrink-0">
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: `${(producto.cantidad_vendida / Math.max(...demoStore.analytics.platos_populares.map(p => p.cantidad_vendida))) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rendimiento de empleados -->
      <div class="demo-card">
        <div class="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Rendimiento del Personal
            <span class="ml-2 demo-badge bg-indigo-100 text-indigo-800">
              {{ demoStore.analytics.rendimiento_empleados.length }} empleados
            </span>
          </h3>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          <div class="space-y-4">
            <div 
              v-for="(empleado, index) in demoStore.analytics.rendimiento_empleados" 
              :key="empleado.empleado_id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-indigo-100 text-indigo-600'
                  ]">
                    {{ empleado.nombre_empleado.split(' ').map(n => n[0]).join('').toUpperCase() }}
                  </div>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ empleado.nombre_empleado }}</p>
                  <p class="text-sm text-gray-600">
                    {{ empleado.pedidos_atendidos }} pedidos · {{ empleado.horas_trabajadas }}h trabajadas
                  </p>
                  <p class="text-xs text-green-600 font-medium">
                    €{{ formatCurrency(empleado.ventas_por_hora) }}/hora
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">€{{ formatCurrency(empleado.ventas_generadas) }}</p>
                <p class="text-sm text-gray-600">en ventas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparativa de períodos -->
    <div class="demo-card p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Comparativa de Rendimiento
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h4 class="font-semibold text-green-900 mb-4">📈 Crecimiento de Ventas</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-green-700">Período actual:</span>
              <span class="font-bold text-green-900">€{{ formatCurrency(demoStore.analytics.comparativa_periodos.ventas_actuales) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-green-700">Período anterior:</span>
              <span class="font-medium text-green-800">€{{ formatCurrency(demoStore.analytics.comparativa_periodos.ventas_anteriores) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-green-200">
              <span class="text-green-700 font-medium">Crecimiento:</span>
              <span class="font-bold text-green-900 text-lg">
                +{{ demoStore.analytics.comparativa_periodos.crecimiento_ventas.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h4 class="font-semibold text-blue-900 mb-4">📊 Crecimiento de Pedidos</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-blue-700">Período actual:</span>
              <span class="font-bold text-blue-900">{{ demoStore.analytics.comparativa_periodos.pedidos_actuales }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Período anterior:</span>
              <span class="font-medium text-blue-800">{{ demoStore.analytics.comparativa_periodos.pedidos_anteriores }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-blue-200">
              <span class="text-blue-700 font-medium">Crecimiento:</span>
              <span class="font-bold text-blue-900 text-lg">
                +{{ demoStore.analytics.comparativa_periodos.crecimiento_pedidos.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export menu overlay -->
    <div v-if="showExportMenu" @click="showExportMenu = false" class="fixed inset-0 z-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDemoStore } from '@/demo/stores/useDemoStore'

const demoStore = useDemoStore()

// Estado local
const showExportMenu = ref(false)
const periodoSeleccionado = ref('30d')

// Computed
const ventasPorDiaFiltradas = computed(() => {
  const dias = periodoSeleccionado.value === '7d' ? 7 : periodoSeleccionado.value === '30d' ? 30 : 90
  return demoStore.analytics.ventas_por_dia.slice(-dias)
})

const ventasDelPeriodo = computed(() => {
  return ventasPorDiaFiltradas.value.reduce((sum, dia) => sum + dia.total_ventas, 0)
})

const pedidosDelPeriodo = computed(() => {
  return ventasPorDiaFiltradas.value.reduce((sum, dia) => sum + dia.numero_pedidos, 0)
})

const ticketMedio = computed(() => {
  const ventas = ventasDelPeriodo.value
  const pedidos = pedidosDelPeriodo.value
  return pedidos > 0 ? ventas / pedidos : 0
})

const horaPico = computed(() => {
  if (demoStore.analytics.analisis_horario.length === 0) return null
  return demoStore.analytics.analisis_horario.reduce((max, hora) => 
    hora.pedidos > max.pedidos ? hora : max
  )
})

// Métodos de formato
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date)
}

const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const getVentasBarWidth = (ventas: number): number => {
  if (ventasPorDiaFiltradas.value.length === 0) return 0
  const maxVentas = Math.max(...ventasPorDiaFiltradas.value.map(v => v.total_ventas))
  return maxVentas > 0 ? (ventas / maxVentas) * 100 : 0
}

const getHorasActivas = () => {
  return demoStore.analytics.analisis_horario.filter(h => h.pedidos > 0).slice(0, 12)
}

// Métodos de exportación
const exportData = (tipo: 'ventas' | 'platos' | 'empleados', formato: 'csv' | 'json') => {
  try {
    demoStore.exportarDatos(formato, tipo)
    showExportMenu.value = false
    mostrarNotificacion(`Datos de ${tipo} exportados en formato ${formato.toUpperCase()}`, 'success')
  } catch (error) {
    console.error('Error exportando datos:', error)
    mostrarNotificacion('Error al exportar los datos', 'error')
  }
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