import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

interface DailySales {
  date: string
  total: number
  orders: number
}

interface TopItem {
  id: string
  name: string
  quantity: number
  total: number
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const dailySales = ref<DailySales[]>([])
  const topItems = ref<TopItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadDailySales(restaurantId: string, days: number = 30) {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('pedidos')
        .select('total, hora_pedido')
        .eq('restaurante_id', restaurantId)
        .gte('hora_pedido', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('hora_pedido', { ascending: true })

      if (err) throw err

      // Agrupar por día
      const salesByDay = data?.reduce((acc: Record<string, DailySales>, order) => {
        const date = new Date(order.hora_pedido).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { date, total: 0, orders: 0 }
        }
        acc[date].total += order.total
        acc[date].orders += 1
        return acc
      }, {})

      dailySales.value = Object.values(salesByDay || {})
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading daily sales:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadTopItems(restaurantId: string, limit: number = 10) {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('items_pedido')
        .select(`
          plato_id,
          nombre_plato,
          cantidad,
          precio,
          pedidos!inner (restaurante_id)
        `)
        .eq('pedidos.restaurante_id', restaurantId)
        .order('cantidad', { ascending: false })
        .limit(limit)

      if (err) throw err

      // Agrupar por plato
      const itemsMap = data?.reduce((acc: Record<string, TopItem>, item) => {
        if (!acc[item.plato_id]) {
          acc[item.plato_id] = {
            id: item.plato_id,
            name: item.nombre_plato,
            quantity: 0,
            total: 0
          }
        }
        acc[item.plato_id].quantity += item.cantidad
        acc[item.plato_id].total += item.cantidad * item.precio
        return acc
      }, {})

      topItems.value = Object.values(itemsMap || {}).sort((a, b) => b.quantity - a.quantity)
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading top items:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    dailySales,
    topItems,
    loading,
    error,
    loadDailySales,
    loadTopItems
  }
})