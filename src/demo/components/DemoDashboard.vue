<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
    <!-- KPIs principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Ventas hoy -->
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
              <dt class="text-sm font-medium text-gray-500 truncate">Ventas hoy</dt>
              <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(dashboardData.ventas_hoy) }}</dd>
              <dd class="text-sm text-green-600">
                +8.2% vs ayer
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Pedidos activos -->
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
              <dt class="text-sm font-medium text-gray-500 truncate">Pedidos activos</dt>
              <dd class="text-2xl font-bold text-gray-900">{{ demoStore.pedidosActivos.length }}</dd>
              <dd class="text-sm text-gray-600">
                {{ demoStore.estadoPedidos.pendientes }} pendientes, 
                {{ demoStore.estadoPedidos.en_preparacion }} en cocina
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Ocupación de mesas -->
      <div class="demo-card p-6 hover:shadow-2xl transition-all duration-300">
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
                {{ demoStore.mesasOcupadas }}/{{ demoStore.totalMesas }}
              </dd>
              <dd class="text-sm text-gray-600">
                {{ demoStore.porcentajeOcupacion.toFixed(0) }}% ocupación
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Ticket promedio -->
      <div class="demo-card p-6 hover:shadow-2xl transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Ticket promedio</dt>
              <dd class="text-2xl font-bold text-gray-900">€{{ formatCurrency(dashboardData.ticket_promedio) }}</dd>
              <dd class="text-sm text-gray-600">
                +12.5% vs mes anterior
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Secciones principales -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Pedidos activos -->
      <div class="demo-card">
        <div class="px-6 py-4 border-b border-gray-200/50">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pedidos Activos
            <span class="ml-2 demo-badge bg-yellow-100 text-yellow-800">
              {{ demoStore.pedidosActivos.length }}
            </span>
          </h3>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          <div v-if="demoStore.pedidosActivos.length > 0" class="space-y-4">
            <div 
              v-for="pedido in demoStore.pedidosActivos.slice(0, 5)" 
              :key="pedido.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              @click="verDetallesPedido(pedido)"
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
                    {{ demoStore.calcularTiempoTranscurrido(pedido.hora_pedido) }} min · {{ getEstadoTexto(pedido.estado) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">€{{ formatCurrency(pedido.total) }}</p>
                <p class="text-sm text-gray-600">{{ pedido.items.length }} items</p>
                <button
                  @click.stop="cambiarEstadoPedidoDemo(pedido)"
                  class="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Cambiar estado
                </button>
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
      <div class="demo-card">
        <div class="px-6 py-4 border-b border-gray-200/50">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Productos Populares Hoy
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="(producto, index) in dashboardData.platos_mas_vendidos" 
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
                  {{ producto.cantidad }} vendidos hoy
                </p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">€{{ formatCurrency(producto.ingresos) }}</p>
                <div class="w-16 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    class="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: `${(producto.cantidad / Math.max(...dashboardData.platos_mas_vendidos.map(p => p.cantidad))) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ventas de los últimos 7 días -->
    <div class="demo-card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Evolución de Ventas (Últimos 7 Días)
      </h3>
      
      <div class="space-y-4">
        <div 
          v-for="venta in dashboardData.ventas_ultimos_7_dias" 
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
                  class="bg-gradient-to-r from-indigo-400 to-indigo-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  :style="{ width: `${getVentasBarWidth(venta.ventas)}%` }"
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

    <!-- Acciones rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Gestión de Pedidos -->
      <div class="demo-card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Gestión de Pedidos
        </h3>
        <div class="space-y-3">
          <button
            @click="$emit('cambiar-vista', 'pedidos')"
            class="block w-full bg-orange-500 text-white text-center py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Ver todos los pedidos ({{ demoStore.pedidosActivos.length }})
          </button>
          <button 
            @click="simularNuevoPedido"
            class="block w-full bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ➕ Simular nuevo pedido
          </button>
        </div>
      </div>

      <!-- Gestión de Salón -->
      <div class="demo-card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Gestión de Salón
        </h3>
        <div class="space-y-3">
          <button
            @click="$emit('cambiar-vista', 'salon')"
            class="block w-full bg-purple-500 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            Ver estado del salón
          </button>
          <div class="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between mb-1">
              <span>Ocupación:</span>
              <span class="font-medium">{{ demoStore.mesasOcupadas }}/{{ demoStore.totalMesas }}</span>
            </div>
            <div class="flex justify-between">
              <span>Ingresos hoy:</span>
              <span class="font-medium">€{{ formatCurrency(demoStore.ingresosDelDia) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestión de Menú -->
      <div class="demo-card p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Gestión de Menú
        </h3>
        <div class="space-y-3">
          <button
            @click="$emit('cambiar-vista', 'menu')"
            class="block w-full bg-blue-500 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Editar menú
          </button>
          <div class="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between mb-1">
              <span>Categorías:</span>
              <span class="font-medium">{{ demoStore.categoriasActivas.length }}</span>
            </div>
            <div class="flex justify-between">
              <span>Platos disponibles:</span>
              <span class="font-medium">{{ demoStore.platosDisponibles.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDemoStore } from '@/demo/stores/useDemoStore'

const demoStore = useDemoStore()

// Emits
const emit = defineEmits<{
  'cambiar-vista': [vista: string]
}>()

// Computed
const dashboardData = computed(() => demoStore.getDashboardData())

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
    day: 'numeric'
  }).format(date)
}

const getVentasBarWidth = (ventas: number): number => {
  const maxVentas = Math.max(...dashboardData.value.ventas_ultimos_7_dias.map(v => v.ventas))
  return maxVentas > 0 ? (ventas / maxVentas) * 100 : 0
}

const getEstadoTexto = (estado: string): string => {
  const textos: Record<string, string> = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En preparación',
    'listo': 'Listo',
    'entregado': 'Entregado',
    'pagado': 'Pagado',
    'cancelado': 'Cancelado'
  }
  return textos[estado] || estado
}

// Métodos de interacción
const verDetallesPedido = (pedido: any) => {
  alert(`Detalles del pedido ${pedido.numero_pedido}:\n\nMesa: ${pedido.numero_mesa}\nCliente: ${pedido.cliente_nombre}\nTotal: €${pedido.total.toFixed(2)}\nEstado: ${getEstadoTexto(pedido.estado)}\nItems: ${pedido.items.length}\n\n¡En la versión completa podrás ver todos los detalles y gestionar cada item individualmente!`)
}

const cambiarEstadoPedidoDemo = (pedido: any) => {
  const estadosDisponibles = {
    'pendiente': 'en_preparacion',
    'confirmado': 'en_preparacion',
    'en_preparacion': 'listo',
    'listo': 'entregado'
  }
  
  const nuevoEstado = estadosDisponibles[pedido.estado as keyof typeof estadosDisponibles]
  if (nuevoEstado) {
    demoStore.actualizarEstadoPedido(pedido.id, nuevoEstado)
    
    // Mostrar feedback
    const mensaje = `Pedido ${pedido.numero_pedido} actualizado a "${getEstadoTexto(nuevoEstado)}"`
    
    // Crear notificación visual temporal
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    notification.textContent = mensaje
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 2000)
  }
}

const simularNuevoPedido = () => {
  const mesasLibres = demoStore.mesas.filter(m => m.estado === 'libre')
  if (mesasLibres.length === 0) {
    alert('No hay mesas libres para simular un nuevo pedido. Libera alguna mesa primero.')
    return
  }
  
  const mesaAleatoria = mesasLibres[Math.floor(Math.random() * mesasLibres.length)]
  const clientesDemo = ['Juan Pérez', 'Laura Sánchez', 'Miguel Torres', 'Carmen López', 'David Ruiz']
  const clienteAleatorio = clientesDemo[Math.floor(Math.random() * clientesDemo.length)]
  
  const nuevoPedido = demoStore.crearPedidoDemo({
    numero_mesa: mesaAleatoria.numero,
    cliente_nombre: clienteAleatorio,
    subtotal: Math.random() * 40 + 20,
    total: Math.random() * 50 + 25,
    comensales: Math.floor(Math.random() * 4) + 1,
    items: []
  })
  
  // Mostrar feedback
  const mensaje = `¡Nuevo pedido simulado! ${nuevoPedido.numero_pedido} en Mesa ${nuevoPedido.numero_mesa}`
  
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
  notification.textContent = mensaje
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => document.body.removeChild(notification), 300)
  }, 3000)
}
</script>

<style scoped>
.demo-card {
  @apply bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
}

.demo-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold;
  backdrop-filter: blur(8px);
}
</style>