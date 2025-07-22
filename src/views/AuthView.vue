<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">ComandaPlus</h1>
        <h2 class="mt-6 text-2xl font-semibold text-gray-900">
          {{ isLogin ? 'Iniciar sesión' : 'Crear cuenta' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          <button 
            @click="toggleMode"
            class="font-medium text-orange-600 hover:text-orange-500"
          >
            {{ isLogin ? 'Regístrate' : 'Inicia sesión' }}
          </button>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nombre completo (solo registro) -->
          <div v-if="!isLogin">
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <div class="mt-1">
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Tu nombre completo"
              />
            </div>
            <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
              {{ errors.fullName }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00.007 4.243m4.242 4.242L16.535 16.535M14.12 14.12l-.007-.007M9.878 9.878L7.757 7.757M16.535 16.535L18.95 18.95M14.12 14.12l2.415 2.415" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirmar contraseña (solo registro) -->
          <div v-if="!isLogin">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Recordar sesión / Términos -->
          <div class="flex items-center justify-between">
            <div v-if="isLogin" class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordar sesión
              </label>
            </div>
            <div v-else class="flex items-center">
              <input
                id="accept-terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label for="accept-terms" class="ml-2 block text-sm text-gray-900">
                Acepto los 
                <a href="#" class="text-orange-600 hover:text-orange-500">términos y condiciones</a>
              </label>
            </div>

            <div v-if="isLogin" class="text-sm">
              <button
                type="button"
                @click="showForgotPassword = true"
                class="font-medium text-orange-600 hover:text-orange-500"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <!-- Error general -->
          <div v-if="submitError" class="p-4 bg-red-50 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ submitError }}</p>
              </div>
            </div>
          </div>

          <!-- Botón submit -->
          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? (isLogin ? 'Iniciando sesión...' : 'Creando cuenta...') : (isLogin ? 'Iniciar sesión' : 'Crear cuenta') }}
            </button>
          </div>
        </form>

        <!-- Modal de recuperar contraseña -->
        <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-lg max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Recuperar contraseña</h3>
              <button @click="showForgotPassword = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="handleForgotPassword">
              <div class="mb-4">
                <label for="resetEmail" class="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  id="resetEmail"
                  v-model="resetEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="tu@email.com"
                />
              </div>
              <div class="flex space-x-3">
                <button
                  type="button"
                  @click="showForgotPassword = false"
                  class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="!resetEmail || resetLoading"
                  class="flex-1 py-2 px-4 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
                >
                  {{ resetLoading ? 'Enviando...' : 'Enviar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()

// Estado del formulario
const isLogin = ref(true)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const loading = ref(false)
const resetLoading = ref(false)
const submitError = ref('')
const resetEmail = ref('')

const form = ref({
  email: '',
  password: '',
  fullName: '',
  confirmPassword: '',
  rememberMe: false,
  acceptTerms: false
})

const errors = ref<Record<string, string>>({})

// Computed properties
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.value.email && form.value.password
  } else {
    return (
      form.value.email &&
      form.value.password &&
      form.value.fullName &&
      form.value.confirmPassword &&
      form.value.acceptTerms
    )
  }
})

// Métodos
const toggleMode = () => {
  isLogin.value = !isLogin.value
  errors.value = {}
  submitError.value = ''
}

const validateForm = () => {
  errors.value = {}

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Email no válido'
  }

  // Validar contraseña
  if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (!isLogin.value) {
    // Validar nombre completo
    if (form.value.fullName.trim().length < 2) {
      errors.value.fullName = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar confirmación de contraseña
    if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = 'Las contraseñas no coinciden'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    submitError.value = ''

    if (isLogin.value) {
      // Iniciar sesión
      await authStore.signIn(form.value.email, form.value.password)
      showToast('Sesión iniciada correctamente', 'success')
    } else {
      // Registrarse
      await authStore.signUp(form.value.email, form.value.password, {
        full_name: form.value.fullName
      })
      showToast('Cuenta creada correctamente', 'success')
    }

    // REDIRECCIÓN SIMPLIFICADA Y FORZADA
    // Esperar para que se actualice el store
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Forzar redirección al dashboard del restaurante conocido
    router.push('/dashboard/149ffffb-770a-402e-a971-ef8be6080c6c')

  } catch (error) {
    console.error('Auth error:', error)
    submitError.value = error instanceof Error ? error.message : 'Error de autenticación'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!resetEmail.value) return

  try {
    resetLoading.value = true
    
    await authStore.resetPassword(resetEmail.value)
    showToast('Email de recuperación enviado', 'success')
    showForgotPassword.value = false
    resetEmail.value = ''
  } catch (error) {
    console.error('Reset password error:', error)
    showToast('Error al enviar el email de recuperación', 'error')
  } finally {
    resetLoading.value = false
  }
}
</script>