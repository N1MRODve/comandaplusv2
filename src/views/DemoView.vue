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
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="dashboard">📊 Dashboard</option>
              <option value="pedidos">📋 Pedidos</option>
              <option value="salon">🏪 Salón</option>
              <option value="menu">📖 Menú</option>
              <option value="analytics">📈 Analytics</option>
            </select>
          </div>
          
          <!-- Controles de la demo -->
          <div class="flex items-center space-x-3">
            <button
              @click="toggleRealTimeSimulation"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                demoStore.simulateRealTime 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              ]"
            >
              {{ demoStore.simulateRealTime ? '⏸️ Pausar simulación' : '▶️ Activar simulación' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Información de la demo -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-900 mb-2">🎯 Demo Interactiva de ComandaPlus</h3>
            <p class="text-blue-800 mb-3">
              Explora todas las funcionalidades de nuestra plataforma con datos reales simulados. 
              Puedes interactuar con pedidos, cambiar estados, gestionar el menú y ver analytics en tiempo real.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-blue-700">{{ demoStore.pedidosActivos.length }} pedidos activos</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-blue-700">{{ demoStore.mesasOcupadas }}/{{ demoStore.totalMesas }} mesas ocupadas</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span class="text-blue-700">{{ demoStore.platosDisponibles.length }} platos disponibles</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-blue-700">Última actualización: {{ formatTime(demoStore.lastUpdate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Dashboard -->
      <div v-if="vistaActual === 'dashboard'" class="space-y-8">
        <DemoDashboard @cambiar-vista="vistaActual = $event" />
      </div>

      <!-- Vista Pedidos -->
      <div v-if="vistaActual === 'pedidos'" class="space-y-8">
        <DemoPedidos />
      </div>

      <!-- Vista Salón -->
      <div v-if="vistaActual === 'salon'" class="space-y-8">
        <DemoSalon />
      </div>

      <!-- Vista Menú -->
      <div v-if="vistaActual === 'menu'" class="space-y-8">
        <DemoMenu />
      </div>

      <!-- Vista Analytics -->
      <div v-if="vistaActual === 'analytics'" class="space-y-8">
        <DemoAnalytics />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDemoStore } from '@/demo/stores/useDemoStore'

// Componentes de demo
import DemoDashboard from '@/demo/components/DemoDashboard.vue'
import DemoPedidos from '@/demo/components/DemoPedidos.vue'
import DemoSalon from '@/demo/components/DemoSalon.vue'
import DemoMenu from '@/demo/components/DemoMenu.vue'
import DemoAnalytics from '@/demo/components/DemoAnalytics.vue'

const demoStore = useDemoStore()

// Estado local
const vistaActual = ref('dashboard')

// Métodos
const toggleRealTimeSimulation = () => {
  demoStore.simulateRealTime = !demoStore.simulateRealTime
  if (demoStore.simulateRealTime) {
    demoStore.startRealTimeSimulation()
  }
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
  console.log('🎭 Demo iniciada')
  if (demoStore.simulateRealTime) {
    demoStore.startRealTimeSimulation()
  }
})

onUnmounted(() => {
  console.log('🎭 Demo finalizada')
})
</script>

<style scoped>
/* Animaciones específicas para la demo */
@keyframes demo-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.demo-pulse {
  animation: demo-pulse 2s ease-in-out infinite;
}

/* Efectos visuales premium para la demo */
.demo-card {
  @apply bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
}

.demo-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold;
  backdrop-filter: blur(8px);
}

/* Transiciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>