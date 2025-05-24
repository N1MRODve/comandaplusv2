import { ref, reactive } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
}

// Estado global de toasts
const toasts = ref<Toast[]>([])

export function useToast() {
  
  const showToast = (
    message: string, 
    type: Toast['type'] = 'info',
    options: { duration?: number; persistent?: boolean } = {}
  ) => {
    const toast: Toast = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      duration: options.duration ?? (type === 'error' ? 5000 : 3000),
      persistent: options.persistent ?? false
    }

    toasts.value.push(toast)

    // Auto-remove toast si no es persistente
    if (!toast.persistent && toast.duration) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Shortcuts para tipos específicos
  const success = (message: string, options?: { duration?: number; persistent?: boolean }) => {
    return showToast(message, 'success', options)
  }

  const error = (message: string, options?: { duration?: number; persistent?: boolean }) => {
    return showToast(message, 'error', options)
  }

  const warning = (message: string, options?: { duration?: number; persistent?: boolean }) => {
    return showToast(message, 'warning', options)
  }

  const info = (message: string, options?: { duration?: number; persistent?: boolean }) => {
    return showToast(message, 'info', options)
  }

  return {
    toasts: toasts.value,
    showToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  }
}