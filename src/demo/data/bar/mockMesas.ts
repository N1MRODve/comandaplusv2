export interface BarMesa {
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
  // Métricas del día
  ingresos_hoy: number
  servicios_hoy: number
  tiempo_promedio_hoy: number
  // Información de reserva (si aplica)
  nombre_reserva?: string
  hora_reserva?: string
  // Historial reciente
  historial_reciente: Array<{
    id: string
    fecha: string
    descripcion: string
  }>
}

export const barMesas: BarMesa[] = [
  // ZONA DE BARRA
  {
    id: 'bar-mesa-001',
    numero: 'Barra-1',
    capacidad: 2,
    ubicacion: 'barra',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    servicios_completados_hoy: 8,
    posicion_x: 50,
    posicion_y: 50,
    ancho: 60,
    alto: 120,
    forma: 'barra',
    ingresos_hoy: 156.80,
    servicios_hoy: 8,
    tiempo_promedio_hoy: 25,
    historial_reciente: [
      {
        id: 'bar-hist-001',
        fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        descripcion: 'Cliente satisfecho - Gin Tonic perfecto'
      }
    ]
  },
  {
    id: 'bar-mesa-002',
    numero: 'Barra-2',
    capacidad: 2,
    ubicacion: 'barra',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 6,
    posicion_x: 120,
    posicion_y: 50,
    ancho: 60,
    alto: 120,
    forma: 'barra',
    ingresos_hoy: 98.40,
    servicios_hoy: 6,
    tiempo_promedio_hoy: 22,
    historial_reciente: []
  },
  {
    id: 'bar-mesa-003',
    numero: 'Barra-3',
    capacidad: 2,
    ubicacion: 'barra',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 7,
    posicion_x: 190,
    posicion_y: 50,
    ancho: 60,
    alto: 120,
    forma: 'barra',
    ingresos_hoy: 134.20,
    servicios_hoy: 7,
    tiempo_promedio_hoy: 28,
    historial_reciente: []
  },

  // MESAS BAJAS (ZONA LOUNGE)
  {
    id: 'bar-mesa-004',
    numero: '1',
    capacidad: 4,
    ubicacion: 'lounge',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 3,
    posicion_x: 100,
    posicion_y: 200,
    ancho: 90,
    alto: 90,
    forma: 'redonda',
    ingresos_hoy: 87.60,
    servicios_hoy: 3,
    tiempo_promedio_hoy: 45,
    historial_reciente: []
  },
  {
    id: 'bar-mesa-005',
    numero: '2',
    capacidad: 2,
    ubicacion: 'lounge',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 4,
    posicion_x: 220,
    posicion_y: 200,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 112.30,
    servicios_hoy: 4,
    tiempo_promedio_hoy: 38,
    historial_reciente: []
  },
  {
    id: 'bar-mesa-006',
    numero: '3',
    capacidad: 4,
    ubicacion: 'lounge',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    servicios_completados_hoy: 2,
    posicion_x: 340,
    posicion_y: 200,
    ancho: 90,
    alto: 90,
    forma: 'redonda',
    ingresos_hoy: 145.80,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 52,
    historial_reciente: []
  },

  // MESAS ALTAS (ZONA CENTRAL)
  {
    id: 'bar-mesa-007',
    numero: '4',
    capacidad: 4,
    ubicacion: 'central',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 3,
    posicion_x: 150,
    posicion_y: 350,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 167.40,
    servicios_hoy: 3,
    tiempo_promedio_hoy: 48,
    historial_reciente: []
  },
  {
    id: 'bar-mesa-008',
    numero: '5',
    capacidad: 6,
    ubicacion: 'central',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 2,
    posicion_x: 270,
    posicion_y: 350,
    ancho: 120,
    alto: 80,
    forma: 'rectangular',
    ingresos_hoy: 198.70,
    servicios_hoy: 2,
    tiempo_promedio_hoy: 65,
    historial_reciente: []
  },

  // ZONA VIP/RESERVADO
  {
    id: 'bar-mesa-009',
    numero: 'VIP-1',
    capacidad: 8,
    ubicacion: 'vip',
    estado: 'reservada',
    esta_activa: true,
    servicios_completados_hoy: 1,
    posicion_x: 400,
    posicion_y: 300,
    ancho: 140,
    alto: 120,
    forma: 'rectangular',
    nombre_reserva: 'Evento Corporativo - TechStart',
    hora_reserva: '22:00',
    ingresos_hoy: 345.60,
    servicios_hoy: 1,
    tiempo_promedio_hoy: 120,
    historial_reciente: [
      {
        id: 'bar-hist-002',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Reserva confirmada para evento corporativo'
      }
    ]
  },

  // TERRAZA
  {
    id: 'bar-mesa-010',
    numero: '6',
    capacidad: 2,
    ubicacion: 'terraza',
    estado: 'libre',
    esta_activa: true,
    servicios_completados_hoy: 5,
    posicion_x: 100,
    posicion_y: 500,
    ancho: 80,
    alto: 80,
    forma: 'cuadrada',
    ingresos_hoy: 89.30,
    servicios_hoy: 5,
    tiempo_promedio_hoy: 35,
    historial_reciente: []
  },
  {
    id: 'bar-mesa-011',
    numero: '7',
    capacidad: 4,
    ubicacion: 'terraza',
    estado: 'ocupada',
    esta_activa: true,
    hora_ocupacion: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    servicios_completados_hoy: 3,
    posicion_x: 220,
    posicion_y: 500,
    ancho: 90,
    alto: 90,
    forma: 'redonda',
    ingresos_hoy: 123.50,
    servicios_hoy: 3,
    tiempo_promedio_hoy: 42,
    historial_reciente: []
  }
]

export default barMesas