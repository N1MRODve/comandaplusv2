<template>
  <div 
    aria-live="assertive" 
    class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <TransitionGroup 
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircle 
                  v-if="notification.type === 'success'"
                  class="h-6 w-6 text-green-400" 
                />
                <AlertCircle
                  v-else-if="notification.type === 'error'"
                  class="h-6 w-6 text-red-400"
                />
                <Info
                  v-else
                  class="h-6 w-6 text-blue-400"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="() => removeNotification(notification.id)"
                >
                  <span class="sr-only">Cerrar</span>
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-vue-next'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  timeout?: number
}

const notifications = ref<Notification[]>([])

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9)
  const newNotification = { ...notification, id }
  
  notifications.value.push(newNotification)

  if (notification.timeout !== 0) {
    setTimeout(() => {
      removeNotification(id)
    }, notification.timeout || 5000)
  }
}

const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

defineExpose({
  addNotification
})
</script>