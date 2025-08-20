export interface MockAnalytics {
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
  
  // Productos más vendidos
  platos_populares: Array<{
    plato_id: string
    nombre_plato: string
    categoria: string
    cantidad_vendida: number
    ingresos_totales: number
    porcentaje_total: number
  }>
  
  // Análisis por horas
  analisis_horario: Array<{
    hora: number
    pedidos: number
    ventas: number
    porcentaje_dia: number
  }>
  
  // Rendimiento de empleados
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
  
  // Dashboard data
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

// Función para generar datos de ventas realistas
const generarVentasPorDia = () => {
  const fechas = generarFechasUltimosDias(30)
  return fechas.map((fecha, index) => {
    // Simular variación realista de ventas
    const esFinde = new Date(fecha).getDay() === 0 || new Date(fecha).getDay() === 6
    const baseVentas = esFinde ? 800 : 600
    const variacion = Math.random() * 400 - 200 // ±200€
    const ventas = Math.max(200, baseVentas + variacion)
    
    const basePedidos = esFinde ? 35 : 25
    const variacionPedidos = Math.random() * 20 - 10 // ±10 pedidos
    const pedidos = Math.max(10, Math.round(basePedidos + variacionPedidos))
    
    return {
      fecha,
      total_ventas: Math.round(ventas * 100) / 100,
      numero_pedidos: pedidos,
      ticket_medio: Math.round((ventas / pedidos) * 100) / 100
    }
  })
}

// Función para generar análisis horario realista
const generarAnalisisHorario = () => {
  const horas = Array.from({ length: 24 }, (_, i) => i)
  const totalPedidosDelDia = 45
  
  return horas.map(hora => {
    let pedidos = 0
    let ventas = 0
    
    // Simular patrones realistas de un restaurante
    if (hora >= 12 && hora <= 16) {
      // Hora de comida
      pedidos = Math.round(Math.random() * 8 + 5) // 5-13 pedidos
      ventas = pedidos * (Math.random() * 10 + 20) // 20-30€ por pedido
    } else if (hora >= 20 && hora <= 23) {
      // Hora de cena
      pedidos = Math.round(Math.random() * 12 + 8) // 8-20 pedidos
      ventas = pedidos * (Math.random() * 15 + 25) // 25-40€ por pedido
    } else if (hora >= 8 && hora <= 11) {
      // Desayuno/café
      pedidos = Math.round(Math.random() * 4 + 1) // 1-5 pedidos
      ventas = pedidos * (Math.random() * 5 + 8) // 8-13€ por pedido
    } else if (hora >= 17 && hora <= 19) {
      // Aperitivo
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

export const mockAnalytics: MockAnalytics = {
  // Métricas generales
  ventas_hoy: 1247.80,
  ventas_ayer: 1156.30,
  ventas_semana: 7834.50,
  ventas_mes: 28456.70,
  pedidos_hoy: 45,
  pedidos_ayer: 42,
  pedidos_semana: 298,
  pedidos_mes: 1156,
  ticket_medio_hoy: 27.73,
  ticket_medio_mes: 24.61,
  clientes_nuevos_mes: 89,
  tiempo_preparacion_medio: 16.5,
  
  // Ventas por día
  ventas_por_dia: generarVentasPorDia(),
  
  // Productos más vendidos
  platos_populares: [
    {
      plato_id: 'plato-001',
      nombre_plato: 'Paella Valenciana',
      categoria: 'Entrantes',
      cantidad_vendida: 156,
      ingresos_totales: 2886.00,
      porcentaje_total: 18.5
    },
    {
      plato_id: 'plato-005',
      nombre_plato: 'Hamburguesa Gourmet',
      categoria: 'Platos Principales',
      cantidad_vendida: 134,
      ingresos_totales: 1943.00,
      porcentaje_total: 12.4
    },
    {
      plato_id: 'plato-015',
      nombre_plato: 'Sangría de la Casa',
      categoria: 'Bebidas',
      cantidad_vendida: 98,
      ingresos_totales: 1176.00,
      porcentaje_total: 7.5
    },
    {
      plato_id: 'plato-006',
      nombre_plato: 'Pulpo a la Gallega',
      categoria: 'Platos Principales',
      cantidad_vendida: 87,
      ingresos_totales: 1374.60,
      porcentaje_total: 8.8
    },
    {
      plato_id: 'plato-004',
      nombre_plato: 'Croquetas de Jamón',
      categoria: 'Entrantes',
      cantidad_vendida: 76,
      ingresos_totales: 676.40,
      porcentaje_total: 4.3
    },
    {
      plato_id: 'plato-009',
      nombre_plato: 'Tarta de Queso',
      categoria: 'Postres',
      cantidad_vendida: 65,
      ingresos_totales: 422.50,
      porcentaje_total: 2.7
    },
    {
      plato_id: 'plato-013',
      nombre_plato: 'Vino Tinto Crianza',
      categoria: 'Bebidas',
      cantidad_vendida: 54,
      ingresos_totales: 972.00,
      porcentaje_total: 6.2
    },
    {
      plato_id: 'plato-007',
      nombre_plato: 'Salmón a la Plancha',
      categoria: 'Platos Principales',
      cantidad_vendida: 43,
      ingresos_totales: 726.70,
      porcentaje_total: 4.6
    }
  ],
  
  // Análisis horario
  analisis_horario: generarAnalisisHorario(),
  
  // Rendimiento de empleados
  rendimiento_empleados: [
    {
      empleado_id: 'emp-001',
      nombre_empleado: 'María González',
      pedidos_atendidos: 156,
      ventas_generadas: 4234.50,
      horas_trabajadas: 168,
      ventas_por_hora: 25.20
    },
    {
      empleado_id: 'emp-002',
      nombre_empleado: 'Carlos Ruiz',
      pedidos_atendidos: 134,
      ventas_generadas: 3567.80,
      horas_trabajadas: 152,
      ventas_por_hora: 23.47
    },
    {
      empleado_id: 'emp-003',
      nombre_empleado: 'Ana Martín',
      pedidos_atendidos: 98,
      ventas_generadas: 2456.30,
      horas_trabajadas: 120,
      ventas_por_hora: 20.47
    },
    {
      empleado_id: 'emp-004',
      nombre_empleado: 'Luis Fernández',
      pedidos_atendidos: 87,
      ventas_generadas: 2134.70,
      horas_trabajadas: 104,
      ventas_por_hora: 20.53
    }
  ],
  
  // Comparativa de períodos
  comparativa_periodos: {
    ventas_actuales: 28456.70,
    ventas_anteriores: 26234.50,
    pedidos_actuales: 1156,
    pedidos_anteriores: 1089,
    crecimiento_ventas: 8.47,
    crecimiento_pedidos: 6.15,
    mejores_dias: ['2025-01-12', '2025-01-05', '2025-01-19'],
    peores_dias: ['2025-01-03', '2025-01-10', '2025-01-17']
  },
  
  // Dashboard data
  dashboard: {
    pedidos_hoy: 45,
    ventas_hoy: 1247.80,
    ticket_promedio: 27.73,
    empleados_activos: 8,
    mesas_ocupadas: 6,
    tiempo_promedio_preparacion: 16.5,
    platos_mas_vendidos: [
      { id: 'plato-001', nombre: 'Paella Valenciana', cantidad: 8, ingresos: 148.00 },
      { id: 'plato-005', nombre: 'Hamburguesa Gourmet', cantidad: 6, ingresos: 87.00 },
      { id: 'plato-015', nombre: 'Sangría de la Casa', cantidad: 5, ingresos: 60.00 },
      { id: 'plato-006', nombre: 'Pulpo a la Gallega', cantidad: 4, ingresos: 63.20 },
      { id: 'plato-004', nombre: 'Croquetas de Jamón', cantidad: 4, ingresos: 35.60 }
    ],
    ventas_ultimos_7_dias: [
      { fecha: '2025-01-09', ventas: 1156.30, pedidos: 42 },
      { fecha: '2025-01-10', ventas: 987.50, pedidos: 38 },
      { fecha: '2025-01-11', ventas: 1234.80, pedidos: 47 },
      { fecha: '2025-01-12', ventas: 1456.20, pedidos: 52 },
      { fecha: '2025-01-13', ventas: 1098.70, pedidos: 41 },
      { fecha: '2025-01-14', ventas: 1345.60, pedidos: 49 },
      { fecha: '2025-01-15', ventas: 1247.80, pedidos: 45 }
    ],
    estado_pedidos: {
      pendientes: 3,
      en_preparacion: 8,
      listos: 2
    }
  }
}

// Funciones para obtener datos específicos
export const obtenerVentasUltimos7Dias = () => {
  return mockAnalytics.dashboard.ventas_ultimos_7_dias.reduce((sum, dia) => sum + dia.ventas, 0)
}

export const obtenerPedidosUltimos7Dias = () => {
  return mockAnalytics.dashboard.ventas_ultimos_7_dias.reduce((sum, dia) => sum + dia.pedidos, 0)
}

export const obtenerTicketMedioUltimos7Dias = () => {
  const ventas = obtenerVentasUltimos7Dias()
  const pedidos = obtenerPedidosUltimos7Dias()
  return pedidos > 0 ? ventas / pedidos : 0
}

export const obtenerHoraPico = () => {
  if (mockAnalytics.analisis_horario.length === 0) return null
  return mockAnalytics.analisis_horario.reduce((max, hora) => 
    hora.pedidos > max.pedidos ? hora : max
  )
}

export const obtenerMejorEmpleado = () => {
  if (mockAnalytics.rendimiento_empleados.length === 0) return null
  return mockAnalytics.rendimiento_empleados.reduce((mejor, empleado) => 
    empleado.ventas_por_hora > mejor.ventas_por_hora ? empleado : mejor
  )
}

// Función para simular exportación de datos
export const exportarDatosMock = (formato: 'csv' | 'json', tipoReporte: 'ventas' | 'platos' | 'empleados') => {
  let datos: any = []
  let filename = ''

  switch (tipoReporte) {
    case 'ventas':
      datos = mockAnalytics.ventas_por_dia
      filename = `ventas_demo_${new Date().toISOString().split('T')[0]}`
      break
    case 'platos':
      datos = mockAnalytics.platos_populares
      filename = `platos_populares_demo_${new Date().toISOString().split('T')[0]}`
      break
    case 'empleados':
      datos = mockAnalytics.rendimiento_empleados
      filename = `rendimiento_empleados_demo_${new Date().toISOString().split('T')[0]}`
      break
  }

  if (formato === 'csv') {
    // Convertir a CSV
    const headers = Object.keys(datos[0] || {})
    const csvContent = [
      headers.join(','),
      ...datos.map((row: any) => headers.map(header => row[header]).join(','))
    ].join('\n')

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  } else {
    // Descargar JSON
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

// Métricas adicionales para el salón
export const obtenerOcupacionPorHoras = () => {
  return Array.from({ length: 24 }, (_, hora) => {
    let porcentaje = 0
    let mesas_ocupadas = 0
    
    // Simular patrones de ocupación realistas
    if (hora >= 12 && hora <= 16) {
      // Hora de comida
      porcentaje = Math.random() * 40 + 40 // 40-80%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 20 && hora <= 23) {
      // Hora de cena
      porcentaje = Math.random() * 30 + 60 // 60-90%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 8 && hora <= 11) {
      // Desayuno
      porcentaje = Math.random() * 20 + 10 // 10-30%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 17 && hora <= 19) {
      // Aperitivo
      porcentaje = Math.random() * 25 + 25 // 25-50%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    }
    
    return {
      hora,
      porcentaje: Math.round(porcentaje),
      mesas_ocupadas
    }
  })
}

export const obtenerTiemposPorCapacidad = () => {
  return [
    {
      personas: 2,
      tiempo_promedio: 38,
      servicios_completados: 24,
      rotacion_dia: 4.8
    },
    {
      personas: 4,
      tiempo_promedio: 52,
      servicios_completados: 18,
      rotacion_dia: 3.6
    },
    {
      personas: 6,
      tiempo_promedio: 68,
      servicios_completados: 8,
      rotacion_dia: 2.7
    },
    {
      personas: 8,
      tiempo_promedio: 85,
      servicios_completados: 3,
      rotacion_dia: 1.5
    }
  ]
}

export const obtenerMetricasTiempo = () => {
  return {
    tiempo_promedio_global: 48,
    tiempo_maximo_hoy: 95,
    tiempo_minimo_hoy: 25,
    rotacion_promedio: 3.2,
    eficiencia_salon: 78.5
  }
}

export default mockAnalytics

// Métricas adicionales para el salón
export const obtenerOcupacionPorHoras = () => {
  return Array.from({ length: 24 }, (_, hora) => {
    let porcentaje = 0
    let mesas_ocupadas = 0
    
    // Simular patrones de ocupación realistas
    if (hora >= 12 && hora <= 16) {
      // Hora de comida
      porcentaje = Math.random() * 40 + 40 // 40-80%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 20 && hora <= 23) {
      // Hora de cena
      porcentaje = Math.random() * 30 + 60 // 60-90%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 8 && hora <= 11) {
      // Desayuno
      porcentaje = Math.random() * 20 + 10 // 10-30%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 17 && hora <= 19) {
      // Aperitivo
      porcentaje = Math.random() * 25 + 25 // 25-50%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    }
    
    return {
      hora,
      porcentaje: Math.round(porcentaje),
      mesas_ocupadas
    }
  })
}

export const obtenerTiemposPorCapacidad = () => {
  return [
    {
      personas: 2,
      tiempo_promedio: 38,
      servicios_completados: 24,
      rotacion_dia: 4.8
    },
    {
      personas: 4,
      tiempo_promedio: 52,
      servicios_completados: 18,
      rotacion_dia: 3.6
    },
    {
      personas: 6,
      tiempo_promedio: 68,
      servicios_completados: 8,
      rotacion_dia: 2.7
    },
    {
      personas: 8,
      tiempo_promedio: 85,
      servicios_completados: 3,
      rotacion_dia: 1.5
    }
  ]
}

export const obtenerMetricasTiempo = () => {
  return {
    tiempo_promedio_global: 48,
    tiempo_maximo_hoy: 95,
    tiempo_minimo_hoy: 25,
    rotacion_promedio: 3.2,
    eficiencia_salon: 78.5
  }
}

// Métricas adicionales para el salón
export const obtenerOcupacionPorHoras = () => {
  return Array.from({ length: 24 }, (_, hora) => {
    let porcentaje = 0
    let mesas_ocupadas = 0
    
    // Simular patrones de ocupación realistas
    if (hora >= 12 && hora <= 16) {
      // Hora de comida
      porcentaje = Math.random() * 40 + 40 // 40-80%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 20 && hora <= 23) {
      // Hora de cena
      porcentaje = Math.random() * 30 + 60 // 60-90%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 8 && hora <= 11) {
      // Desayuno
      porcentaje = Math.random() * 20 + 10 // 10-30%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    } else if (hora >= 17 && hora <= 19) {
      // Aperitivo
      porcentaje = Math.random() * 25 + 25 // 25-50%
      mesas_ocupadas = Math.round((porcentaje / 100) * 15)
    }
    
    return {
      hora,
      porcentaje: Math.round(porcentaje),
      mesas_ocupadas
    }
  })
}

export const obtenerTiemposPorCapacidad = () => {
  return [
    {
      personas: 2,
      tiempo_promedio: 38,
      servicios_completados: 24,
      rotacion_dia: 4.8
    },
    {
      personas: 4,
      tiempo_promedio: 52,
      servicios_completados: 18,
      rotacion_dia: 3.6
    },
    {
      personas: 6,
      tiempo_promedio: 68,
      servicios_completados: 8,
      rotacion_dia: 2.7
    },
    {
      personas: 8,
      tiempo_promedio: 85,
      servicios_completados: 3,
      rotacion_dia: 1.5
    }
  ]
}

export const obtenerMetricasTiempo = () => {
  return {
    tiempo_promedio_global: 48,
    tiempo_maximo_hoy: 95,
    tiempo_minimo_hoy: 25,
    rotacion_promedio: 3.2,
    eficiencia_salon: 78.5
  }
}