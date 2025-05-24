import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { supabase, dashboardQueries, setupRealtimeSubscriptions, handleSupabaseError } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import type { RestauranteDashboard, AnalyticsRapidos } from '@/lib/supabase'

export interface PedidoActivo {
  id: string
  numero_pedido: string
  numero_mesa: string
  cliente_nombre?: string
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'entregado' | 'pagado' | 'cancelado'
  tipo_servicio: 'mesa' | 'barra' | 'para_llevar' | 'delivery'
  total: number
  tiempo_transcurrido: number
  items_totales: number
  items_listos: number
  notas?: string
  creado_el: string
  actualizado_el: string
}

export interface ItemPedido {
  id: string
  pedido_id: string
  nombre_plato: string
  cantidad: number
  precio: number
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'servido' | 'cancelado'
  estacion_preparacion?: string
  notas?: string
  tiempo_transcurrido: number
  prioridad: number
}

export interface EstadisticasRealTime {
  pedidos_hoy: number
  ventas_hoy: number
  ticket_promedio: number
  empleados_activos: number
  mesas_ocupadas: number
  tiempo_promedio_preparacion: number
  pedidos_pendientes: number
  pedidos_en_preparacion: number
  pedidos_listos: number
}

export interface VentasDiarias {
  fecha: string
  ventas: number
  pedidos: number
  ticket_promedio: number
}

export interface ProductoVendido {
  id: string
  nombre: string
  cantidad_vendida: number
  ingresos_totales: number
  porcentaje_ventas: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore()
  
  // Estado principal
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isRealTimeConnected = ref(false)
  const lastUpdate = ref<Date | null>(null)
  
  // Datos del dashboard
  const dashboardData = ref<RestauranteDashboard | null>(null)
  const analyticsData = ref<AnalyticsRapidos | null>(null)
  const pedidosActivos = ref<PedidoActivo[]>([])
  const itemsPendientes = ref<ItemPedido[]>([])
  const estadisticasRealTime = ref<EstadisticasRealTime | null>(null)
  const ventasUltimos7Dias = ref<VentasDiarias[]>([])
  const productosMasVendidos = ref<ProductoVendido[]>([])
  
  // Configuración
  const autoRefreshInterval = ref(30000) // 30 segundos
  const realTimeEnabled = ref(true)
  
  // Variables para suscripciones
  let realtimeCleanup: (() => void) | null = null
  let refreshTimer: NodeJS.Timeout | null = null
  
  // Computed properties
  const hasData = computed(() => !!dashboardData.value)
  const totalPedidosActivos = computed(() => pedidosActivos.value.length)
  const ventasHoy = computed(() => dashboardData.value?.ventas_hoy || 0)
  const crecimientoVentas = computed(() => analyticsData.value?.crecimiento_mes_anterior || 0)
  const mesasOcupadas = computed(() => {
    const ocupadas = new Set(pedidosActivos.value
      .filter(p => p.tipo_servicio === 'mesa' && p.estado !== 'entregado' && p.estado !== 'cancelado')
      .map(p => p.numero_mesa)
    ).size
    const total = authStore.currentRestaurant?.numero_mesas || 10
    return { ocupadas, total, porcentaje: (ocupadas / total) * 100 }
  })
  
  const estadoPedidos = computed(() => {
    const pendientes = pedidosActivos.value.filter(p => p.estado === 'pendiente').length
    const en_preparacion = pedidosActivos.value.filter(p => p.estado === 'en_preparacion').length
    const listos = pedidosActivos.value.filter(p => p.estado === 'listo').length
    
    return { pendientes, en_preparacion, listos }
  })
  
  const productividadCocina = computed(() => {
    const itemsTotal = itemsPendientes.value.length
    const itemsListos = itemsPendientes.value.filter(i => i.estado === 'listo').length
    
    return {
      total: itemsTotal,
      completados: itemsListos,
      porcentaje: itemsTotal > 0 ? (itemsListos / itemsTotal) * 100 : 0
    }
  })
  
  const alertas = computed(() => {
    const alertas: Array<{
      tipo: 'info' | 'warning' | 'error' | 'success'
      mensaje: string
      prioridad: number
    }> = []
    
    // Pedidos con mucho tiempo de espera
    const pedidosAtrasados = pedidosActivos.value.filter(p => p.tiempo_transcurrido > 30)
    if (pedidosAtrasados.length > 0) {
      alertas.push({
        tipo: 'warning',
        mensaje: `${pedidosAtrasados.length} pedidos con más de 30 minutos de espera`,
        prioridad: 2
      })
    }
    
    // Mesas casi llenas
    if (mesasOcupadas.value.porcentaje > 90) {
      alertas.push({
        tipo: 'warning',
        mensaje: 'Capacidad casi completa - considerar gestión de espera',
        prioridad: 1
      })
    }
    
    // Sin conexión en tiempo real
    if (realTimeEnabled.value && !isRealTimeConnected.value) {
      alertas.push({
        tipo: 'error',
        mensaje: 'Desconectado del tiempo real - datos pueden estar desactualizados',
        prioridad: 3
      })
    }
    
    return alertas.sort((a, b) => b.prioridad - a.prioridad)
  })

  // Funciones principales
  async function initialize(restauranteId?: string) {
    const targetRestaurant = restauranteId || authStore.currentRestaurant?.id
    
    if (!targetRestaurant) {
      error.value = 'No hay restaurante seleccionado'
      return
    }
    
    try {
      loading.value = true
      error.value = null
      
      console.log('🏪 Inicializando dashboard para restaurante:', targetRestaurant)
      
      // Cargar datos iniciales en paralelo
      await Promise.all([
        loadDashboardData(targetRestaurant),
        loadAnalyticsData(targetRestaurant),
        loadPedidosActivos(targetRestaurant),
        loadItemsPendientes(targetRestaurant)
      ])
      
      // Configurar actualizaciones en tiempo real
      if (realTimeEnabled.value) {
        setupRealTimeSubscriptions(targetRestaurant)
      }
      
      // Configurar auto-refresh
      setupAutoRefresh(targetRestaurant)
      
      lastUpdate.value = new Date()
      console.log('✅ Dashboard inicializado correctamente')
      
    } catch (err) {
      console.error('Error inicializando dashboard:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
    } finally {
      loading.value = false
    }
  }
  
  async function loadDashboardData(restauranteId: string) {
    try {
      const data = await dashboardQueries.getDashboardData(restauranteId)
      dashboardData.value = data
      
      // Extraer datos adicionales
      if (data.ventas_ultimos_7_dias) {
        ventasUltimos7Dias.value = data.ventas_ultimos_7_dias
      }
      
      if (data.platos_mas_vendidos) {
        productosMasVendidos.value = data.platos_mas_vendidos.map((p, index) => ({
          id: `producto-${index}`,
          nombre: p.nombre,
          cantidad_vendida: p.cantidad,
          ingresos_totales: p.ingresos,
          porcentaje_ventas: 0 // Se calculará después
        }))
      }
      
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err)
      throw err
    }
  }
  
  async function loadAnalyticsData(restauranteId: string) {
    try {
      const data = await dashboardQueries.getAnalyticsRapidos(restauranteId)
      analyticsData.value = data
    } catch (err) {
      console.error('Error cargando analytics:', err)
      throw err
    }
  }
  
  async function loadPedidosActivos(restauranteId: string) {
    try {
      const data = await dashboardQueries.getPedidosActivos(restauranteId)
      
      // Transformar datos para el formato esperado
      pedidosActivos.value = data.map((pedido: any) => ({
        ...pedido,
        cliente_nombre: pedido.cliente_nombre || pedido.nombre_cliente || 'Cliente anónimo',
        tiempo_transcurrido: calcularTiempoTranscurrido(pedido.creado_el),
        items_totales: pedido.total_items || 0,
        items_listos: pedido.items_listos || 0
      }))
      
    } catch (err) {
      console.error('Error cargando pedidos activos:', err)
      throw err
    }
  }
  
  async function loadItemsPendientes(restauranteId: string) {
    try {
      const { data, error } = await supabase.rpc('get_items_estacion', {
        restaurante_uuid: restauranteId,
        estacion_param: null
      })
      
      if (error) throw error
      
      itemsPendientes.value = data.map((item: any) => ({
        ...item,
        tiempo_transcurrido: calcularTiempoTranscurrido(item.creado_el)
      }))
      
    } catch (err) {
      console.error('Error cargando items pendientes:', err)
      throw err
    }
  }
  
  async function refreshData(restauranteId?: string) {
    const targetRestaurant = restauranteId || authStore.currentRestaurant?.id
    if (!targetRestaurant) return
    
    try {
      // Refrescar sin mostrar loading completo
      await Promise.all([
        loadPedidosActivos(targetRestaurant),
        loadItemsPendientes(targetRestaurant)
      ])
      
      lastUpdate.value = new Date()
    } catch (err) {
      console.error('Error refrescando datos:', err)
    }
  }
  
  async function updatePedidoEstado(pedidoId: string, nuevoEstado: string) {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          estado: nuevoEstado,
          actualizado_el: new Date().toISOString()
        })
        .eq('id', pedidoId)
      
      if (error) throw error
      
      // Actualizar localmente
      const pedidoIndex = pedidosActivos.value.findIndex(p => p.id === pedidoId)
      if (pedidoIndex !== -1) {
        pedidosActivos.value[pedidoIndex].estado = nuevoEstado as any
        pedidosActivos.value[pedidoIndex].actualizado_el = new Date().toISOString()
      }
      
    } catch (err) {
      console.error('Error actualizando estado del pedido:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      throw err
    }
  }
  
  async function updateItemEstado(itemId: string, nuevoEstado: string) {
    try {
      const { error } = await supabase
        .from('items_pedido')
        .update({ 
          estado: nuevoEstado,
          actualizado_el: new Date().toISOString()
        })
        .eq('id', itemId)
      
      if (error) throw error
      
      // Actualizar localmente
      const itemIndex = itemsPendientes.value.findIndex(i => i.id === itemId)
      if (itemIndex !== -1) {
        itemsPendientes.value[itemIndex].estado = nuevoEstado as any
      }
      
    } catch (err) {
      console.error('Error actualizando estado del item:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      throw err
    }
  }
  
  function setupRealTimeSubscriptions(restauranteId: string) {
    // Limpiar suscripciones anteriores
    if (realtimeCleanup) {
      realtimeCleanup()
    }
    
    console.log('🔄 Configurando suscripciones en tiempo real para:', restauranteId)
    
    realtimeCleanup = setupRealtimeSubscriptions(restauranteId, {
      onPedidoChange: (payload) => {
        console.log('📦 Cambio en pedido:', payload)
        
        if (payload.eventType === 'INSERT') {
          // Nuevo pedido
          const nuevoPedido = {
            ...payload.new,
            cliente_nombre: payload.new.nombre_cliente || 'Cliente anónimo',
            tiempo_transcurrido: 0,
            items_totales: 0,
            items_listos: 0
          }
          pedidosActivos.value.unshift(nuevoPedido)
        } else if (payload.eventType === 'UPDATE') {
          // Pedido actualizado
          const index = pedidosActivos.value.findIndex(p => p.id === payload.new.id)
          if (index !== -1) {
            pedidosActivos.value[index] = {
              ...pedidosActivos.value[index],
              ...payload.new,
              tiempo_transcurrido: calcularTiempoTranscurrido(payload.new.creado_el)
            }
          }
        } else if (payload.eventType === 'DELETE') {
          // Pedido eliminado
          const index = pedidosActivos.value.findIndex(p => p.id === payload.old.id)
          if (index !== -1) {
            pedidosActivos.value.splice(index, 1)
          }
        }
        
        lastUpdate.value = new Date()
      },
      
      onItemChange: (payload) => {
        console.log('🍽️ Cambio en item:', payload)
        
        if (payload.eventType === 'INSERT') {
          const nuevoItem = {
            ...payload.new,
            tiempo_transcurrido: 0
          }
          itemsPendientes.value.unshift(nuevoItem)
        } else if (payload.eventType === 'UPDATE') {
          const index = itemsPendientes.value.findIndex(i => i.id === payload.new.id)
          if (index !== -1) {
            itemsPendientes.value[index] = {
              ...itemsPendientes.value[index],
              ...payload.new,
              tiempo_transcurrido: calcularTiempoTranscurrido(payload.new.creado_el)
            }
          }
        } else if (payload.eventType === 'DELETE') {
          const index = itemsPendientes.value.findIndex(i => i.id === payload.old.id)
          if (index !== -1) {
            itemsPendientes.value.splice(index, 1)
          }
        }
        
        lastUpdate.value = new Date()
      }
    })
    
    isRealTimeConnected.value = true
  }
  
  function setupAutoRefresh(restauranteId: string) {
    // Limpiar timer anterior
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    
    // Configurar nuevo timer
    refreshTimer = setInterval(() => {
      if (!loading.value) {
        refreshData(restauranteId)
      }
    }, autoRefreshInterval.value)
  }
  
  function calcularTiempoTranscurrido(fechaCreacion: string): number {
    const ahora = new Date()
    const creacion = new Date(fechaCreacion)
    return Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60)) // minutos
  }
  
  function setAutoRefreshInterval(intervalMs: number) {
    autoRefreshInterval.value = intervalMs
    
    const restauranteId = authStore.currentRestaurant?.id
    if (restauranteId) {
      setupAutoRefresh(restauranteId)
    }
  }
  
  function enableRealTime() {
    realTimeEnabled.value = true
    
    const restauranteId = authStore.currentRestaurant?.id
    if (restauranteId) {
      setupRealTimeSubscriptions(restauranteId)
    }
  }
  
  function disableRealTime() {
    realTimeEnabled.value = false
    isRealTimeConnected.value = false
    
    if (realtimeCleanup) {
      realtimeCleanup()
      realtimeCleanup = null
    }
  }
  
  function cleanup() {
    console.log('🧹 Limpiando dashboard store...')
    
    // Limpiar suscripciones
    if (realtimeCleanup) {
      realtimeCleanup()
      realtimeCleanup = null
    }
    
    // Limpiar timer
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
    
    // Resetear estado
    isRealTimeConnected.value = false
    error.value = null
  }
  
  function clearError() {
    error.value = null
  }
  
  return {
    // Estado readonly
    loading: readonly(loading),
    error: readonly(error),
    isRealTimeConnected: readonly(isRealTimeConnected),
    lastUpdate: readonly(lastUpdate),
    dashboardData: readonly(dashboardData),
    analyticsData: readonly(analyticsData),
    pedidosActivos: readonly(pedidosActivos),
    itemsPendientes: readonly(itemsPendientes),
    estadisticasRealTime: readonly(estadisticasRealTime),
    ventasUltimos7Dias: readonly(ventasUltimos7Dias),
    productosMasVendidos: readonly(productosMasVendidos),
    autoRefreshInterval: readonly(autoRefreshInterval),
    realTimeEnabled: readonly(realTimeEnabled),
    
    // Computed properties
    hasData,
    totalPedidosActivos,
    ventasHoy,
    crecimientoVentas,
    mesasOcupadas,
    estadoPedidos,
    productividadCocina,
    alertas,
    
    // Actions
    initialize,
    refreshData,
    updatePedidoEstado,
    updateItemEstado,
    setAutoRefreshInterval,
    enableRealTime,
    disableRealTime,
    cleanup,
    clearError
  }
})