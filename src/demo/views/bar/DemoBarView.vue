<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
    <!-- Selector de vista -->
    <div class="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Vista:</span>
            <select 
              v-model="vistaActual"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="dashboard">🍸 Dashboard</option>
              <option value="pedidos">📋 Pedidos</option>
              <option value="salon">🏪 Salón</option>
              <option value="menu">🍹 Carta</option>
              <option value="analytics">📈 Analytics</option>
            </select>
          </div>
          
          <!-- Controles de la demo -->
          <div class="flex items-center space-x-3">
            <button
              @click="toggleRealTimeSimulation"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                barDemoStore.simulateRealTime 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              ]"
            >
              {{ barDemoStore.simulateRealTime ? '⏸️ Pausar simulación' : '▶️ Activar simulación' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Información de la demo del bar -->
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mb-8">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-purple-900 mb-2">🍸 Demo de Bar y Coctelería</h3>
            <p class="text-purple-800 mb-3">
              Explora ComandaPlus adaptado para bares, pubs y coctelerías. Gestiona pedidos de bebidas, 
              controla la barra y analiza el rendimiento nocturno de tu negocio.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-purple-700">{{ barDemoStore.pedidosActivos.length }} pedidos activos</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-purple-700">{{ barDemoStore.mesasOcupadas }}/{{ barDemoStore.totalMesas }} espacios ocupados</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span class="text-purple-700">{{ barDemoStore.platosDisponibles.length }} productos disponibles</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-purple-700">Última actualización: {{ formatTime(barDemoStore.lastUpdate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Dashboard -->
      <div v-if="vistaActual === 'dashboard'" class="space-y-8">
        <DemoBarDashboard @cambiar-vista="vistaActual = $event" />
      </div>

      <!-- Vista Pedidos -->
      <div v-if="vistaActual === 'pedidos'" class="space-y-8">
        <DemoBarPedidos />
      </div>

      <!-- Vista Salón -->
      <div v-if="vistaActual === 'salon'" class="space-y-8">
        <DemoBarSalon />
      </div>

      <!-- Vista Menú -->
      <div v-if="vistaActual === 'menu'" class="space-y-8">
        <DemoBarMenu />
      </div>

      <!-- Vista Analytics -->
      <div v-if="vistaActual === 'analytics'" class="space-y-8">
        <DemoBarAnalytics />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBarDemoStore } from '@/demo/stores/useBarDemoStore'

// Componentes de demo del bar
import DemoBarDashboard from '@/demo/components/bar/DemoBarDashboard.vue'
import DemoBarPedidos from '@/demo/components/bar/DemoBarPedidos.vue'
import DemoBarSalon from '@/demo/components/bar/DemoBarSalon.vue'
import DemoBarMenu from '@/demo/components/bar/DemoBarMenu.vue'
import DemoBarAnalytics from '@/demo/components/bar/DemoBarAnalytics.vue'

const barDemoStore = useBarDemoStore()

// Estado local
const vistaActual = ref('dashboard')

// Métodos
const toggleRealTimeSimulation = () => {
  barDemoStore.simulateRealTime = !barDemoStore.simulateRealTime
}

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

// Lifecycle
onMounted(() => {
  console.log('🍸 Demo de Bar iniciada')
})

onUnmounted(() => {
  console.log('🍸 Demo de Bar finalizada')
})
</script>

<style scoped>
.demo-card {
  @apply bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
}

.demo-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold;
  backdrop-filter: blur(8px);
}
</style>