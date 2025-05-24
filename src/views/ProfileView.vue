<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Perfil de Usuario
          </h3>
          
          <form @submit.prevent="handleSubmit" class="mt-5 space-y-6">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <div class="mt-1">
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  disabled
                  class="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <div class="mt-1">
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex justify-center rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import AppLayout from '@/components/layout/AppLayout.vue'
import { supabase } from '@/lib/supabase'

const authStore = useAuthStore()
const notifications = useNotificationStore()
const { user, profile } = storeToRefs(authStore)

const loading = ref(false)
const form = ref({
  fullName: '',
  email: '',
  phone: ''
})

onMounted(() => {
  if (profile.value) {
    form.value = {
      fullName: profile.value.nombre_completo,
      email: profile.value.email,
      phone: profile.value.telefono || ''
    }
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true

    const { error } = await supabase
      .from('perfiles')
      .update({
        nombre_completo: form.value.fullName,
        telefono: form.value.phone
      })
      .eq('id', user.value?.id)

    if (error) throw error

    notifications.add({
      type: 'success',
      title: 'Perfil actualizado',
      message: 'Los cambios han sido guardados correctamente'
    })
  } catch (error: any) {
    notifications.add({
      type: 'error',
      title: 'Error',
      message: error.message
    })
  } finally {
    loading.value = false
  }
}
</script>