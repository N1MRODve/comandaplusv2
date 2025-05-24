<template>
  <nav class="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex items-center">
          <!-- Logo -->
          <router-link 
            to="/dashboard" 
            class="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
          >
            <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">C+</span>
            </div>
            <span class="hidden sm:block">ComandaPlus</span>
          </router-link>

          <!-- Navegación desktop -->
          <div class="hidden md:ml-8 md:flex md:space-x-1">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActiveRoute(item.to) 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4 mr-2 inline" />
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Acciones del usuario -->
        <div class="flex items-center space-x-4">
          <!-- Notificaciones (placeholder) -->
          <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <BellIcon class="w-5 h-5" />
            <!-- Badge de notificaciones -->
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- Perfil del usuario -->
          <div class="relative" ref="profileDropdown">
            <button
              @click="showProfileMenu = !showProfileMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <!-- Avatar -->
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  v-if="user?.url_avatar" 
                  :src="user.url_avatar" 
                  :alt="user.nombre_completo"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-gray-600 text-sm font-medium">
                  {{ getUserInitials(user?.nombre_completo) }}
                </span>
              </div>
              
              <!-- Nombre y rol (desktop) -->
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-gray-900">
                  {{ user?.nombre_completo || 'Usuario' }}
                </p>
                <p class="text-xs text-gray-500 capitalize">
                  {{ user?.rol || 'cliente' }}
                </p>
              </div>

              <!-- Icono dropdown -->
              <ChevronDownIcon class="w-4 h-4 text-gray-500" />
            </button>

            <!-- Dropdown del perfil -->
            <Transition name="dropdown">
              <div
                v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                @click.stop
              >
                <!-- Información del usuario (móvil) -->
                <div class="px-4 py-3 border-b border-gray-100 sm:hidden">
                  <p class="text-sm font-medium text-gray-900">
                    {{ user?.nombre_completo || 'Usuario' }}
                  </p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>

                <!-- Opciones del menú -->
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="showProfileMenu = false"
                >
                  <UserIcon class="w-4 h-4 mr-3 inline" />
                  Mi perfil
                </router-link>

                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="showProfileMenu = false"
                >
                  <CogIcon class="w-4 h-4 mr-3 inline" />
                  Configuración
                </router-link>

                <div class="border-t border-gray-100 mt-1">
                  <button
                    @click="handleSignOut"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3 inline" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Menú móvil toggle -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-5 h-5" />
            <XMarkIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Menú móvil -->
      <Transition name="mobile-menu">
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 pb-3">
          <div class="pt-2 space-y-1">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                isActiveRoute(item.to)
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
              @click="showMobileMenu = false"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3 inline" />
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// Iconos SVG como componentes
const HomeIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
}

const ClipboardDocumentListIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>`
}

const ChartBarIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>`
}

const BellIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>`
}

const UserIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
}

const CogIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
}

const ArrowRightOnRectangleIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>`
}

const ChevronDownIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`
}

const Bars3Icon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`
}

const XMarkIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`
}

interface Props {
  user: any
  currentRoute: string | symbol | null | undefined
}

interface Emits {
  (e: 'sign-out'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const route = useRoute()
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)
const profileDropdown = ref<HTMLElement | null>(null)

// Items de navegación basados en el rol del usuario
const navigationItems = computed(() => {
  const baseItems = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon, roles: ['admin', 'dueño', 'encargado', 'empleado'] },
    { name: 'Pedidos', to: '/pedidos', icon: ClipboardDocumentListIcon, roles: ['admin', 'dueño', 'encargado', 'empleado'] },
    { name: 'Analytics', to: '/analytics', icon: ChartBarIcon, roles: ['admin', 'dueño', 'encargado'] }
  ]

  // Filtrar por rol si el usuario tiene uno
  if (props.user?.rol) {
    return baseItems.filter(item => item.roles.includes(props.user.rol))
  }

  return baseItems
})

// Métodos
const isActiveRoute = (routePath: string) => {
  return route.path === routePath || route.name === routePath.slice(1)
}

const getUserInitials = (name?: string) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const handleSignOut = () => {
  showProfileMenu.value = false
  emit('sign-out')
}

// Cerrar menús al hacer click fuera
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

<style scoped>
/* Transiciones para dropdowns */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.dropdown-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Transiciones para menú móvil */
.mobile-menu-enter-active {
  transition: all 0.3s ease-out;
}

.mobile-menu-leave-active {
  transition: all 0.2s ease-in;
}

.mobile-menu-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.mobile-menu-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>