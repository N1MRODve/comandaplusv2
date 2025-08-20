<template>
  <nav class="bg-white/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20">
        <!-- Logo y navegación -->
        <div class="flex items-center">
          <router-link 
            :to="homeRoute" 
            class="flex items-center space-x-4 text-xl font-bold text-gray-900 hover:text-orange-600 transition-all duration-300 group"
          >
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span class="text-white font-black text-xl">C+</span>
            </div>
            <div class="hidden sm:block">
              <span class="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">ComandaPlus</span>
              <div class="text-xs text-orange-600 font-bold tracking-wider">PREMIUM EDITION</div>
            </div>
          </router-link>

          <!-- Navegación principal - Solo para usuarios autenticados -->
          <div v-if="props.user && authStore.isAuthenticated" class="hidden lg:ml-12 lg:flex lg:space-x-2">
            <router-link
              v-for="item in filteredNavigationItems"
              :key="item.name"
              :to="item.disabled ? '#' : item.to"
              :class="[
                'px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2',
                item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                isActiveRoute(item.to) 
                  ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
              ]"
              @click="item.disabled && $event.preventDefault()"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'w-5 h-5',
                  isActiveRoute(item.to) ? 'text-orange-600' : 'text-gray-500'
                ]"  
              />
              <span>{{ item.name }}</span>
            </router-link>
          </div>
        </div>

        <!-- Área derecha -->
        <div class="flex items-center space-x-6">
          <!-- Usuario autenticado -->
          <template v-if="props.user && authStore.isAuthenticated">
            <!-- Notificaciones -->
            <button class="relative p-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 hover:shadow-md">
              <BellIcon class="w-6 h-6" />
              <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                3
              </span>
            </button>

            <!-- Menú de perfil -->
            <div class="relative group" ref="profileDropdown">
              <button
                @click="showProfileMenu = !showProfileMenu"
                class="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md group-hover:scale-105"
              >
                <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white text-base font-bold">
                    {{ getUserInitials(props.user?.nombre_completo) }}
                  </span>
                </div>
                <div class="hidden sm:block text-left">
                  <p class="text-base font-semibold text-gray-900">
                    {{ props.user?.nombre_completo || 'Usuario' }}
                  </p>
                  <p class="text-sm text-orange-600 capitalize font-medium">
                    {{ props.user?.rol || 'cliente' }}
                  </p>
                </div>
                <ChevronDownIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              <!-- Dropdown del perfil -->
              <div
                v-if="showProfileMenu"
                class="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 backdrop-blur-xl"
                @click.stop
              >
                <!-- Profile header in dropdown -->
                <div class="px-6 py-4 border-b border-gray-100">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span class="text-white text-lg font-bold">
                        {{ getUserInitials(props.user?.nombre_completo) }}
                      </span>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ props.user?.nombre_completo || 'Usuario' }}</p>
                      <p class="text-sm text-orange-600 capitalize font-medium">{{ props.user?.rol || 'cliente' }}</p>
                    </div>
                  </div>
                </div>
                
                <router-link
                  :to="profileRoute" 
                  class="flex items-center px-6 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200"
                  @click="showProfileMenu = false"
                >
                  <UserIcon class="w-5 h-5 mr-3 text-gray-400" />
                  Mi perfil
                </router-link>
                
                <hr class="my-2 border-gray-100">
                
                <button
                  @click="handleSignOut"
                  class="flex items-center w-full px-6 py-3 text-base text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon class="w-5 h-5 mr-3" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </template>

          <!-- Usuario no autenticado -->
          <template v-else>
            <div class="flex items-center space-x-4">
              <router-link
                to="/auth"
                class="px-6 py-3 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                Iniciar sesión
              </router-link>
              <router-link
                to="/auth"
                class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-base font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Registrarse
              </router-link>
            </div>
          </template>

          <!-- Botón menú móvil -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="lg:hidden p-3 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-7 h-7" />
            <XMarkIcon v-else class="w-7 h-7" />
          </button>
        </div>
      </div>

      <!-- Menú móvil -->
      <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl py-4">
        <template v-if="props.user && authStore.isAuthenticated">
          <!-- Mobile profile header -->
          <div class="px-6 py-4 border-b border-gray-100 mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg font-bold">
                  {{ getUserInitials(props.user?.nombre_completo) }}
                </span>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ props.user?.nombre_completo || 'Usuario' }}</p>
                <p class="text-sm text-orange-600 capitalize font-medium">{{ props.user?.rol || 'cliente' }}</p>
              </div>
            </div>
          </div>
          
          <router-link
            v-for="item in filteredNavigationItems"
            :key="item.name"
            :to="item.disabled ? '#' : item.to"
            :class="[
              'flex items-center px-6 py-4 text-base font-semibold mx-4 rounded-xl transition-all duration-300',
              item.disabled ? 'opacity-50 cursor-not-allowed' : '',
              isActiveRoute(item.to)
                ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border border-orange-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="() => { if (!item.disabled) showMobileMenu = false; else $event.preventDefault(); }"
          >
            <component :is="item.icon" class="w-6 h-6 mr-4" />
            {{ item.name }}
          </router-link>
          
          <hr class="my-4 border-gray-200">
          
          <router-link
            :to="profileRoute"
            class="flex items-center px-6 py-4 text-base font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 mx-4 rounded-xl transition-all duration-300"
            @click="showMobileMenu = false"
          >
            <UserIcon class="w-6 h-6 mr-4" />
            Mi perfil
          </router-link>
          
          <button
            @click="() => { showMobileMenu = false; handleSignOut(); }"
            class="flex items-center w-full px-6 py-4 text-base font-semibold text-red-600 hover:bg-red-50 mx-4 rounded-xl transition-all duration-300"
          >
            <ArrowRightOnRectangleIcon class="w-6 h-6 mr-4" />
            Cerrar sesión
          </button>
        </template>

        <template v-else>
          <div class="px-6 space-y-3">
            <router-link
              to="/auth"
              class="flex items-center justify-center py-4 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300"
              @click="showMobileMenu = false"
            >
              <UserIcon class="w-6 h-6 mr-3" />
              Iniciar sesión
            </router-link>
            <router-link
              to="/auth"
              class="flex items-center justify-center py-4 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              @click="showMobileMenu = false"
            >
              Registrarse
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Iconos simplificados
const HomeIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`}
const ClipboardDocumentListIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" /></svg>`}
const BookOpenIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>`}
const ChartBarIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" /></svg>`}
const BellIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" /></svg>`}
const UserIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`}
const ArrowRightOnRectangleIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>`}
const ChevronDownIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`}
const Bars3Icon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`}
const XMarkIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`}
const SalonIcon = { template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>`}

interface NavItem {
  name: string;
  to: { name: string; params?: { restaurante_id?: string } } | string;
  routeNameActual: string;
  icon: object;
  roles: string[];
  disabled?: boolean;
}

interface Props {
  user: any
}

interface Emits {
  (e: 'sign-out'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const route = useRoute()

const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const profileDropdown = ref<HTMLElement | null>(null)

const homeRoute = computed(() => {
  if (authStore.isAuthenticated && authStore.currentRestaurant?.id) {
    return { name: 'dashboard', params: { restaurante_id: authStore.currentRestaurant.id } }
  }
  if (authStore.isAuthenticated && authStore.canAccessDashboard) {
     return { name: 'dashboard' }
  }
  return { name: 'home' }
})

const profileRoute = computed(() => {
  if (authStore.currentRestaurant?.id) {
    return { name: 'perfil', params: { restaurante_id: authStore.currentRestaurant.id } }
  }
  return '#'
})

const navigationItems = computed((): NavItem[] => {
  const currentRestaurantId = authStore.currentRestaurant?.id

  const baseItemsConfig = [
    { displayName: 'Dashboard', routeName: 'dashboard', icon: HomeIcon, roles: ['admin', 'dueño', 'encargado', 'empleado'] },
    { displayName: 'Salón', routeName: 'salon', icon: SalonIcon, roles: ['admin', 'dueño', 'encargado'] },
    { displayName: 'Pedidos', routeName: 'pedidos', icon: ClipboardDocumentListIcon, roles: ['admin', 'dueño', 'encargado', 'empleado'] },
    { displayName: 'Menú', routeName: 'menu-gestion', icon: BookOpenIcon, roles: ['admin', 'dueño', 'encargado'] },
    { displayName: 'Analytics', routeName: 'analytics', icon: ChartBarIcon, roles: ['admin', 'dueño', 'encargado'] }
  ]

  return baseItemsConfig.map(itemBase => {
    const navItem: NavItem = {
      name: itemBase.displayName,
      routeNameActual: itemBase.routeName,
      icon: itemBase.icon,
      roles: itemBase.roles,
      to: { name: itemBase.routeName, params: {} },
      disabled: false
    }

    const needsRestId = ['dashboard', 'salon', 'pedidos', 'menu-gestion', 'analytics'].includes(itemBase.routeName)

    if (needsRestId) {
      if (currentRestaurantId) {
        navItem.to = { name: itemBase.routeName, params: { restaurante_id: currentRestaurantId } }
      } else {
        navItem.disabled = true
        navItem.to = '#'
      }
    }
    return navItem
  })
})

const filteredNavigationItems = computed(() => {
  const userRole = props.user?.rol
  if (userRole) {
    return navigationItems.value.filter(item => item.roles.includes(userRole))
  }
  return []
})

const isActiveRoute = (to: NavItem['to']) => {
  if (typeof to === 'string') {
    return route.path === to
  }
  
  if (typeof to === 'object' && to.name) {
    return route.name === to.name
  }
  
  return false
}

const getUserInitials = (name?: string) => {
  if (!name) return 'U'
  return name.split(' ').map(word => word.charAt(0)).slice(0, 2).join('').toUpperCase()
}

const handleSignOut = () => {
  showProfileMenu.value = false
  emit('sign-out')
}

const handleClickOutside = (event: Event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target as Node)) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>