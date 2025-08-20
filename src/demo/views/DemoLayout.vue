<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Demo Banner - Fixed at top -->
    <div class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">C+</span>
            </div>
            <div>
              <span class="font-bold text-lg">ComandaPlus Demo</span>
              <div class="text-xs text-orange-100">Demostración Interactiva</div>
            </div>
          </div>
          
          <div class="hidden sm:flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full text-sm">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Estás viendo una demostración • Los datos son ficticios</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Navigation within demo -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link
              v-for="item in demoNavigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActiveRoute(item.to) 
                  ? 'bg-white/30 text-white border border-white/30' 
                  : 'text-orange-100 hover:text-white hover:bg-white/20'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4 mr-1.5 inline" />
              {{ item.name }}
            </router-link>
          </div>
          
          <!-- Reset demo button -->
          <button
            @click="resetDemo"
            class="px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            title="Resetear demo"
          >
            <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Resetear
          </button>
          
          <!-- Exit demo button -->
          <router-link
            to="/"
            class="px-4 py-1.5 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm shadow-sm"
          >
            Volver a la web principal
          </router-link>

          <!-- Mobile menu button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-white hover:bg-white/20 rounded-lg"
          >
            <svg v-if="!showMobileMenu" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-white/20 mt-3 pt-3">
        <div class="space-y-2">
          <router-link
            v-for="item in demoNavigationItems"
            :key="item.name"
            :to="item.to"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActiveRoute(item.to)
                ? 'bg-white/30 text-white'
                : 'text-orange-100 hover:text-white hover:bg-white/20'
            ]"
            @click="showMobileMenu = false"
          >
            <component :is="item.icon" class="w-4 h-4 mr-2" />
            {{ item.name }}
          </router-link>
          
          <hr class="border-white/20 my-2">
          
          <button
            @click="() => { showMobileMenu = false; resetDemo(); }"
            class="flex items-center w-full px-3 py-2 text-orange-100 hover:text-white hover:bg-white/20 rounded-lg text-sm font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Resetear Demo
          </button>
          
          <router-link
            to="/"
            class="flex items-center w-full px-3 py-2 bg-white text-orange-600 rounded-lg font-semibold text-sm"
            @click="showMobileMenu = false"
          >
            Volver a la web principal
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Demo Footer -->
    <footer class="bg-white border-t border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-4 mb-2 md:mb-0">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Demo Activa</span>
            </div>
            <div class="text-sm text-gray-500">
              Última actualización: {{ formatTime(lastUpdate) }}
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="resetDemo"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              🔄 Resetear
            </button>
            <router-link
              to="/auth"
              class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Crear Cuenta Real
            </router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDemoStore } from '@/demo/stores/useDemoStore'

// Iconos simplificados
const HomeIcon = { template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`}
const ClipboardDocumentListIcon = { template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>`}
const BookOpenIcon = { template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>`}
const ChartBarIcon = { template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`}
const SalonIcon = { template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`}
const DevicePhoneMobileIcon = { template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`}

const route = useRoute()
const demoStore = useDemoStore()

const showMobileMenu = ref(false)
const lastUpdate = computed(() => demoStore.lastUpdate)

const demoNavigationItems = [
  { name: 'Dashboard', to: { name: 'demo-dashboard' }, icon: HomeIcon },
  { name: 'Pedidos', to: { name: 'demo-pedidos' }, icon: ClipboardDocumentListIcon },
  { name: 'Salón', to: { name: 'demo-salon' }, icon: SalonIcon },
  { name: 'Menú', to: { name: 'demo-menu' }, icon: BookOpenIcon },
  { name: 'Analytics', to: { name: 'demo-analytics' }, icon: ChartBarIcon },
  { name: 'Menú Cliente', to: { name: 'demo-menu-cliente' }, icon: DevicePhoneMobileIcon }
]

const isActiveRoute = (to: any) => {
  if (typeof to === 'object' && to.name) {
    return route.name === to.name
  }
  return false
}

const resetDemo = () => {
  if (confirm('¿Estás seguro de que quieres resetear la demo? Se perderán todos los cambios realizados.')) {
    demoStore.resetearDemo()
    
    // Mostrar notificación
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300'
    notification.textContent = '🔄 Demo reseteada correctamente'
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
}

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

onMounted(() => {
  // Inicializar simulación de tiempo real si está habilitada
  if (demoStore.simulateRealTime) {
    demoStore.startRealTimeSimulation()
  }
})
</script>

<style scoped>
/* Animaciones específicas para el banner de demo */
@keyframes demo-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.demo-pulse {
  animation: demo-pulse 2s ease-in-out infinite;
}

/* Efectos de hover mejorados */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>