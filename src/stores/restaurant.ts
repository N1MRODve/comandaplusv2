import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

interface Restaurant {
  id: string
  nombre: string
  descripcion: string
  direccion: string
  telefono: string
  email: string
  url_logo: string
  horario_apertura: any
  esta_activo: boolean
}

interface MenuItem {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria_id: string
  categoria_nombre: string
  url_imagen: string
  esta_disponible: boolean
  alergenos: string[]
  tiempo_preparacion: number
}

export const useRestaurantStore = defineStore('restaurant', () => {
  const currentRestaurant = ref<Restaurant | null>(null)
  const menu = ref<MenuItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const categorias = computed(() => {
    const cats = new Set(menu.value.map(item => item.categoria_id))
    return Array.from(cats).map(id => {
      const plato = menu.value.find(p => p.categoria_id === id)
      return {
        id,
        nombre: plato?.categoria_nombre || ''
      }
    })
  })

  async function loadRestaurant(id: string) {
    try {
      loading.value = true
      error.value = null
      
      const { data: restaurant, error: err } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err
      currentRestaurant.value = restaurant

      // Subscribe to real-time changes
      const channel = supabase.channel('restaurant_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'restaurantes',
          filter: `id=eq.${id}`
        }, (payload) => {
          if (payload.new) {
            currentRestaurant.value = payload.new as Restaurant
          }
        })
        .subscribe()

      return channel
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading restaurant:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadMenu(restaurantId: string) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: err } = await supabase
        .rpc('get_menu_publico', { p_restaurante_id: restaurantId })

      if (err) throw err
      menu.value = data || []

      // Subscribe to real-time changes for menu items
      const channel = supabase.channel('menu_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'platos',
          filter: `restaurante_id=eq.${restaurantId}`
        }, async () => {
          // Refresh menu data using the function
          const { data: refreshedData } = await supabase
            .rpc('get_menu_publico', { p_restaurante_id: restaurantId })
          if (refreshedData) {
            menu.value = refreshedData
          }
        })
        .subscribe()

      return channel
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading menu:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    currentRestaurant,
    menu,
    loading,
    error,
    categorias,
    loadRestaurant,
    loadMenu
  }
})