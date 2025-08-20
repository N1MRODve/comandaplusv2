import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { barPedidos } from '../data/bar/mockPedidos'
import { barMesas } from '../data/bar/mockMesas'
import { barCategorias, barPlatos, obtenerMenuCompletoBar } from '../data/bar/mockMenu'
import { barAnalytics } from '../data/bar/mockAnalytics'
import type { BarPedido, BarItemPedido } from '../data/bar/mockPedidos'
import type { BarMesa } from '../data/bar/mockMesas'
import type { BarCategoria, BarPlato } from '../data/bar/mockMenu'

export const useBarDemoStore = defineStore('barDemo', () => {
  // Estado reactivo
  const pedidos = ref<BarPedido[]>([...barPedidos])
  const mesas = ref<BarMesa[]>([...barMesas])
  const categorias = ref<BarCategoria[]>([...barCategorias])
  const platos = ref<BarPlato[]>([...barPlatos])
  const analytics = ref(barAnalytics)
  
  // Estado de la demo
  const isDemoMode = ref(true)
  const lastUpdate = ref<Date>(new Date())
  const simulateRealTime = ref(true)
  
  // Computed properties para pedidos
  const pedidosActivos = computed(() => 
    pedidos.value.filter(p => !['entregado', 'pagado', 'cancelado'].includes(p.estado))
  )
  
  const estadoPedidos = computed(() => {
    const estados = {
      pendientes: 0,
      en_preparacion: 0,
      listos: 0
    }
    
    pedidosActivos.value.forEach(pedido => {
      switch (pedido.estado) {
        case 'pendiente':
        case 'confirmado':
          estados.pendientes++
          break
        case 'en_preparacion':
          estados.en_preparacion++
          break
        case 'listo':
          estados.listos++
          break
      }
    })
    
    return estados
  })
  
  const itemsPendientes = computed(() => {
    const items: any[] = []
    pedidosActivos.value.forEach(pedido => {
      pedido.items.forEach(item => {
        if (!['servido', 'cancelado'].includes(item.estado)) {
          items.push({
            ...item,
            numero_pedido: pedido.numero_pedido,
            numero_mesa: pedido.numero_mesa,
            tiempo_transcurrido: calcularTiempoTranscurrido(pedido.hora_pedido)
          })
        }
      })
    })
    return items
  })
  
  // Computed properties para mesas
  const mesasOcupadas = computed(() => 
    mesas.value.filter(m => m.estado === 'ocupada').length
  )
  
  const mesasLibres = computed(() => 
    mesas.value.filter(m => m.estado === 'libre').length
  )
  
  const mesasReservadas = computed(() => 
    mesas.value.filter(m => m.estado === 'reservada').length
  )
  
  const totalMesas = computed(() => mesas.value.length)
  
  const porcentajeOcupacion = computed(() => {
    if (totalMesas.value === 0) return 0
    return (mesasOcupadas.value / totalMesas.value) * 100
  })
  
  const ingresosDelDia = computed(() => 
    mesas.value.reduce((sum, mesa) => sum + mesa.ingresos_hoy, 0)
  )
  
  const rotacionDelDia = computed(() => 
    mesas.value.reduce((sum, mesa) => sum + mesa.servicios_completados_hoy, 0)
  )
  
  // Computed properties para menú
  const categoriasActivas = computed(() => 
    categorias.value.filter(c => c.esta_disponible)
      .sort((a, b) => a.orden_visualizacion - b.orden_visualizacion)
  )
  
  const platosDisponibles = computed(() => 
    platos.value.filter(p => p.esta_disponible)
  )
  
  // Funciones utilitarias
  const calcularTiempoTranscurrido = (fechaCreacion: string): number => {
    const ahora = new Date()
    const creacion = new Date(fechaCreacion)
    return Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60))
  }
  
  // Acciones para pedidos
  const actualizarEstadoPedido = (pedidoId: string, nuevoEstado: string) => {
    const pedidoIndex = pedidos.value.findIndex(p => p.id === pedidoId)
    if (pedidoIndex !== -1) {
      pedidos.value[pedidoIndex].estado = nuevoEstado as any
      pedidos.value[pedidoIndex].actualizado_el = new Date().toISOString()
      
      // Actualizar timestamps según el estado
      const ahora = new Date().toISOString()
      switch (nuevoEstado) {
        case 'confirmado':
          pedidos.value[pedidoIndex].hora_confirmacion = ahora
          break
        case 'en_preparacion':
          pedidos.value[pedidoIndex].hora_preparacion = ahora
          break
        case 'listo':
          pedidos.value[pedidoIndex].hora_listo = ahora
          break
        case 'entregado':
          pedidos.value[pedidoIndex].hora_entrega = ahora
          break
      }
      
      lastUpdate.value = new Date()
      return pedidos.value[pedidoIndex]
    }
    return null
  }
  
  const actualizarEstadoItem = (itemId: string, nuevoEstado: string) => {
    // Buscar el item en todos los pedidos
    for (const pedido of pedidos.value) {
      const itemIndex = pedido.items.findIndex(i => i.id === itemId)
      if (itemIndex !== -1) {
        pedido.items[itemIndex].estado = nuevoEstado as any
        pedido.items[itemIndex].actualizado_el = new Date().toISOString()
        
        // Actualizar timestamps según el estado
        const ahora = new Date().toISOString()
        switch (nuevoEstado) {
          case 'en_preparacion':
            pedido.items[itemIndex].hora_preparacion = ahora
            break
          case 'listo':
            pedido.items[itemIndex].hora_listo = ahora
            break
          case 'servido':
            pedido.items[itemIndex].hora_servido = ahora
            break
        }
        
        lastUpdate.value = new Date()
        return pedido.items[itemIndex]
      }
    }
    return null
  }
  
  const crearPedidoDemo = (datosPedido: any) => {
    const nuevoPedido: BarPedido = {
      id: `bar-pedido-demo-${Date.now()}`,
      numero_pedido: `BAR-DEMO-${String(pedidos.value.length + 1).padStart(3, '0')}`,
      numero_mesa: datosPedido.numero_mesa,
      cliente_nombre: datosPedido.cliente_nombre || 'Cliente Demo',
      telefono_cliente: datosPedido.telefono_cliente,
      estado: 'pendiente',
      tipo_servicio: datosPedido.numero_mesa.includes('Barra') ? 'barra' : 'mesa',
      subtotal: datosPedido.subtotal || 0,
      descuentos: datosPedido.descuentos || 0,
      impuestos: datosPedido.impuestos || 0,
      propina: datosPedido.propina || 0,
      total: datosPedido.total || 0,
      notas: datosPedido.notas,
      notas_cocina: datosPedido.notas_cocina,
      tiempo_estimado: datosPedido.tiempo_estimado,
      comensales: datosPedido.comensales || 2,
      hora_pedido: new Date().toISOString(),
      creado_el: new Date().toISOString(),
      actualizado_el: new Date().toISOString(),
      items: datosPedido.items || []
    }
    
    pedidos.value.unshift(nuevoPedido)
    
    // Marcar mesa como ocupada si está libre
    const mesa = mesas.value.find(m => m.numero === datosPedido.numero_mesa)
    if (mesa && mesa.estado === 'libre') {
      actualizarEstadoMesa(mesa.id, 'ocupada')
    }
    
    lastUpdate.value = new Date()
    return nuevoPedido
  }
  
  // Acciones para mesas
  const actualizarEstadoMesa = (mesaId: string, nuevoEstado: string) => {
    const mesaIndex = mesas.value.findIndex(m => m.id === mesaId)
    if (mesaIndex !== -1) {
      mesas.value[mesaIndex].estado = nuevoEstado as any
      
      // Actualizar timestamps y métricas según el estado
      if (nuevoEstado === 'ocupada') {
        mesas.value[mesaIndex].hora_ocupacion = new Date().toISOString()
      } else if (nuevoEstado === 'libre') {
        mesas.value[mesaIndex].hora_ocupacion = undefined
        // Simular incremento de servicios completados
        mesas.value[mesaIndex].servicios_completados_hoy += 1
        mesas.value[mesaIndex].servicios_hoy += 1
        // Simular ingresos adicionales (menores que restaurante)
        mesas.value[mesaIndex].ingresos_hoy += Math.random() * 30 + 15
      }
      
      lastUpdate.value = new Date()
      return mesas.value[mesaIndex]
    }
    return null
  }
  
  // Acciones para menú
  const actualizarDisponibilidadPlato = (platoId: string, disponible: boolean) => {
    const platoIndex = platos.value.findIndex(p => p.id === platoId)
    if (platoIndex !== -1) {
      platos.value[platoIndex].esta_disponible = disponible
      platos.value[platoIndex].actualizado_el = new Date().toISOString()
      
      // Actualizar también en la categoría
      const categoria = categorias.value.find(c => c.id === platos.value[platoIndex].categoria_id)
      if (categoria) {
        const platoEnCategoriaIndex = categoria.platos.findIndex(p => p.id === platoId)
        if (platoEnCategoriaIndex !== -1) {
          categoria.platos[platoEnCategoriaIndex] = platos.value[platoIndex]
        }
      }
      
      lastUpdate.value = new Date()
      return platos.value[platoIndex]
    }
    return null
  }
  
  // Funciones de datos para dashboard
  const getDashboardData = () => {
    return {
      pedidos_hoy: analytics.value.dashboard.pedidos_hoy,
      ventas_hoy: analytics.value.dashboard.ventas_hoy,
      ticket_promedio: analytics.value.dashboard.ticket_promedio,
      empleados_activos: analytics.value.dashboard.empleados_activos,
      mesas_ocupadas: mesasOcupadas.value,
      tiempo_promedio_preparacion: analytics.value.dashboard.tiempo_promedio_preparacion,
      platos_mas_vendidos: analytics.value.dashboard.platos_mas_vendidos,
      ventas_ultimos_7_dias: analytics.value.dashboard.ventas_ultimos_7_dias,
      estado_pedidos: estadoPedidos.value
    }
  }
  
  const getMenuData = () => {
    return obtenerMenuCompletoBar()
  }
  
  // Función para resetear la demo
  const resetearDemo = () => {
    pedidos.value = [...barPedidos]
    mesas.value = [...barMesas]
    categorias.value = [...barCategorias]
    platos.value = [...barPlatos]
    analytics.value = barAnalytics
    lastUpdate.value = new Date()
  }
  
  return {
    // Estado
    pedidos,
    mesas,
    categorias,
    platos,
    analytics,
    isDemoMode,
    lastUpdate,
    simulateRealTime,
    
    // Computed - Pedidos
    pedidosActivos,
    estadoPedidos,
    itemsPendientes,
    
    // Computed - Mesas
    mesasOcupadas,
    mesasLibres,
    mesasReservadas,
    totalMesas,
    porcentajeOcupacion,
    ingresosDelDia,
    rotacionDelDia,
    
    // Computed - Menú
    categoriasActivas,
    platosDisponibles,
    
    // Acciones - Pedidos
    actualizarEstadoPedido,
    actualizarEstadoItem,
    crearPedidoDemo,
    
    // Acciones - Mesas
    actualizarEstadoMesa,
    
    // Acciones - Menú
    actualizarDisponibilidadPlato,
    
    // Funciones de datos
    getDashboardData,
    getMenuData,
    
    // Utilidades
    calcularTiempoTranscurrido,
    resetearDemo
  }
})