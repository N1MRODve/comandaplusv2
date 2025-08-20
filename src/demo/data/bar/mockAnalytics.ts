export interface BarAnalytics {
  // Métricas generales
  ventas_hoy: number
  ventas_ayer: number
  ventas_semana: number
  ventas_mes: number
  pedidos_hoy: number
  pedidos_ayer: number
  pedidos_semana: number
  pedidos_mes: number
  ticket_medio_hoy: number
  ticket_medio_mes: number
  clientes_nuevos_mes: number
  tiempo_preparacion_medio: number
  
  // Ventas por día (últimos 30 días)
  ventas_por_dia: Array<{
    fecha: string
    total_ventas: number
    numero_pedidos: number
    ticket_medio: number
  }>
  
  // Productos más vendidos (específicos de bar)
  platos_populares: Array<{
    plato_id: string
    nombre_plato: string
    categoria: string
    cantidad_vendida: number
    ingresos_totales: number
    porcentaje_total: number
  }>
  
  // Análisis por horas (horario nocturno)
  analisis_horario: Array<{
    hora: number
    pedidos: number
    ventas: number
    porcentaje_dia: number
  }>
  
  // Rendimiento de empleados (bartenders)
  rendimiento_empleados: Array<{
    empleado_id: string
    nombre_empleado: string
    pedidos_atendidos: number
    ventas_generadas: number
    horas_trabajadas: number
    ventas_por_hora: number
  }>
  
  // Comparativa de períodos
  comparativa_periodos: {
    ventas_actuales: number
    ventas_anteriores: number
    pedidos_actuales: number
    pedidos_anteriores: number
    crecimiento_ventas: number
    crecimiento_pedidos: number
    mejores_dias: string[]
    peores_dias: string[]
  }
  
  // Dashboard data específico para bar
  dashboard: {
    pedidos_hoy: number
    ventas_hoy: number
    ticket_promedio: number
    empleados_activos: number
    mesas_ocupadas: number
    tiempo_promedio_preparacion: number
    platos_mas_vendidos: Array<{
      id: string
      nombre: string
      cantidad: number
      ingresos: number
    }>
    ventas_ultimos_7_dias: Array<{
      fecha: string
      ventas: number
      pedidos: number
    }>
    estado_pedidos: {
      pendientes: number
      en_preparacion: number
      listos: number
    }
  }
}

// Función para generar fechas de los últimos N días
const generarFechasUltimosDias = (dias: number): string[] => {
  const fechas: string[] = []
  for (let i = dias - 1; i >= 0; i--) {
    const fecha = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    fechas.push(fecha.toISOString().split('T')[0])
  }
  return fechas
}

// Función para generar datos de ventas realistas para bar (horario nocturno)
const generarVentasPorDiaBar = () => {
  const fechas = generarFechasUltimosDias(30)
  return fechas.map((fecha, index) => {
    // Simular variación realista de ventas de bar
    const esFinde = new Date(fecha).getDay() === 0 || new Date(fecha).getDay() === 6
    const esViernes = new Date(fecha).getDay() === 5
    
    let baseVentas = 400 // Base más baja que restaurante
    if (esFinde) baseVentas = 800 // Fines de semana muy fuertes
    if (esViernes) baseVentas = 650 // Viernes también fuerte
    
    const variacion = Math.random() * 300 - 150 // ±150€
    const ventas = Math.max(150, baseVentas + variacion)
    
    let basePedidos = 20
    if (esFinde) basePedidos = 45
    if (esViernes) basePedidos = 35
    
    const variacionPedidos = Math.random() * 15 - 7 // ±7 pedidos
    const pedidos = Math.max(8, Math.round(basePedidos + variacionPedidos))
    
    return {
      fecha,
      total_ventas: Math.round(ventas * 100) / 100,
      numero_pedidos: pedidos,
      ticket_medio: Math.round((ventas / pedidos) * 100) / 100
    }
  })
}

// Función para generar análisis horario realista para bar (enfoque nocturno)
const generarAnalisisHorarioBar = () => {
  const horas = Array.from({ length: 24 }, (_, i) => i)
  const totalPedidosDelDia = 35
  
  return horas.map(hora => {
    let pedidos = 0
    let ventas = 0
    
    // Simular patrones realistas de un bar
    if (hora >= 17 && hora <= 20) {
      // After work / Aperitivo
      pedidos = Math.round(Math.random() * 6 + 4) // 4-10 pedidos
      ventas = pedidos * (Math.random() * 8 + 15) // 15-23€ por pedido
    } else if (hora >= 21 && hora <= 24) {
      // Horario nocturno principal
      pedidos = Math.round(Math.random() * 10 + 8) // 8-18 pedidos
      ventas = pedidos * (Math.random() * 12 + 18) // 18-30€ por pedido
    } else if (hora >= 1 && hora <= 3) {
      // Madrugada
      pedidos = Math.round(Math.random() * 5 + 2) // 2-7 pedidos
      ventas = pedidos * (Math.random() * 10 + 20) // 20-30€ por pedido
    } else if (hora >= 12 && hora <= 16) {
      // Comida (limitada en bar)
      pedidos = Math.round(Math.random() * 3 + 1) // 1-4 pedidos
      ventas = pedidos * (Math.random() * 8 + 12) // 12-20€ por pedido
    }
    
    const porcentaje_dia = totalPedidosDelDia > 0 ? (pedidos / totalPedidosDelDia) * 100 : 0
    
    return {
      hora,
      pedidos,
      ventas: Math.round(ventas * 100) / 100,
      porcentaje_dia: Math.round(porcentaje_dia * 100) / 100
    }
  })
}

export const barAnalytics: BarAnalytics = {
  // Métricas generales (adaptadas a bar)
  ventas_hoy: 987.60,
  ventas_ayer: 1156.80,
  ventas_semana: 6234.50,
  ventas_mes: 22456.70,
  pedidos_hoy: 35,
  pedidos_ayer: 42,
  pedidos_semana: 245,
  pedidos_mes: 956,
  ticket_medio_hoy: 28.22,
  ticket_medio_mes: 23.48,
  clientes_nuevos_mes: 67,
  tiempo_preparacion_medio: 4.2, // Más rápido que restaurante
  
  // Ventas por día
  ventas_por_dia: generarVentasPorDiaBar(),
  
  // Productos más vendidos (específicos de bar)
  platos_populares: [
    {
      plato_id: 'bar-001',
      nombre_plato: 'Gin Tonic Premium',
      categoria: 'Cócteles de Autor',
      cantidad_vendida: 89,
      ingresos_totales: 1112.50,
      porcentaje_total: 22.3
    },
    {
      plato_id: 'bar-007',
      nombre_plato: 'Cerveza Rubia de Barril',
      categoria: 'Cervezas y Sidras',
      cantidad_vendida: 156,
      ingresos_totales: 499.20,
      porcentaje_total: 18.7
    },
    {
      plato_id: 'bar-004',
      nombre_plato: 'Mojito Cubano',
      categoria: 'Clásicos',
      cantidad_vendida: 67,
      ingresos_totales: 636.50,
      porcentaje_total: 12.8
    },
    {
      plato_id: 'bar-010',
      nombre_plato: 'Patatas Bravas',
      categoria: 'Tapas para Picar',
      cantidad_vendida: 78,
      ingresos_totales: 507.00,
      porcentaje_total: 10.2
    },
    {
      plato_id: 'bar-008',
      nombre_plato: 'Vermut Rojo de la Casa',
      categoria: 'Vinos y Vermuts',
      cantidad_vendida: 54,
      ingresos_totales: 297.00,
      porcentaje_total: 8.9
    }
  ],
  
  // Análisis horario (enfoque nocturno)
  analisis_horario: generarAnalisisHorarioBar(),
  
  // Rendimiento de empleados (bartenders y camareros)
  rendimiento_empleados: [
    {
      empleado_id: 'bar-emp-001',
      nombre_empleado: 'Alex Rodríguez',
      pedidos_atendidos: 134,
      ventas_generadas: 3567.80,
      horas_trabajadas: 156,
      ventas_por_hora: 22.87
    },
    {
      empleado_id: 'bar-emp-002',
      nombre_empleado: 'Sofia Martín',
      pedidos_atendidos: 98,
      ventas_generadas: 2834.50,
      horas_trabajadas: 128,
      ventas_por_hora: 22.14
    },
    {
      empleado_id: 'bar-emp-003',
      nombre_empleado: 'Carlos Vega',
      pedidos_atendidos: 87,
      ventas_generadas: 2156.30,
      horas_trabajadas: 104,
      ventas_por_hora: 20.73
    }
  ],
  
  // Comparativa de períodos
  comparativa_periodos: {
    ventas_actuales: 22456.70,
    ventas_anteriores: 20234.50,
    pedidos_actuales: 956,
    pedidos_anteriores: 889,
    crecimiento_ventas: 10.98,
    crecimiento_pedidos: 7.54,
    mejores_dias: ['2025-01-11', '2025-01-04', '2025-01-18'], // Viernes y sábados
    peores_dias: ['2025-01-07', '2025-01-14', '2025-01-21'] // Martes
  },
  
  // Dashboard data específico para bar
  dashboard: {
    pedidos_hoy: 35,
    ventas_hoy: 987.60,
    ticket_promedio: 28.22,
    empleados_activos: 6,
    mesas_ocupadas: 4,
    tiempo_promedio_preparacion: 4.2,
    platos_mas_vendidos: [
      { id: 'bar-001', nombre: 'Gin Tonic Premium', cantidad: 12, ingresos: 150.00 },
      { id: 'bar-007', nombre: 'Cerveza Rubia', cantidad: 18, ingresos: 57.60 },
      { id: 'bar-004', nombre: 'Mojito Cubano', cantidad: 8, ingresos: 76.00 },
      { id: 'bar-010', nombre: 'Patatas Bravas', cantidad: 6, ingresos: 39.00 },
      { id: 'bar-008', nombre: 'Vermut Rojo', cantidad: 7, ingresos: 38.50 }
    ],
    ventas_ultimos_7_dias: [
      { fecha: '2025-01-09', ventas: 1156.80, pedidos: 42 },
      { fecha: '2025-01-10', ventas: 756.30, pedidos: 28 },
      { fecha: '2025-01-11', ventas: 1434.20, pedidos: 52 }, // Viernes
      { fecha: '2025-01-12', ventas: 1678.90, pedidos: 61 }, // Sábado
      { fecha: '2025-01-13', ventas: 834.70, pedidos: 31 },
      { fecha: '2025-01-14', ventas: 567.40, pedidos: 22 }, // Martes (día flojo)
      { fecha: '2025-01-15', ventas: 987.60, pedidos: 35 }
    ],
    estado_pedidos: {
      pendientes: 2,
      en_preparacion: 4,
      listos: 3
    }
  }
}

export default barAnalytics