<template>
  <nav class="bg-white/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación -->
        <div class="flex items-center">
          <router-link 
            :to="homeRoute" 
            class="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-amber-600 transition-colors"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">C+</span>
            </div>
            <div class="hidden sm:block">
              <span class="text-2xl font-bold text-gray-900">ComandaPlus</span>
              <div class="text-xs text-gray-500 font-medium">PREMIUM EDITION</div>
            </div>
          </router-link>

          <!-- Navegación principal - Solo para usuarios autenticados -->
          <div v-if="props.user && authStore.isAuthenticated" class="hidden lg:ml-8 lg:flex lg:space-x-1">
            <router-link
              v-for="item in filteredNavigationItems"
              :key="item.name"
              :to="item.disabled ? '#' : item.to"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                isActiveRoute(item.to) 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
              @click="item.disabled && $event.preventDefault()"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'w-5 h-5 mr-2 inline',
                  isActiveRoute(item.to) ? 'text-amber-600' : 'text-gray-500'
                ]"  
              />
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Área derecha -->
        <div class="flex items-center space-x-4">
          <!-- Usuario autenticado -->
          <template v-if="props.user && authStore.isAuthenticated">
            <!-- Notificaciones -->
            <button class="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
              <BellIcon class="w-6 h-6" />
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <!-- Menú de perfil -->
            <div class="relative" ref="profileDropdown">
              <button
                @click="showProfileMenu = !showProfileMenu"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span class="text-white text-sm font-bold">
                    {{ getUserInitials(props.user?.nombre_completo) }}
                  </span>
                </div>
                <div class="hidden sm:block text-left">
                  <p class="text-sm font-medium text-gray-900">
                    {{ props.user?.nombre_completo || 'Usuario' }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ props.user?.rol || 'cliente' }}
                  </p>
                </div>
                <ChevronDownIcon class="w-4 h-4 text-gray-400" />
              </button>

              <!-- Dropdown del perfil -->
              <div
                v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                @click.stop
              >
                <router-link
                  :to="profileRoute" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  @click="showProfileMenu = false"
                >
                  <UserIcon class="w-4 h-4 mr-3 text-gray-400" />
                  Mi perfil
                </router-link>
                <hr class="my-1">
                <button
                  @click="handleSignOut"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </template>

          <!-- Usuario no autenticado -->
          <template v-else>
            <router-link
              to="/auth"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Iniciar sesión
            </router-link>
            <router-link
              to="/auth"
              class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              Registrarse
            </router-link>
          </template>

          <!-- Botón menú móvil -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Menú móvil -->
      <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-200 bg-white py-2">
        <template v-if="props.user && authStore.isAuthenticated">
          <router-link
            v-for="item in filteredNavigationItems"
            :key="item.name"
            :to="item.disabled ? '#' : item.to"
            :class="[
              'flex items-center px-4 py-3 text-base font-medium',
              item.disabled ? 'opacity-50 cursor-not-allowed' : '',
              isActiveRoute(item.to)
                ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="() => { if (!item.disabled) showMobileMenu = false; else $event.preventDefault(); }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
          
          <hr class="my-2">
          
          <router-link
            :to="profileRoute"
            class="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            @click="showMobileMenu = false"
          >
            <UserIcon class="w-5 h-5 mr-3" />
            Mi perfil
          </router-link>
          
          <button
            @click="() => { showMobileMenu = false; handleSignOut(); }"
            class="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5 mr-3" />
            Cerrar sesión
          </button>
        </template>

        <template v-else>
          <router-link
            to="/auth"
            class="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            @click="showMobileMenu = false"
          >
            <UserIcon class="w-5 h-5 mr-3" />
            Iniciar sesión
          </router-link>
          <router-link
            to="/auth"
            class="flex items-center px-4 py-3 text-base font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white mx-4 rounded-lg"
            @click="showMobileMenu = false"
          >
            Registrarse
          </router-link>
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