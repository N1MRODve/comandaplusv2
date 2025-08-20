<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navigation específica para la demo -->
    <nav class="bg-white/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo y navegación -->
          <div class="flex items-center">
            <router-link 
              :to="{ name: 'demo-landing' }" 
              class="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-amber-600 transition-colors"
            >
              <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-lg">C+</span>
              </div>
              <div class="hidden sm:block">
                <span class="text-2xl font-bold text-gray-900">ComandaPlus</span>
                <div class="text-xs text-orange-500 font-medium">DEMO INTERACTIVA</div>
              </div>
            </router-link>

            <!-- Navegación de la demo -->
            <div class="hidden lg:ml-8 lg:flex lg:space-x-1">
              <router-link
                v-for="item in demoNavigationItems"
                :key="item.name"
                :to="item.to"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActiveRoute(item.to) 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <component :is="item.icon" class="w-5 h-5 mr-2 inline" />
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- Área derecha -->
          <div class="flex items-center space-x-4">
            <!-- Indicador de demo -->
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Modo Demo
            </div>

            <!-- Botón resetear -->
            <button
              @click="resetDemo"
              class="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Resetear demo"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Botón salir de demo -->
            <router-link
              to="/"
              class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors font-medium"
            >
              Salir de Demo
            </router-link>

            <!-- Botón menú móvil -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Menú móvil -->
        <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-200 bg-white py-2">
          <router-link
            v-for="item in demoNavigationItems"
            :key="item.name"
            :to="item.to"
            :class="[
              'flex items-center px-4 py-3 text-base font-medium',
              isActiveRoute(item.to)
                ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="showMobileMenu = false"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
          
          <hr class="my-2">
          
          <button
            @click="() => { showMobileMenu = false; resetDemo(); }"
            class="flex items-center w-full px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Resetear Demo
          </button>
          
          <router-link
            to="/"
            class="flex items-center w-full px-4 py-3 text-base font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white mx-4 rounded-lg"
            @click="showMobileMenu = false"
          >
            Salir de Demo
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 pt-16">
      <router-view />
    </main>

    <!-- Demo Footer -->
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-4 mb-4 md:mb-0">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Demo Activa</span>
            </div>
            <div class="text-sm text-gray-500">
              Última actualización: {{ formatTime(lastUpdate) }}
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
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
const HomeIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`}
const ClipboardDocumentListIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>`}
const BookOpenIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>`}
const ChartBarIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`}
const SalonIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`}
const DevicePhoneMobileIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`}

const route = useRoute()
const demoStore = useDemoStore()

const showMobileMenu = ref(false)
const lastUpdate = computed(() => demoStore.lastUpdate)

const demoNavigationItems = [
  { name: 'Dashboard', to: { name: 'demo' }, icon: HomeIcon },
  { name: 'Pedidos', to: { name: 'demo', query: { view: 'pedidos' } }, icon: ClipboardDocumentListIcon },
  { name: 'Salón', to: { name: 'demo', query: { view: 'salon' } }, icon: SalonIcon },
  { name: 'Menú', to: { name: 'demo', query: { view: 'menu' } }, icon: BookOpenIcon },
  { name: 'Analytics', to: { name: 'demo', query: { view: 'analytics' } }, icon: ChartBarIcon },
  { name: 'Menú Cliente', to: { name: 'demo-menu-cliente' }, icon: DevicePhoneMobileIcon }
]

const isActiveRoute = (to: any) => {
  if (typeof to === 'object' && to.name) {
    if (to.query?.view) {
      return route.name === to.name && route.query.view === to.query.view
    }
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