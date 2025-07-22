<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Reportes
              </span>
            </div>
            <p class="text-sm text-gray-600">
              Análisis detallado de rendimiento
              <span v-if="authStore.currentRestaurant">
                · {{ authStore.currentRestaurant.nombre }}
              </span>
            </p>
            <p v-if="fechaSeleccionada.inicio && fechaSeleccionada.fin" class="text-xs text-gray-500">
              Período: {{ formatDateRange(fechaSeleccionada.inicio, fechaSeleccionada.fin) }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Selector de período -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Período:</label>
              <select 
                v-model="periodoSeleccionado"
                @change="handlePeriodChange"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 3 meses</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            <!-- Fechas personalizadas -->
            <div v-if="periodoSeleccionado === 'custom'" class="flex items-center space-x-2">
              <input 
                v-model="fechaCustom.inicio"
                type="date"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
              <span class="text-gray-500">-</span>
              <input 
                v-model="fechaCustom.fin"
                type="date"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
              <button 
                @click="aplicarFechasCustom"
                class="bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-600 transition-colors text-sm"
              >
                Aplicar
              </button>
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
              <div v-if="showExportMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div class="py-1">
                  <button 
                    @click="exportData('ventas', 'csv')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ventas (CSV)
                  </button>
                  <button 
                    @click="exportData('platos', 'csv')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Productos (CSV)
                  </button>
                  <button 
                    @click="exportData('empleados', 'csv')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Empleados (CSV)
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Botón actualizar -->
            <button 
              @click="refreshAnalytics"
              :disabled="analyticsStore.loading"
              class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <svg 
                v-if="analyticsStore.loading" 
                class="animate-spin h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ analyticsStore.loading ? 'Actualizando...' : 'Actualizar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="analyticsStore.loading && !analyticsStore.hasData" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span class="ml-3 text-gray-600">Cargando analytics...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="analyticsStore.error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar analytics</h3>
        <p class="text-red-600 mb-4">{{ analyticsStore.error }}</p>
        <button 
          @click="initializeAnalytics"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- KPIs principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Ventas del período -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
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
                <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(analyticsStore.ventasUltimos7Dias) }}</dd>
                <dd v-if="analyticsStore.comparativaPeriodos" class="text-sm text-gray-600">
                  <span :class="analyticsStore.comparativaPeriodos.crecimiento_ventas > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ analyticsStore.comparativaPeriodos.crecimiento_ventas > 0 ? '+' : '' }}{{ analyticsStore.comparativaPeriodos.crecimiento_ventas.toFixed(1) }}%
                  </span>
                  vs período anterior
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Pedidos del período -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
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
                <dd class="text-2xl font-bold text-gray-900">{{ analyticsStore.pedidosUltimos7Dias }}</dd>
                <dd v-if="analyticsStore.comparativaPeriodos" class="text-sm text-gray-600">
                  <span :class="analyticsStore.comparativaPeriodos.crecimiento_pedidos > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ analyticsStore.comparativaPeriodos.crecimiento_pedidos > 0 ? '+' : '' }}{{ analyticsStore.comparativaPeriodos.crecimiento_pedidos.toFixed(1) }}%
                  </span>
                  vs período anterior
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Ticket medio -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
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
                <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(analyticsStore.ticketMedioUltimos7Dias) }}</dd>
                <dd v-if="analyticsStore.metricasGenerales" class="text-sm text-gray-600">
                  vs €{{ formatCurrency(analyticsStore.metricasGenerales.ticket_medio_hoy) }} hoy
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Hora pico -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
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
                  {{ analyticsStore.horaPico ? formatHour(analyticsStore.horaPico.hora) : 'N/A' }}
                </dd>
                <dd v-if="analyticsStore.horaPico" class="text-sm text-gray-600">
                  {{ analyticsStore.horaPico.pedidos }} pedidos ({{ analyticsStore.horaPico.porcentaje_dia.toFixed(1) }}%)
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos principales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Ventas por día -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Evolución de Ventas
          </h3>
          
          <div v-if="analyticsStore.ventasPorDia.length > 0" class="space-y-4">
            <div 
              v-for="venta in analyticsStore.ventasPorDia.slice(-10)" 
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
          
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No hay datos de ventas</p>
            <p class="text-sm">Los datos aparecerán cuando haya pedidos completados</p>
          </div>
        </div>

        <!-- Análisis por horas -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Distribución por Horas
          </h3>
          
          <div v-if="analyticsStore.analisisHorario.length > 0" class="space-y-2">
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
          
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No hay datos horarios</p>
            <p class="text-sm">Los datos aparecerán cuando haya actividad</p>
          </div>
        </div>
      </div>

      <!-- Productos y empleados -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Productos más vendidos -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Top Productos
              <span class="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ analyticsStore.platosPopulares.length }}
              </span>
            </h3>
          </div>
          <div class="p-6 max-h-96 overflow-y-auto">
            <div v-if="analyticsStore.platosPopulares.length > 0" class="space-y-4">
              <div 
                v-for="(producto, index) in analyticsStore.platosPopulares" 
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
                      :style="{ width: `${(producto.cantidad_vendida / Math.max(...analyticsStore.platosPopulares.map(p => p.cantidad_vendida))) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p>No hay datos de productos</p>
              <p class="text-sm">Los productos más vendidos aparecerán aquí</p>
            </div>
          </div>
        </div>

        <!-- Rendimiento de empleados -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Rendimiento del Personal
              <span v-if="analyticsStore.mejorEmpleado" class="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ analyticsStore.rendimientoEmpleados.length }} empleados
              </span>
            </h3>
          </div>
          <div class="p-6 max-h-96 overflow-y-auto">
            <div v-if="analyticsStore.rendimientoEmpleados.length > 0" class="space-y-4">
              <div 
                v-for="(empleado, index) in analyticsStore.rendimientoEmpleados" 
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
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No hay datos de empleados</p>
              <p class="text-sm">Los datos de rendimiento aparecerán aquí</p>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAnalyticsStore } from '@/stores/analytics'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const analyticsStore = useAnalyticsStore()
const route = useRoute()
const router = useRouter()

// Estado local
const showExportMenu = ref(false)
const periodoSeleccionado = ref('30d')
const fechaCustom = ref({
  inicio: '',
  fin: ''
})

const fechaSeleccionada = ref({
  inicio: '',
  fin: ''
})

// Computed
const currentRestaurantId = computed(() => {
  return route.params.restaurante_id as string || authStore.currentRestaurant?.id
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

const formatDateRange = (inicio: string, fin: string): string => {
  const fechaInicio = new Date(inicio)
  const fechaFin = new Date(fin)
  return `${fechaInicio.toLocaleDateString('es-ES')} - ${fechaFin.toLocaleDateString('es-ES')}`
}

const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`
}

// Métodos de cálculo
const getVentasBarWidth = (ventas: number): number => {
  if (analyticsStore.ventasPorDia.length === 0) return 0
  const maxVentas = Math.max(...analyticsStore.ventasPorDia.map(v => v.total_ventas))
  return maxVentas > 0 ? (ventas / maxVentas) * 100 : 0
}

const getHorasActivas = () => {
  return analyticsStore.analisisHorario.filter(h => h.pedidos > 0).slice(0, 12)
}

// Métodos principales
const initializeAnalytics = async () => {
  if (!currentRestaurantId.value) {
    console.warn('No hay restaurante seleccionado')
    return
  }

  try {
    analyticsStore.error = null
    await analyticsStore.loadAnalytics(fechaSeleccionada.value.inicio, fechaSeleccionada.value.fin)
  } catch (error) {
    console.error('Error inicializando analytics:', error)
  }
}

const refreshAnalytics = async () => {
  if (!currentRestaurantId.value) return
  
  try {
    await analyticsStore.loadAnalytics(fechaSeleccionada.value.inicio, fechaSeleccionada.value.fin)
  } catch (error) {
    console.error('Error refrescando analytics:', error)
  }
}

const handlePeriodChange = () => {
  const hoy = new Date()
  let inicio: Date
  let fin: Date = hoy

  switch (periodoSeleccionado.value) {
    case '7d':
      inicio = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      inicio = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      inicio = new Date(hoy.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case 'custom':
      return // No hacer nada, esperar fechas custom
    default:
      inicio = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  fechaSeleccionada.value = {
    inicio: inicio.toISOString().split('T')[0],
    fin: fin.toISOString().split('T')[0]
  }

  refreshAnalytics()
}

const aplicarFechasCustom = () => {
  if (!fechaCustom.value.inicio || !fechaCustom.value.fin) {
    alert('Por favor selecciona ambas fechas')
    return
  }

  if (new Date(fechaCustom.value.inicio) > new Date(fechaCustom.value.fin)) {
    alert('La fecha de inicio debe ser anterior a la fecha de fin')
    return
  }

  fechaSeleccionada.value = {
    inicio: fechaCustom.value.inicio,
    fin: fechaCustom.value.fin
  }

  refreshAnalytics()
}

const exportData = async (tipo: 'ventas' | 'platos' | 'empleados', formato: 'csv' | 'json') => {
  try {
    await analyticsStore.exportarDatos(formato, tipo)
    showExportMenu.value = false
  } catch (error) {
    console.error('Error exportando datos:', error)
    alert('Error al exportar los datos')
  }
}

// Watchers
watch(() => currentRestaurantId.value, async (newId) => {
  if (newId) {
    await initializeAnalytics()
  }
})

// Lifecycle
onMounted(async () => {
  console.log('📊 AnalyticsView montado')
  
  // Verificar que el usuario tenga acceso
  try {
    authStore.requireDashboardAccess()
  } catch (error) {
    console.error('Sin acceso a analytics:', error)
    await router.push({ name: 'home' })
    return
  }

  // Si hay un restaurante en la URL, establecerlo como actual
  if (currentRestaurantId.value && currentRestaurantId.value !== authStore.currentRestaurant?.id) {
    const hasAccess = await authStore.checkRestaurantAccess(currentRestaurantId.value)
    if (hasAccess) {
      authStore.setCurrentRestaurant(currentRestaurantId.value)
    } else {
      console.warn('Sin acceso al restaurante:', currentRestaurantId.value)
      if (authStore.userRestaurants.length > 0) {
        await router.push({
          name: 'analytics',
          params: { restaurante_id: authStore.userRestaurants[0].id }
        })
        return
      }
    }
  }

  // Establecer período por defecto y cargar datos
  handlePeriodChange()
})

onUnmounted(() => {
  console.log('🧹 AnalyticsView desmontado - limpiando...')
  analyticsStore.reset()
  showExportMenu.value = false
})
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Efectos hover mejorados */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Gradientes personalizados para analytics */
.bg-gradient-analytics {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Estados de carga específicos para gráficos */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Mejoras visuales para las barras de progreso */
.progress-bar {
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estilos para el menú de exportación */
.export-menu-enter-active,
.export-menu-leave-active {
  transition: all 0.2s ease;
}

.export-menu-enter-from,
.export-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>