import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPedidos, actualizarEstadoPedidoMock, actualizarEstadoItemMock, obtenerItemsPorPedido, obtenerTodosLosItems } from '../data/mockPedidos'
import { mockMesas, calcularOcupacionTotal, calcularCapacidadUtilizada, calcularIngresosDelDia, calcularRotacionDelDia, obtenerMesasMasRentables } from '../data/mockMesas'
import { mockCategorias, mockPlatos, obtenerMenuCompleto, actualizarDisponibilidadPlatoMock, crearPlatoMock, actualizarPlatoMock, eliminarPlatoMock, crearCategoriaMock } from '../data/mockMenu'
import { mockAnalytics, exportarDatosMock, obtenerOcupacionPorHoras, obtenerTiemposPorCapacidad, obtenerMetricasTiempo } from '../data/mockAnalytics'
import type { MockPedido, MockItemPedido } from '../data/mockPedidos'
import type { MockMesa } from '../data/mockMesas'
import type { MockCategoria, MockPlato } from '../data/mockMenu'

export const useDemoStore = defineStore('demo', () => {
  // Estado reactivo
  const pedidos = ref<MockPedido[]>([...mockPedidos])
  const mesas = ref<MockMesa[]>([...mockMesas])
  const categorias = ref<MockCategoria[]>([...mockCategorias])
  const platos = ref<MockPlato[]>([...mockPlatos])
  const analytics = ref(mockAnalytics)
  
  // Estado de la demo
  const isDemoMode = ref(true)
  const lastUpdate = ref<Date>(new Date())
  const simulateRealTime = ref(true)
  
  // Estado para solicitudes de mesa
  const solicitudesMesa = ref<Array<{ id: number; mesa: number; tipo: 'Cuenta' | 'Atención'; timestamp: Date }>>([])
  
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
  
  const capacidadUtilizada = computed(() => {
    const total = mesas.value.reduce((sum, mesa) => sum + mesa.capacidad, 0)
    const ocupada = mesas.value
      .filter(mesa => mesa.estado === 'ocupada')
      .reduce((sum, mesa) => sum + mesa.capacidad, 0) // Simplificado
    
    return total > 0 ? (ocupada / total) * 100 : 0
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
    const nuevoPedido: MockPedido = {
      id: `pedido-demo-${Date.now()}`,
      numero_pedido: `CMD-DEMO-${String(pedidos.value.length + 1).padStart(3, '0')}`,
      numero_mesa: datosPedido.numero_mesa,
      cliente_nombre: datosPedido.cliente_nombre || 'Cliente Demo',
      telefono_cliente: datosPedido.telefono_cliente,
      estado: 'pendiente',
      tipo_servicio: 'mesa',
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
  
  // Nueva función para crear pedido con simulación de estados
  const crearPedidoConSimulacion = (datosPedido: any) => {
    const nuevoPedido = crearPedidoDemo(datosPedido)
    
    // --- SIMULACIÓN DE PROCESO DE COCINA ---
    const pedidoId = nuevoPedido.id
    
    // Cambiar a "confirmado" después de 3 segundos
    setTimeout(() => {
      const pedido = pedidos.value.find(p => p.id === pedidoId)
      if (pedido) {
        pedido.estado = 'confirmado'
        pedido.actualizado_el = new Date().toISOString()
        lastUpdate.value = new Date()
      }
    }, 3000)
    
    // Cambiar a "en_preparacion" después de 10 segundos
    setTimeout(() => {
      const pedido = pedidos.value.find(p => p.id === pedidoId)
      if (pedido) {
        pedido.estado = 'en_preparacion'
        pedido.actualizado_el = new Date().toISOString()
        lastUpdate.value = new Date()
      }
    }, 10000)
    
    // Cambiar a "listo" después de 25 segundos
    setTimeout(() => {
      const pedido = pedidos.value.find(p => p.id === pedidoId)
      if (pedido) {
        pedido.estado = 'listo'
        pedido.actualizado_el = new Date().toISOString()
        lastUpdate.value = new Date()
      }
    }, 25000)
    
    // Cambiar a "entregado" después de 35 segundos
    setTimeout(() => {
      const pedido = pedidos.value.find(p => p.id === pedidoId)
      if (pedido) {
        pedido.estado = 'entregado'
        pedido.actualizado_el = new Date().toISOString()
        lastUpdate.value = new Date()
      }
    }, 35000)
    
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
        // Simular ingresos adicionales
        mesas.value[mesaIndex].ingresos_hoy += Math.random() * 50 + 20
        // Agregar al historial
        mesas.value[mesaIndex].historial_reciente.unshift({
          id: `hist-demo-${Date.now()}`,
          fecha: new Date().toISOString(),
          descripcion: 'Mesa liberada - Servicio completado (Demo)'
        })
      } else if (nuevoEstado === 'fuera_servicio') {
        mesas.value[mesaIndex].tiempo_limpieza = 15
        mesas.value[mesaIndex].hora_ocupacion = undefined
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
  
  const crearPlato = (platoData: Partial<MockPlato>) => {
    const nuevoPlato = crearPlatoMock(platoData)
    
    // Actualizar arrays reactivos
    platos.value.push(nuevoPlato)
    
    const categoria = categorias.value.find(c => c.id === nuevoPlato.categoria_id)
    if (categoria) {
      categoria.platos.push(nuevoPlato)
    }
    
    lastUpdate.value = new Date()
    return nuevoPlato
  }
  
  const actualizarPlato = (platoId: string, updates: Partial<MockPlato>) => {
    const platoIndex = platos.value.findIndex(p => p.id === platoId)
    if (platoIndex !== -1) {
      platos.value[platoIndex] = { ...platos.value[platoIndex], ...updates, actualizado_el: new Date().toISOString() }
      
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
  
  const eliminarPlato = (platoId: string) => {
    const platoIndex = platos.value.findIndex(p => p.id === platoId)
    if (platoIndex !== -1) {
      const plato = platos.value[platoIndex]
      
      // Eliminar del array principal
      platos.value.splice(platoIndex, 1)
      
      // Eliminar de la categoría
      const categoria = categorias.value.find(c => c.id === plato.categoria_id)
      if (categoria) {
        categoria.platos = categoria.platos.filter(p => p.id !== platoId)
      }
      
      lastUpdate.value = new Date()
      return true
    }
    return false
  }
  
  const crearCategoria = (categoriaData: Partial<MockCategoria>) => {
    const nuevaCategoria = crearCategoriaMock(categoriaData)
    categorias.value.push(nuevaCategoria)
    lastUpdate.value = new Date()
    return nuevaCategoria
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
  
  const getAnalyticsData = () => {
    return {
      ventas_mes_actual: analytics.value.ventas_mes,
      crecimiento_mes_anterior: analytics.value.comparativa_periodos.crecimiento_ventas,
      clientes_mes: analytics.value.clientes_nuevos_mes,
      productos_mas_vendidos: analytics.value.platos_populares,
      horarios_pico: analytics.value.analisis_horario.filter(h => h.pedidos > 0).slice(0, 5)
    }
  }
  
  const getSalonData = () => {
    return {
      mesas: mesas.value,
      ocupacion: calcularOcupacionTotal(),
      capacidad_utilizada: calcularCapacidadUtilizada(),
      ingresos_del_dia: ingresosDelDia.value,
      rotacion_del_dia: rotacionDelDia.value,
      mesas_mas_rentables: obtenerMesasMasRentables(),
      ocupacion_por_horas: obtenerOcupacionPorHoras(),
      tiempos_por_capacidad: obtenerTiemposPorCapacidad(),
      metricas_tiempo: obtenerMetricasTiempo()
    }
  }
  
  const getMenuData = () => {
    return obtenerMenuCompleto()
  }
  
  // Simulación de tiempo real
  const startRealTimeSimulation = () => {
    if (!simulateRealTime.value) return
    
    const interval = setInterval(() => {
      if (!simulateRealTime.value) {
        clearInterval(interval)
        return
      }
      
      // Simular cambios aleatorios ocasionales
      if (Math.random() < 0.1) { // 10% de probabilidad cada 30 segundos
        simularCambioAleatorio()
      }
      
      // Actualizar tiempos transcurridos
      lastUpdate.value = new Date()
    }, 30000) // Cada 30 segundos
    
    return interval
  }
  
  const simularCambioAleatorio = () => {
    const tiposCambio = ['nuevo_pedido', 'cambio_estado_item', 'liberar_mesa']
    const tipoCambio = tiposCambio[Math.floor(Math.random() * tiposCambio.length)]
    
    switch (tipoCambio) {
      case 'nuevo_pedido':
        // Simular nuevo pedido ocasional
        if (mesasLibres.value > 0 && Math.random() < 0.3) {
          const mesaLibre = mesas.value.find(m => m.estado === 'libre')
          if (mesaLibre) {
            crearPedidoDemo({
              numero_mesa: mesaLibre.numero,
              cliente_nombre: `Cliente Demo ${Date.now()}`,
              subtotal: Math.random() * 50 + 20,
              total: Math.random() * 60 + 25,
              comensales: Math.floor(Math.random() * 4) + 1,
              items: []
            })
          }
        }
        break
        
      case 'cambio_estado_item':
        // Cambiar estado de algún item pendiente
        const itemsPendientesArray = itemsPendientes.value.filter(i => i.estado === 'pendiente')
        if (itemsPendientesArray.length > 0) {
          const itemAleatorio = itemsPendientesArray[Math.floor(Math.random() * itemsPendientesArray.length)]
          actualizarEstadoItem(itemAleatorio.id, 'en_preparacion')
        }
        break
        
      case 'liberar_mesa':
        // Liberar alguna mesa que lleve mucho tiempo ocupada
        const mesasOcupadasArray = mesas.value.filter(m => 
          m.estado === 'ocupada' && 
          m.hora_ocupacion && 
          calcularTiempoTranscurrido(m.hora_ocupacion) > 60
        )
        if (mesasOcupadasArray.length > 0) {
          const mesaAleatoria = mesasOcupadasArray[Math.floor(Math.random() * mesasOcupadasArray.length)]
          actualizarEstadoMesa(mesaAleatoria.id, 'libre')
        }
        break
    }
  }
  
  // Función para resetear la demo
  const resetearDemo = () => {
    pedidos.value = [...mockPedidos]
    mesas.value = [...mockMesas]
    categorias.value = [...mockCategorias]
    platos.value = [...mockPlatos]
    analytics.value = mockAnalytics
    lastUpdate.value = new Date()
  }
  
  // Función para exportar datos de la demo
  const exportarDatos = (formato: 'csv' | 'json', tipoReporte: 'ventas' | 'platos' | 'empleados') => {
    exportarDatosMock(formato, tipoReporte)
  }
  
  // Acciones para solicitudes de mesa
  const crearSolicitud = (tipo: 'Cuenta' | 'Atención') => {
    const nuevaSolicitud = {
      id: Date.now(), // Usamos timestamp como ID único para la demo
      mesa: 5, // Mesa de demo (coincide con la mesa mostrada en el cliente)
      tipo,
      timestamp: new Date()
    }
    solicitudesMesa.value.unshift(nuevaSolicitud)
    lastUpdate.value = new Date()
  }
  
  // Acción para que el personal resuelva una solicitud
  const resolverSolicitud = (solicitudId: number) => {
    solicitudesMesa.value = solicitudesMesa.value.filter(s => s.id !== solicitudId)
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
    solicitudesMesa,
    
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
    capacidadUtilizada,
    ingresosDelDia,
    rotacionDelDia,
    
    // Computed - Menú
    categoriasActivas,
    platosDisponibles,
    
    // Acciones - Pedidos
    actualizarEstadoPedido,
    actualizarEstadoItem,
    crearPedidoDemo,
    crearPedidoConSimulacion,
    
    // Acciones - Mesas
    actualizarEstadoMesa,
    
    // Acciones - Menú
    actualizarDisponibilidadPlato,
    crearPlato,
    actualizarPlato,
    eliminarPlato,
    crearCategoria,
    
    // Funciones de datos
    getDashboardData,
    getAnalyticsData,
    getSalonData,
    getMenuData,
    
    // Utilidades
    calcularTiempoTranscurrido,
    startRealTimeSimulation,
    resetearDemo,
    exportarDatos,
    
    // Solicitudes de mesa
    crearSolicitud,
    resolverSolicitud,
    
    // Pagos
    procesarPago
  }
})