<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navigation -->
    <AppNavigation 
      v-if="showNavigation"
      :user="authStore.profile"
      :current-route="$route.name"
      @sign-out="handleSignOut"
    />

    <!-- Main Content -->
    <main :class="mainClasses">
      <router-view />
    </main>

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AppNavigation from './AppNavigation.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

// Computed properties
const showNavigation = computed(() => {
  // Rutas donde NO mostrar navegación
  const routesWithoutNav = ['menu-digital', 'auth', 'create-profile', 'demo-landing']
  
  // También ocultar navegación para todas las rutas que empiecen con 'demo-'
  if (route.name && typeof route.name === 'string' && route.name.startsWith('demo-')) {
    return false
  }
  
  return !routesWithoutNav.includes(route.name as string)
})

const mainClasses = computed(() => {
  const base = 'flex-1'
  
  if (!showNavigation.value) {
    return base
  }
  
  // Si tiene navegación, agregar padding top
  return `${base} pt-16` // 64px de altura de la barra de navegación
})

// Methods
const handleSignOut = async () => {
  try {
    await authStore.signOut()
    showToast('Sesión cerrada correctamente', 'success')
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
    showToast('Error al cerrar sesión', 'error')
  }
}
</script>