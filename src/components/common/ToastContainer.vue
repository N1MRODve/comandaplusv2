<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'rounded-lg shadow-lg p-4 flex items-start space-x-3 max-w-sm',
            getToastClasses(toast.type)
          ]"
        >
          <!-- Icono -->
          <div class="flex-shrink-0">
            <component :is="getToastIcon(toast.type)" :class="getIconClasses(toast.type)" />
          </div>
          
          <!-- Contenido -->
          <div class="flex-1 min-w-0">
            <p :class="getTextClasses(toast.type)">
              {{ toast.message }}
            </p>
          </div>
          
          <!-- Botón cerrar -->
          <button
            @click="removeToast(toast.id)"
            :class="[
              'flex-shrink-0 rounded-md p-1.5 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2',
              getCloseButtonClasses(toast.type)
            ]"
          >
            <span class="sr-only">Cerrar</span>
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

// Iconos SVG como componentes inline
const CheckCircleIcon = {
  template: `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
  `
}

const XCircleIcon = {
  template: `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>
  `
}

const ExclamationTriangleIcon = {
  template: `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  `
}

const InformationCircleIcon = {
  template: `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>
  `
}

const XMarkIcon = {
  template: `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `
}

const { toasts, removeToast } = useToast()

// Funciones para obtener clases según el tipo
const getToastClasses = (type: string) => {
  const classes = {
    success: 'bg-green-50 border border-green-200',
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getIconClasses = (type: string) => {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getTextClasses = (type: string) => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return `text-sm font-medium ${classes[type as keyof typeof classes] || classes.info}`
}

const getCloseButtonClasses = (type: string) => {
  const classes = {
    success: 'text-green-500 hover:bg-green-100 focus:ring-green-600',
    error: 'text-red-500 hover:bg-red-100 focus:ring-red-600',
    warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
    info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getToastIcon = (type: string) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[type as keyof typeof icons] || icons.info
}
</script>

<style scoped>
/* Transiciones para los toasts */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>