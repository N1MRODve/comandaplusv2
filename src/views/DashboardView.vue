<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
              <span 
                v-if="dashboardStore.isRealTimeConnected" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                <div class="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                En vivo
              </span>
              <span 
                v-else 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                <div class="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                Desconectado
              </span>
            </div>
            <p class="text-sm text-gray-600">
              Bienvenido, {{ authStore.profile?.nombre_completo }}
              <span v-if="authStore.currentRestaurant">
                · {{ authStore.currentRestaurant.nombre }}
              </span>
            </p>
            <p v-if="dashboardStore.lastUpdate" class="text-xs text-gray-500">
              Última actualización: {{ formatTime(dashboardStore.lastUpdate) }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Selector de restaurante -->
            <select 
              v-if="authStore.userRestaurants.length > 1"
              :value="authStore.currentRestaurant?.id"
              @change="handleRestaurantChange"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option v-for="restaurant in authStore.userRestaurants" :key="restaurant.id" :value="restaurant.id">
                {{ restaurant.nombre }} ({{ restaurant.role }})
              </option>
            </select>
            
            <!-- Toggle tiempo real -->
            <button 
              @click="toggleRealTime"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                dashboardStore.realTimeEnabled 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              ]"
            >
              {{ dashboardStore.realTimeEnabled ? 'Tiempo real ON' : 'Tiempo real OFF' }}
            </button>
            
            <!-- Botón de actualizar -->
            <button 
              @click="refreshData"
              :disabled="dashboardStore.loading"
              class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <svg 
                v-if="dashboardStore.loading" 
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
              <span>{{ dashboardStore.loading ? 'Actualizando...' : 'Actualizar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="dashboardStore.alertas.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div class="space-y-2">
        <div 
          v-for="(alerta, index) in dashboardStore.alertas" 
          :key="index"
          :class="[
            'p-4 rounded-lg border-l-4',
            alerta.tipo === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
            alerta.tipo === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
            alerta.tipo === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
            'bg-blue-50 border-blue-400 text-blue-800'
          ]"
        >
          <div class="flex items-center">
            <svg 
              v-if="alerta.tipo === 'warning'" 
              class="h-5 w-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">{{ alerta.mensaje }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="dashboardStore.loading && !dashboardStore.hasData" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      <span class="ml-3 text-gray-600">Cargando dashboard...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="dashboardStore.error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar el dashboard</h3>
        <p class="text-red-600 mb-4">{{ dashboardStore.error }}</p>
        <button 
          @click="initializeDashboard"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- KPIs del día -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Ventas del día -->
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
                <dt class="text-sm font-medium text-gray-500 truncate">Ventas hoy</dt>
                <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(dashboardStore.ventasHoy) }}</dd>
                <dd v-if="dashboardStore.crecimientoVentas !== 0" class="text-sm text-gray-600">
                  <span :class="dashboardStore.crecimientoVentas > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ dashboardStore.crecimientoVentas > 0 ? '+' : '' }}{{ dashboardStore.crecimientoVentas.toFixed(1) }}%
                  </span>
                  vs ayer
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Pedidos activos -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pedidos activos</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ dashboardStore.totalPedidosActivos }}</dd>
                <dd class="text-sm text-gray-600">
                  {{ dashboardStore.estadoPedidos.pendientes }} pendientes, 
                  {{ dashboardStore.estadoPedidos.en_preparacion }} en cocina
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Ocupación de mesas -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Ocupación</dt>
                <dd class="text-2xl font-bold text-gray-900">
                  {{ dashboardStore.mesasOcupadas.ocupadas }}/{{ dashboardStore.mesasOcupadas.total }}
                </dd>
                <dd class="text-sm text-gray-600">
                  {{ dashboardStore.mesasOcupadas.porcentaje.toFixed(0) }}% ocupación
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Productividad cocina -->
        <div class="bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md">
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
                <dt class="text-sm font-medium text-gray-500 truncate">Productividad</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ dashboardStore.productividadCocina.porcentaje.toFixed(0) }}%</dd>
                <dd class="text-sm text-gray-600">
                  {{ dashboardStore.productividadCocina.completados }}/{{ dashboardStore.productividadCocina.total }} items
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Gestión de pedidos -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Gestión de Pedidos
          </h3>
          <div class="space-y-3">
            <router-link 
              :to="`/pedidos/${authStore.currentRestaurant?.id}`"
              class="block w-full bg-orange-500 text-white text-center py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Ver todos los pedidos ({{ dashboardStore.totalPedidosActivos }})
            </router-link>
            <button 
              @click="generateQR"
              class="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Generar QR de mesa
            </button>
          </div>
        </div>

        <!-- Gestión de menú -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Gestión de Menú
          </h3>
          <div class="space-y-3">
            <button 
              class="block w-full bg-blue-500 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              disabled
            >
              Editar menú
              <span class="text-xs block mt-1 opacity-75">Próximamente</span>
            </button>
            <button 
              class="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled
            >
              Gestionar disponibilidad
              <span class="text-xs block mt-1 opacity-75">Próximamente</span>
            </button>
          </div>
        </div>

        <!-- Reportes -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reportes
          </h3>
          <div class="space-y-3">
            <router-link 
              :to="`/analytics/${authStore.currentRestaurant?.id}`"
              class="block w-full bg-purple-500 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Ver analytics
            </router-link>
            <button 
              class="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled
            >
              Exportar datos
              <span class="text-xs block mt-1 opacity-75">Próximamente</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Actividad reciente -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Pedidos activos en tiempo real -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pedidos Activos
              <span class="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ dashboardStore.totalPedidosActivos }}
              </span>
            </h3>
            <router-link 
              :to="`/pedidos/${authStore.currentRestaurant?.id}`"
              class="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Ver todos →
            </router-link>
          </div>
          <div class="p-6 max-h-96 overflow-y-auto">
            <div v-if="dashboardStore.pedidosActivos.length > 0" class="space-y-4">
              <div 
                v-for="pedido in dashboardStore.pedidosActivos.slice(0, 5)" 
                :key="pedido.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div :class="[
                      'w-3 h-3 rounded-full',
                      pedido.estado === 'pendiente' ? 'bg-yellow-400' :
                      pedido.estado === 'en_preparacion' ? 'bg-blue-400' :
                      pedido.estado === 'listo' ? 'bg-green-400' : 'bg-gray-400'
                    ]"></div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ pedido.numero_pedido }}</p>
                    <p class="text-sm text-gray-600">
                      Mesa {{ pedido.numero_mesa }} · {{ pedido.cliente_nombre }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ pedido.tiempo_transcurrido }} min · {{ getEstadoTexto(pedido.estado) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900">€{{ formatCurrency(pedido.total) }}</p>
                  <p class="text-sm text-gray-600">{{ pedido.items_totales }} items</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No hay pedidos activos</p>
              <p class="text-sm">Los nuevos pedidos aparecerán aquí automáticamente</p>
            </div>
          </div>
        </div>

        <!-- Productos más vendidos -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Productos Populares
            </h3>
          </div>
          <div class="p-6">
            <div v-if="dashboardStore.productosMasVendidos.length > 0" class="space-y-4">
              <div 
                v-for="(producto, index) in dashboardStore.productosMasVendidos.slice(0, 5)" 
                :key="producto.id"
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
                  <p class="font-medium text-gray-900 truncate">{{ producto.nombre }}</p>
                  <p class="text-sm text-gray-600">
                    {{ producto.cantidad_vendida }} vendidos · €{{ formatCurrency(producto.ingresos_totales) }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: `${(producto.cantidad_vendida / Math.max(...dashboardStore.productosMasVendidos.map(p => p.cantidad_vendida))) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No hay datos de productos</p>
              <p class="text-sm">Los productos más vendidos aparecerán aquí</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de ventas (si hay datos) -->
      <div v-if="dashboardStore.ventasUltimos7Dias.length > 0" class="mt-8">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Ventas de los Últimos 7 Días
          </h3>
          
          <!-- Simple chart with bars -->
          <div class="space-y-4">
            <div 
              v-for="venta in dashboardStore.ventasUltimos7Dias" 
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
                      class="bg-gradient-to-r from-orange-400 to-orange-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      :style="{ width: `${(venta.ventas / Math.max(...dashboardStore.ventasUltimos7Dias.map(v => v.ventas))) * 100}%` }"
                    >
                      <span class="text-xs font-medium text-white">
                        €{{ formatCurrency(venta.ventas) }}
                      </span>
                    </div>
                  </div>
                  <div class="w-16 text-sm text-gray-600 text-right">
                    {{ venta.pedidos }} pedidos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Modal -->
    <div v-if="showQRModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Generar QR para Mesa</h3>
          <button @click="showQRModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Número de Mesa</label>
            <input 
              v-model="selectedTable"
              type="text" 
              placeholder="Ej: 1, A1, Terraza-5"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
          </div>
          <div class="flex space-x-3">
            <button 
              @click="generateQRCode"
              :disabled="!selectedTable.trim()"
              class="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              Generar QR
            </button>
            <button 
              @click="showQRModal = false"
              class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const route = useRoute()
const router = useRouter()

// Estado local
const showQRModal = ref(false)
const selectedTable = ref('')

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

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric'
  }).format(date)
}

const getEstadoTexto = (estado: string): string => {
  const textos = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En preparación',
    'listo': 'Listo',
    'entregado': 'Entregado',
    'pagado': 'Pagado',
    'cancelado': 'Cancelado'
  }
  return textos[estado as keyof typeof textos] || estado
}

// Métodos principales
const initializeDashboard = async () => {
  if (!currentRestaurantId.value) {
    console.warn('No hay restaurante seleccionado')
    return
  }

  try {
    dashboardStore.clearError()
    await dashboardStore.initialize(currentRestaurantId.value)
  } catch (error) {
    console.error('Error inicializando dashboard:', error)
  }
}

const refreshData = async () => {
  if (!currentRestaurantId.value) return
  
  try {
    await dashboardStore.refreshData(currentRestaurantId.value)
  } catch (error) {
    console.error('Error refrescando datos:', error)
  }
}

const handleRestaurantChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const restaurantId = target.value
  
  if (restaurantId && restaurantId !== authStore.currentRestaurant?.id) {
    // Actualizar el restaurante actual en el store
    authStore.setCurrentRestaurant(restaurantId)
    
    // Navegar a la nueva URL con el restaurante
    await router.push({
      name: 'dashboard',
      params: { restaurante_id: restaurantId }
    })
    
    // Reinicializar el dashboard
    await initializeDashboard()
  }
}

const toggleRealTime = () => {
  if (dashboardStore.realTimeEnabled) {
    dashboardStore.disableRealTime()
  } else {
    dashboardStore.enableRealTime()
  }
}

const generateQR = () => {
  showQRModal.value = true
  selectedTable.value = ''
}

const generateQRCode = () => {
  if (!selectedTable.value.trim() || !currentRestaurantId.value) return
  
  // Generar URL del menú digital
  const menuUrl = `${window.location.origin}/menu/${currentRestaurantId.value}/${selectedTable.value.trim()}`
  
  // Abrir en nueva ventana para mostrar QR
  window.open(
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`,
    '_blank'
  )
  
  showQRModal.value = false
  selectedTable.value = ''
}

// Lifecycle
onMounted(async () => {
  console.log('🏪 DashboardView montado')
  
  // Verificar que el usuario tenga acceso al dashboard
  try {
    authStore.requireDashboardAccess()
  } catch (error) {
    console.error('Sin acceso al dashboard:', error)
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
      // Redirigir al primer restaurante disponible
      if (authStore.userRestaurants.length > 0) {
        await router.push({
          name: 'dashboard',
          params: { restaurante_id: authStore.userRestaurants[0].id }
        })
        return
      }
    }
  }

  // Inicializar el dashboard
  await initializeDashboard()
})

onUnmounted(() => {
  console.log('🧹 DashboardView desmontado - limpiando...')
  dashboardStore.cleanup()
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

/* Gradientes personalizados */
.bg-gradient-dashboard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Estados de carga */
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
</style>