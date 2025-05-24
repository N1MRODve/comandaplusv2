import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  timeout?: number
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function add(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id }
    
    notifications.value.push(newNotification)

    if (notification.timeout !== 0) {
      setTimeout(() => {
        remove(id)
      }, notification.timeout || 5000)
    }
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    add,
    remove
  }
})