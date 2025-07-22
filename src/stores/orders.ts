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

  async function loadItemsForOrder(orderId: string) {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('items_pedido')
        .select('*')
        .eq('pedido_id', orderId);

      if (itemsError) throw itemsError;

      const orderIndex = orders.value.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders.value[orderIndex].items = itemsData || [];
      }
    } catch (err: any) {
      console.error('Error loading items for order:', err);
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

  async function handleOrderUpdate(payload: RealtimePostgresChangesPayload<any>) {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          orders.value.unshift({ ...newRecord as Order, items: [] });
          await loadItemsForOrder(newRecord.id);
        }
        break
      case 'UPDATE':
        const index = orders.value.findIndex(o => o.id === (oldRecord?.id || newRecord?.id))
        if (index !== -1 && newRecord) {
          orders.value[index] = { ...orders.value[index], ...newRecord }
        }
        break
      case 'DELETE':
        orders.value = orders.value.filter(o => o.id !== oldRecord?.id)
        break
    }
  }

  function handleItemUpdate(payload: RealtimePostgresChangesPayload<any>) {
    const { eventType, new: newRecord, old: oldRecord } = payload

    const order = orders.value.find(o => 
      o.items.some(i => i.id === (oldRecord?.id || newRecord?.id))
    )

    if (!order) return

    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          order.items.push(newRecord as OrderItem)
        }
        break
      case 'UPDATE':
        const itemIndex = order.items.findIndex(i => i.id === (oldRecord?.id || newRecord?.id))
        if (itemIndex !== -1 && newRecord) {
          order.items[itemIndex] = { ...order.items[itemIndex], ...newRecord }
        }
        break
      case 'DELETE':
        order.items = order.items.filter(i => i.id !== oldRecord?.id)
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