import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface OrderItem {
  id: string
  pedido_id: string
  plato_id: string
  nombre_plato: string
  cantidad: number
  precio: number
  estado: string
  estacion_preparacion: string
  notas?: string
}

interface Order {
  id: string
  numero_pedido: string
  numero_mesa: string
  estado: string
  tipo_servicio: string
  subtotal: number
  total: number
  notas?: string
  hora_pedido: string
  items: OrderItem[]
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadOrders() {
    try {
      loading.value = true
      error.value = null

      const { data: ordersData, error: ordersError } = await supabase
        .from('pedidos')
        .select(`
          *,
          items:items_pedido (
            id,
            plato_id,
            nombre_plato,
            cantidad,
            precio,
            estado,
            estacion_preparacion,
            notas
          )
        `)
        .order('hora_pedido', { ascending: false })

      if (ordersError) throw ordersError
      orders.value = ordersData || []
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading orders:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateOrder(orderId: string, updates: Partial<Order>) {
    try {
      const { error: updateError } = await supabase
        .from('pedidos')
        .update(updates)
        .eq('id', orderId)

      if (updateError) throw updateError
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating order:', err)
    }
  }

  async function updateOrderItem(itemId: string, updates: Partial<OrderItem>) {
    try {
      const { error: updateError } = await supabase
        .from('items_pedido')
        .update(updates)
        .eq('id', itemId)

      if (updateError) throw updateError
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating order item:', err)
    }
  }

  function handleOrderUpdate(payload: RealtimePostgresChangesPayload) {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        orders.value.unshift(newRecord as Order)
        break
      case 'UPDATE':
        const index = orders.value.findIndex(o => o.id === oldRecord.id)
        if (index !== -1) {
          orders.value[index] = { ...orders.value[index], ...newRecord }
        }
        break
      case 'DELETE':
        orders.value = orders.value.filter(o => o.id !== oldRecord.id)
        break
    }
  }

  function handleItemUpdate(payload: RealtimePostgresChangesPayload) {
    const { eventType, new: newRecord, old: oldRecord } = payload

    const order = orders.value.find(o => 
      o.items.some(i => i.id === (oldRecord?.id || newRecord?.id))
    )

    if (!order) return

    switch (eventType) {
      case 'INSERT':
        order.items.push(newRecord as OrderItem)
        break
      case 'UPDATE':
        const itemIndex = order.items.findIndex(i => i.id === oldRecord.id)
        if (itemIndex !== -1) {
          order.items[itemIndex] = { ...order.items[itemIndex], ...newRecord }
        }
        break
      case 'DELETE':
        order.items = order.items.filter(i => i.id !== oldRecord.id)
        break
    }
  }

  return {
    orders,
    loading,
    error,
    loadOrders,
    updateOrder,
    updateOrderItem,
    handleOrderUpdate,
    handleItemUpdate
  }
})