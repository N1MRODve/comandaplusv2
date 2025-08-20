export interface MockMesa {
  id: string
  numero: string
  capacidad: number
  ubicacion: string
  estado: 'libre' | 'ocupada' | 'reservada' | 'fuera_servicio'
  codigo_qr?: string
  notas?: string
  esta_activa: boolean
  hora_ocupacion?: string
  servicios_completados_hoy: number
  posicion_x: number
  posicion_y: number
  ancho: number
  alto: number
  forma: 'cuadrada' | 'rectangular' | 'redonda' | 'barra'
  mesa_unida?: string
  mesas_conectadas?: string[]
  capacidad_total_grupo?: number
  // Métricas del día
  ingresos_hoy: number
  servicios_hoy: number
  tiempo_promedio_hoy: number
  // Información de reserva (si aplica)
  nombre_reserva?: string
  hora_reserva?: string
  // Información de limpieza
  tiempo_limpieza?: number
  // Historial reciente
  historial_reciente: Array<{
    id: string
    fecha: string
    descripcion: string
  }>
}

export const mockMesas: MockMesa[] = [
  {
    id: 'mesa-001',
    numero: '1',
    capacidad: 4,
    ubicacion: 'interior',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Ocupada hace 15 min
    servicios_completados_hoy: 3,
    posicion_x: 100,
    posicion_y: 100,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 127.50,
    servicios_hoy: 3,
    tiempo_promedio_hoy: 45,
    historial_reciente: [
      {
        id: 'hist-001',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Servicio completado'
      },
      {
        id: 'hist-002',
        fecha: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa ocupada - 2 comensales'
      }
    ]
  },
  {
    id: 'mesa-002',
    numero: '2',
    capacidad: 2,
    ubicacion: 'interior',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 4,
    posicion_x: 200,
    posicion_y: 100,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 89.30,
    servicios_hoy: 4,
    tiempo_promedio_hoy: 38,
    historial_reciente: [
      {
        id: 'hist-003',
        fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Cliente satisfecho'
      }
    ]
  },
  {
    id: 'mesa-003',
    numero: '3',
    capacidad: 6,
    ubicacion: 'interior',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // Ocupada hace 25 min
    servicios_completados_hoy: 2,
    posicion_x: 300,
    posicion_y: 100,
    ancho: 120,
    alto: 80,
    forma: 'rectangular',
    ingresos_hoy: 156.80,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 52,
    historial_reciente: [
      {
        id: 'hist-004',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Grupo familiar'
      }
    ]
  },
  {
    id: 'mesa-004',
    numero: '4',
    capacidad: 4,
    ubicacion: 'terraza',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 2,
    posicion_x: 100,
    posicion_y: 200,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 67.20,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 41,
    historial_reciente: []
  },
  {
    id: 'mesa-005',
    numero: '5',
    capacidad: 2,
    ubicacion: 'interior',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // Ocupada hace 3 min
    servicios_completados_hoy: 5,
    posicion_x: 200,
    posicion_y: 200,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 98.75,
    servicios_hoy: 5,
    tiempo_promedio_hoy: 35,
    historial_reciente: [
      {
        id: 'hist-005',
        fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Servicio rápido'
      }
    ]
  },
  {
    id: 'mesa-006',
    numero: '6',
    capacidad: 8,
    ubicacion: 'interior',
    estado: 'reservada',
    esta_activa: true,
    servicios_completados_hoy: 1,
    posicion_x: 300,
    posicion_y: 200,
    ancho: 120,
    alto: 120,
    forma: 'redonda',
    nombre_reserva: 'Familia López',
    hora_reserva: '21:00',
    ingresos_hoy: 234.50,
    servicios_hoy: 1,
    tiempo_promedio_hoy: 75,
    historial_reciente: [
      {
        id: 'hist-006',
        fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Reserva confirmada para las 21:00'
      }
    ]
  },
  {
    id: 'mesa-007',
    numero: '7',
    capacidad: 4,
    ubicacion: 'interior',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // Ocupada hace 8 min
    servicios_completados_hoy: 3,
    posicion_x: 100,
    posicion_y: 300,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 112.40,
    servicios_hoy: 3,
    tiempo_promedio_hoy: 42,
    historial_reciente: []
  },
  {
    id: 'mesa-008',
    numero: '8',
    capacidad: 2,
    ubicacion: 'barra',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 6,
    posicion_x: 200,
    posicion_y: 300,
    ancho: 60,
    alto: 120,
    forma: 'barra',
    ingresos_hoy: 78.90,
    servicios_hoy: 6,
    tiempo_promedio_hoy: 25,
    historial_reciente: [
      {
        id: 'hist-007',
        fecha: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Cliente de barra'
      }
    ]
  },
  {
    id: 'mesa-009',
    numero: '9',
    capacidad: 4,
    ubicacion: 'terraza',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // Ocupada hace 45 min
    servicios_completados_hoy: 2,
    posicion_x: 300,
    posicion_y: 300,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 145.60,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 58,
    historial_reciente: []
  },
  {
    id: 'mesa-010',
    numero: '10',
    capacidad: 6,
    ubicacion: 'interior',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 1,
    posicion_x: 100,
    posicion_y: 400,
    ancho: 120,
    alto: 80,
    forma: 'rectangular',
    ingresos_hoy: 187.30,
    servicios_hoy: 1,
    tiempo_promedio_hoy: 68,
    historial_reciente: [
      {
        id: 'hist-008',
        fecha: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Evento empresarial'
      }
    ]
  },
  {
    id: 'mesa-011',
    numero: '11',
    capacidad: 2,
    ubicacion: 'ventana',
    estado: 'fuera_servicio',
    esta_activa: true,
    servicios_completados_hoy: 0,
    posicion_x: 200,
    posicion_y: 400,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    tiempo_limpieza: 15,
    ingresos_hoy: 0,
    servicios_hoy: 0,
    tiempo_promedio_hoy: 0,
    notas: 'Limpieza profunda después del incidente',
    historial_reciente: [
      {
        id: 'hist-009',
        fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa puesta fuera de servicio - Limpieza'
      }
    ]
  },
  {
    id: 'mesa-012',
    numero: '12',
    capacidad: 4,
    ubicacion: 'interior',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // Ocupada hace 35 min
    servicios_completados_hoy: 2,
    posicion_x: 300,
    posicion_y: 400,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 134.20,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 48,
    historial_reciente: []
  },
  {
    id: 'mesa-013',
    numero: '13',
    capacidad: 10,
    ubicacion: 'interior',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 1,
    posicion_x: 150,
    posicion_y: 500,
    ancho: 140,
    alto: 140,
    forma: 'redonda',
    ingresos_hoy: 298.40,
    servicios_hoy: 1,
    tiempo_promedio_hoy: 85,
    historial_reciente: [
      {
        id: 'hist-010',
        fecha: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Evento familiar grande'
      }
    ]
  },
  {
    id: 'mesa-014',
    numero: '14',
    capacidad: 2,
    ubicacion: 'terraza',
    estado: 'reservada',
    esta_activa: true,
    servicios_completados_hoy: 2,
    posicion_x: 350,
    posicion_y: 500,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    nombre_reserva: 'Cena romántica - Pedro y Laura',
    hora_reserva: '20:30',
    ingresos_hoy: 76.80,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 55,
    historial_reciente: [
      {
        id: 'hist-011',
        fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        descripcion: 'Reserva confirmada para las 20:30'
      }
    ]
  },
  {
    id: 'mesa-015',
    numero: '15',
    capacidad: 6,
    ubicacion: 'vip',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 1,
    posicion_x: 450,
    posicion_y: 200,
    ancho: 120,
    alto: 100,
    forma: 'rectangular',
    ingresos_hoy: 345.70,
    servicios_hoy: 1,
    tiempo_promedio_hoy: 95,
    notas: 'Mesa VIP con servicio premium',
    historial_reciente: [
      {
        id: 'hist-012',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Mesa liberada - Cliente VIP satisfecho'
      }
    ]
  }
]

// Funciones para simular operaciones
export const actualizarEstadoMesaMock = (mesaId: string, nuevoEstado: string): MockMesa | null => {
  const mesa = mockMesas.find(m => m.id === mesaId)
  if (mesa) {
    mesa.estado = nuevoEstado as any
    
    // Actualizar timestamps según el estado
    if (nuevoEstado === 'ocupada') {
      mesa.hora_ocupacion = new Date().toISOString()
    } else if (nuevoEstado === 'libre') {
      mesa.hora_ocupacion = undefined
      // Simular incremento de servicios completados
      mesa.servicios_completados_hoy += 1
      mesa.servicios_hoy += 1
      // Agregar al historial
      mesa.historial_reciente.unshift({
        id: `hist-${Date.now()}`,
        fecha: new Date().toISOString(),
        descripcion: 'Mesa liberada - Servicio completado'
      })
    } else if (nuevoEstado === 'fuera_servicio') {
      mesa.tiempo_limpieza = 15
      mesa.hora_ocupacion = undefined
    }
    
    return mesa
  }
  return null
}

export const obtenerMesasPorEstado = (estado: string): MockMesa[] => {
  return mockMesas.filter(mesa => mesa.estado === estado)
}

export const obtenerMesasOcupadas = (): MockMesa[] => {
  return mockMesas.filter(mesa => mesa.estado === 'ocupada')
}

export const obtenerMesasLibres = (): MockMesa[] => {
  return mockMesas.filter(mesa => mesa.estado === 'libre')
}

export const calcularOcupacionTotal = (): { ocupadas: number; total: number; porcentaje: number } => {
  const total = mockMesas.filter(mesa => mesa.esta_activa).length
  const ocupadas = mockMesas.filter(mesa => mesa.estado === 'ocupada').length
  const porcentaje = total > 0 ? (ocupadas / total) * 100 : 0
  
  return { ocupadas, total, porcentaje }
}

export const calcularCapacidadUtilizada = (): { utilizada: number; total: number; porcentaje: number } => {
  const capacidadTotal = mockMesas.reduce((sum, mesa) => sum + mesa.capacidad, 0)
  const capacidadOcupada = mockMesas
    .filter(mesa => mesa.estado === 'ocupada')
    .reduce((sum, mesa) => sum + mesa.capacidad, 0) // Simplificado, en realidad sería el número de comensales
  
  const porcentaje = capacidadTotal > 0 ? (capacidadOcupada / capacidadTotal) * 100 : 0
  
  return { utilizada: capacidadOcupada, total: capacidadTotal, porcentaje }
}

export const calcularIngresosDelDia = (): number => {
  return mockMesas.reduce((sum, mesa) => sum + mesa.ingresos_hoy, 0)
}

export const calcularRotacionDelDia = (): number => {
  return mockMesas.reduce((sum, mesa) => sum + mesa.servicios_completados_hoy, 0)
}

export const obtenerMesasMasRentables = (limite: number = 5): Array<{
  numero: string
  ingresos: number
  servicios: number
  tiempo_promedio: number
}> => {
  return mockMesas
    .filter(mesa => mesa.ingresos_hoy > 0)
    .sort((a, b) => b.ingresos_hoy - a.ingresos_hoy)
    .slice(0, limite)
    .map(mesa => ({
      numero: mesa.numero,
      ingresos: mesa.ingresos_hoy,
      servicios: mesa.servicios_hoy,
      tiempo_promedio: mesa.tiempo_promedio_hoy
    }))
}

export default mockMesas