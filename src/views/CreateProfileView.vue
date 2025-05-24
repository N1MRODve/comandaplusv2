<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">ComandaPlus</h1>
        <h2 class="mt-6 text-2xl font-semibold text-gray-900">
          Completa tu perfil
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Para continuar, necesitamos algunos datos adicionales
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Información del usuario actual -->
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-800">
                Usuario: {{ authStore.user?.email }}
              </p>
              <p class="text-sm text-blue-600">
                ID: {{ authStore.user?.id }}
              </p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nombre completo -->
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">
              Nombre completo *
            </label>
            <div class="mt-1">
              <input
                id="nombre"
                v-model="form.nombre_completo"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Tu nombre completo"
              />
            </div>
            <p v-if="errors.nombre_completo" class="mt-1 text-sm text-red-600">
              {{ errors.nombre_completo }}
            </p>
          </div>

          <!-- Teléfono -->
          <div>
            <label for="telefono" class="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div class="mt-1">
              <input
                id="telefono"
                v-model="form.telefono"
                type="tel"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="+34 612 345 678"
              />
            </div>
            <p v-if="errors.telefono" class="mt-1 text-sm text-red-600">
              {{ errors.telefono }}
            </p>
          </div>

          <!-- Rol -->
          <div>
            <label for="rol" class="block text-sm font-medium text-gray-700">
              ¿Cuál es tu rol? *
            </label>
            <div class="mt-1">
              <select
                id="rol"
                v-model="form.rol"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                <option value="">Selecciona tu rol</option>
                <option value="cliente">Cliente - Solo quiero hacer pedidos</option>
                <option value="empleado">Empleado - Trabajo en un restaurante</option>
                <option value="dueño">Propietario - Tengo mi propio restaurante</option>
              </select>
            </div>
            <p v-if="errors.rol" class="mt-1 text-sm text-red-600">
              {{ errors.rol }}
            </p>
          </div>

          <!-- Descripción del rol seleccionado -->
          <div v-if="form.rol" class="p-4 bg-gray-50 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">
                  {{ getRoleDescription(form.rol) }}
                </p>
              </div>
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

          <!-- Botones -->
          <div class="flex flex-col space-y-4">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Creando perfil...' : 'Crear perfil' }}
            </button>

            <button
              type="button"
              @click="handleSignOut"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cerrar sesión
            </button>
          </div>
        </form>

        <!-- Información adicional -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Información</span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              Esta información se utilizará para personalizar tu experiencia en ComandaPlus.
              Podrás modificarla más tarde desde tu perfil.
            </p>
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

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado del formulario
const form = ref({
  nombre_completo: '',
  telefono: '',
  rol: '' as 'cliente' | 'empleado' | 'dueño' | ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const submitError = ref('')

// Validaciones
const isFormValid = computed(() => {
  return form.value.nombre_completo.trim().length > 0 && form.value.rol !== ''
})

// Descripciones de roles
const getRoleDescription = (rol: string) => {
  const descriptions = {
    cliente: 'Podrás hacer pedidos escaneando códigos QR en restaurantes.',
    empleado: 'Podrás gestionar pedidos y trabajar en restaurantes registrados.',
    dueño: 'Podrás crear y gestionar tus propios restaurantes, menús y empleados.'
  }
  return descriptions[rol as keyof typeof descriptions] || ''
}

// Validar formulario
const validateForm = () => {
  errors.value = {}

  if (!form.value.nombre_completo.trim()) {
    errors.value.nombre_completo = 'El nombre es obligatorio'
  } else if (form.value.nombre_completo.trim().length < 2) {
    errors.value.nombre_completo = 'El nombre debe tener al menos 2 caracteres'
  }

  if (form.value.telefono && !/^[+]?[\d\s\-()]+$/.test(form.value.telefono)) {
    errors.value.telefono = 'Formato de teléfono inválido'
  }

  if (!form.value.rol) {
    errors.value.rol = 'Debes seleccionar un rol'
  }

  return Object.keys(errors.value).length === 0
}

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    submitError.value = ''

    // Crear perfil
    await authStore.createProfile({
      nombre_completo: form.value.nombre_completo.trim(),
      telefono: form.value.telefono.trim() || undefined,
      rol: form.value.rol
    })

    // Redirigir al destino original o dashboard
    const redirectTo = route.query.redirect as string || '/dashboard'
    router.push(redirectTo)

  } catch (error) {
    console.error('Error creating profile:', error)
    submitError.value = error instanceof Error ? error.message : 'Error al crear el perfil'
  } finally {
    loading.value = false
  }
}

// Cerrar sesión
const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// Prerellenar nombre si está disponible en user metadata
if (authStore.user?.user_metadata?.full_name) {
  form.value.nombre_completo = authStore.user.user_metadata.full_name
}
if (authStore.user?.user_metadata?.phone) {
  form.value.telefono = authStore.user.user_metadata.phone
}
</script>