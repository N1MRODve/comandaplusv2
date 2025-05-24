<template>
  <AppLayout />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

// Inicializar la aplicación
onMounted(async () => {
  // Cargar usuario autenticado si existe
  await authStore.loadUser()
  
  // Restaurar carrito desde localStorage si existe
  cartStore.loadFromLocalStorage()
  
  // Configurar listeners para guardar carrito automáticamente
  window.addEventListener('beforeunload', () => {
    cartStore.saveToLocalStorage()
  })
})
</script>

<style>
/* Reset y estilos globales */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
}

/* Estilos para scroll suave */
html {
  scroll-behavior: smooth;
}

/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Estilos para focus outline */
.focus\:ring-orange-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(249 115 22 / var(--tw-ring-opacity));
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Animaciones personalizadas */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Utilidades adicionales */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos para botones de carga */
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  color: white;
}

/* Mejoras de accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Estilos para el modo oscuro (preparación futura) */
@media (prefers-color-scheme: dark) {
  /* Los estilos de modo oscuro se pueden agregar aquí en el futuro */
}

/* Responsive breakpoints helpers */
@media (max-width: 640px) {
  .mobile-only {
    display: block;
  }
  .desktop-only {
    display: none;
  }
}

@media (min-width: 641px) {
  .mobile-only {
    display: none;
  }
  .desktop-only {
    display: block;
  }
}

/* Estilos para impresión */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}
</style>