export interface MockPedido {
  id: string
  numero_pedido: string
  numero_mesa: string
  cliente_nombre: string
  telefono_cliente?: string
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'entregado' | 'pagado' | 'cancelado'
  tipo_servicio: 'mesa' | 'barra' | 'para_llevar' | 'delivery'
  subtotal: number
  descuentos: number
  impuestos: number
  propina: number
  total: number
  notas?: string
  notas_cocina?: string
  tiempo_estimado?: number
  comensales: number
  hora_pedido: string
  hora_confirmacion?: string
  hora_preparacion?: string
  hora_listo?: string
  hora_entrega?: string
  creado_el: string
  actualizado_el: string
  items: MockItemPedido[]
}

export interface MockItemPedido {
  id: string
  pedido_id: string
  plato_id: string
  nombre_plato: string
  precio: number
  cantidad: number
  variante_seleccionada?: any
  modificaciones?: string[]
  notas?: string
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'servido' | 'cancelado'
  estacion_preparacion?: string
  prioridad: number
  tiempo_preparacion_estimado?: number
  precio_unitario: number
  descuento_aplicado: number
  subtotal: number
  hora_pedido: string
  hora_preparacion?: string
  hora_listo?: string
  hora_servido?: string
  creado_el: string
  actualizado_el: string
}

// Función helper para generar fechas realistas
const generarFechaReciente = (minutosAtras: number): string => {
  const fecha = new Date(Date.now() - minutosAtras * 60 * 1000)
  return fecha.toISOString()
}

// Items de pedido de ejemplo
const mockItems: MockItemPedido[] = [
  // Items para Pedido 1 (Mesa 3)
  {
    id: 'item-001',
    pedido_id: 'pedido-001',
    plato_id: 'plato-001',
    nombre_plato: 'Paella Valenciana',
    precio: 18.50,
    cantidad: 2,
    modificaciones: ['Sin mariscos', 'Extra pollo'],
    notas: 'Para compartir',
    estado: 'en_preparacion',
    estacion_preparacion: 'cocina',
    prioridad: 1,
    tiempo_preparacion_estimado: 25,
    precio_unitario: 18.50,
    descuento_aplicado: 0,
    subtotal: 37.00,
    hora_pedido: generarFechaReciente(25),
    hora_preparacion: generarFechaReciente(20),
    creado_el: generarFechaReciente(25),
    actualizado_el: generarFechaReciente(20)
  },
  {
    id: 'item-002',
    pedido_id: 'pedido-001',
    plato_id: 'plato-015',
    nombre_plato: 'Sangría de la Casa',
    precio: 12.00,
    cantidad: 1,
    estado: 'listo',
    estacion_preparacion: 'barra',
    prioridad: 0,
    tiempo_preparacion_estimado: 5,
    precio_unitario: 12.00,
    descuento_aplicado: 0,
    subtotal: 12.00,
    hora_pedido: generarFechaReciente(25),
    hora_preparacion: generarFechaReciente(22),
    hora_listo: generarFechaReciente(20),
    creado_el: generarFechaReciente(25),
    actualizado_el: generarFechaReciente(20)
  },
  // Items para Pedido 2 (Mesa 7)
  {
    id: 'item-003',
    pedido_id: 'pedido-002',
    plato_id: 'plato-003',
    nombre_plato: 'Ensalada César',
    precio: 9.50,
    cantidad: 1,
    estado: 'pendiente',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 10,
    precio_unitario: 9.50,
    descuento_aplicado: 0,
    subtotal: 9.50,
    hora_pedido: generarFechaReciente(8),
    creado_el: generarFechaReciente(8),
    actualizado_el: generarFechaReciente(8)
  },
  {
    id: 'item-004',
    pedido_id: 'pedido-002',
    plato_id: 'plato-007',
    nombre_plato: 'Salmón a la Plancha',
    precio: 16.90,
    cantidad: 1,
    modificaciones: ['Punto medio'],
    estado: 'pendiente',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 15,
    precio_unitario: 16.90,
    descuento_aplicado: 0,
    subtotal: 16.90,
    hora_pedido: generarFechaReciente(8),
    creado_el: generarFechaReciente(8),
    actualizado_el: generarFechaReciente(8)
  },
  // Items para Pedido 3 (Mesa 12)
  {
    id: 'item-005',
    pedido_id: 'pedido-003',
    plato_id: 'plato-005',
    nombre_plato: 'Hamburguesa Gourmet',
    precio: 14.50,
    cantidad: 2,
    modificaciones: ['Sin cebolla', 'Extra queso'],
    estado: 'listo',
    estacion_preparacion: 'cocina',
    prioridad: 2,
    tiempo_preparacion_estimado: 12,
    precio_unitario: 14.50,
    descuento_aplicado: 0,
    subtotal: 29.00,
    hora_pedido: generarFechaReciente(35),
    hora_preparacion: generarFechaReciente(30),
    hora_listo: generarFechaReciente(5),
    creado_el: generarFechaReciente(35),
    actualizado_el: generarFechaReciente(5)
  },
  {
    id: 'item-006',
    pedido_id: 'pedido-003',
    plato_id: 'plato-016',
    nombre_plato: 'Cerveza Estrella Galicia',
    precio: 3.50,
    cantidad: 2,
    estado: 'servido',
    estacion_preparacion: 'barra',
    prioridad: 0,
    tiempo_preparacion_estimado: 2,
    precio_unitario: 3.50,
    descuento_aplicado: 0,
    subtotal: 7.00,
    hora_pedido: generarFechaReciente(35),
    hora_preparacion: generarFechaReciente(33),
    hora_listo: generarFechaReciente(32),
    hora_servido: generarFechaReciente(30),
    creado_el: generarFechaReciente(35),
    actualizado_el: generarFechaReciente(30)
  },
  // Items para Pedido 4 (Mesa 5)
  {
    id: 'item-007',
    pedido_id: 'pedido-004',
    plato_id: 'plato-009',
    nombre_plato: 'Tarta de Queso',
    precio: 6.50,
    cantidad: 1,
    estado: 'pendiente',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 5,
    precio_unitario: 6.50,
    descuento_aplicado: 0,
    subtotal: 6.50,
    hora_pedido: generarFechaReciente(3),
    creado_el: generarFechaReciente(3),
    actualizado_el: generarFechaReciente(3)
  },
  {
    id: 'item-008',
    pedido_id: 'pedido-004',
    plato_id: 'plato-014',
    nombre_plato: 'Café Cortado',
    precio: 2.20,
    cantidad: 2,
    estado: 'pendiente',
    estacion_preparacion: 'barra',
    prioridad: 0,
    tiempo_preparacion_estimado: 3,
    precio_unitario: 2.20,
    descuento_aplicado: 0,
    subtotal: 4.40,
    hora_pedido: generarFechaReciente(3),
    creado_el: generarFechaReciente(3),
    actualizado_el: generarFechaReciente(3)
  },
  // Items para Pedido 5 (Mesa 1)
  {
    id: 'item-009',
    pedido_id: 'pedido-005',
    plato_id: 'plato-002',
    nombre_plato: 'Gazpacho Andaluz',
    precio: 7.50,
    cantidad: 1,
    estado: 'en_preparacion',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 8,
    precio_unitario: 7.50,
    descuento_aplicado: 0,
    subtotal: 7.50,
    hora_pedido: generarFechaReciente(15),
    hora_preparacion: generarFechaReciente(12),
    creado_el: generarFechaReciente(15),
    actualizado_el: generarFechaReciente(12)
  },
  {
    id: 'item-010',
    pedido_id: 'pedido-005',
    plato_id: 'plato-006',
    nombre_plato: 'Pulpo a la Gallega',
    precio: 15.80,
    cantidad: 1,
    estado: 'en_preparacion',
    estacion_preparacion: 'cocina',
    prioridad: 1,
    tiempo_preparacion_estimado: 18,
    precio_unitario: 15.80,
    descuento_aplicado: 0,
    subtotal: 15.80,
    hora_pedido: generarFechaReciente(15),
    hora_preparacion: generarFechaReciente(12),
    creado_el: generarFechaReciente(15),
    actualizado_el: generarFechaReciente(12)
  },
  // Items para Pedido 6 (Mesa 9)
  {
    id: 'item-011',
    pedido_id: 'pedido-006',
    plato_id: 'plato-004',
    nombre_plato: 'Croquetas de Jamón',
    precio: 8.90,
    cantidad: 1,
    estado: 'listo',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 12,
    precio_unitario: 8.90,
    descuento_aplicado: 0,
    subtotal: 8.90,
    hora_pedido: generarFechaReciente(45),
    hora_preparacion: generarFechaReciente(40),
    hora_listo: generarFechaReciente(2),
    creado_el: generarFechaReciente(45),
    actualizado_el: generarFechaReciente(2)
  },
  {
    id: 'item-012',
    pedido_id: 'pedido-006',
    plato_id: 'plato-013',
    nombre_plato: 'Vino Tinto Crianza',
    precio: 18.00,
    cantidad: 1,
    estado: 'servido',
    estacion_preparacion: 'barra',
    prioridad: 0,
    tiempo_preparacion_estimado: 2,
    precio_unitario: 18.00,
    descuento_aplicado: 0,
    subtotal: 18.00,
    hora_pedido: generarFechaReciente(45),
    hora_preparacion: generarFechaReciente(43),
    hora_listo: generarFechaReciente(42),
    hora_servido: generarFechaReciente(40),
    creado_el: generarFechaReciente(45),
    actualizado_el: generarFechaReciente(40)
  }
]

// Pedidos principales
export const mockPedidos: MockPedido[] = [
  {
    id: 'pedido-001',
    numero_pedido: 'CMD-2025-001',
    numero_mesa: '3',
    cliente_nombre: 'María García',
    telefono_cliente: '+34 612 345 678',
    estado: 'en_preparacion',
    tipo_servicio: 'mesa',
    subtotal: 49.00,
    descuentos: 0,
    impuestos: 4.90,
    propina: 5.00,
    total: 58.90,
    notas: 'Celebración de cumpleaños, por favor traer vela',
    notas_cocina: 'Sin mariscos en la paella',
    tiempo_estimado: 25,
    comensales: 4,
    hora_pedido: generarFechaReciente(25),
    hora_confirmacion: generarFechaReciente(24),
    hora_preparacion: generarFechaReciente(20),
    creado_el: generarFechaReciente(25),
    actualizado_el: generarFechaReciente(20),
    items: mockItems.filter(item => item.pedido_id === 'pedido-001')
  },
  {
    id: 'pedido-002',
    numero_pedido: 'CMD-2025-002',
    numero_mesa: '7',
    cliente_nombre: 'Carlos Rodríguez',
    telefono_cliente: '+34 687 123 456',
    estado: 'pendiente',
    tipo_servicio: 'mesa',
    subtotal: 26.40,
    descuentos: 0,
    impuestos: 2.64,
    propina: 3.00,
    total: 32.04,
    tiempo_estimado: 20,
    comensales: 2,
    hora_pedido: generarFechaReciente(8),
    creado_el: generarFechaReciente(8),
    actualizado_el: generarFechaReciente(8),
    items: mockItems.filter(item => item.pedido_id === 'pedido-002')
  },
  {
    id: 'pedido-003',
    numero_pedido: 'CMD-2025-003',
    numero_mesa: '12',
    cliente_nombre: 'Ana Martínez',
    telefono_cliente: '+34 654 987 321',
    estado: 'listo',
    tipo_servicio: 'mesa',
    subtotal: 36.00,
    descuentos: 2.00,
    impuestos: 3.40,
    propina: 4.50,
    total: 41.90,
    notas: 'Mesa junto a la ventana',
    tiempo_estimado: 15,
    comensales: 3,
    hora_pedido: generarFechaReciente(35),
    hora_confirmacion: generarFechaReciente(34),
    hora_preparacion: generarFechaReciente(30),
    hora_listo: generarFechaReciente(5),
    creado_el: generarFechaReciente(35),
    actualizado_el: generarFechaReciente(5),
    items: mockItems.filter(item => item.pedido_id === 'pedido-003')
  },
  {
    id: 'pedido-004',
    numero_pedido: 'CMD-2025-004',
    numero_mesa: '5',
    cliente_nombre: 'Luis Fernández',
    estado: 'pendiente',
    tipo_servicio: 'mesa',
    subtotal: 10.90,
    descuentos: 0,
    impuestos: 1.09,
    propina: 1.50,
    total: 13.49,
    tiempo_estimado: 8,
    comensales: 1,
    hora_pedido: generarFechaReciente(3),
    creado_el: generarFechaReciente(3),
    actualizado_el: generarFechaReciente(3),
    items: mockItems.filter(item => item.pedido_id === 'pedido-004')
  },
  {
    id: 'pedido-005',
    numero_pedido: 'CMD-2025-005',
    numero_mesa: '1',
    cliente_nombre: 'Elena Jiménez',
    telefono_cliente: '+34 698 456 789',
    estado: 'en_preparacion',
    tipo_servicio: 'mesa',
    subtotal: 23.30,
    descuentos: 0,
    impuestos: 2.33,
    propina: 2.80,
    total: 28.43,
    notas_cocina: 'Cliente alérgico a los frutos secos',
    tiempo_estimado: 18,
    comensales: 2,
    hora_pedido: generarFechaReciente(15),
    hora_confirmacion: generarFechaReciente(14),
    hora_preparacion: generarFechaReciente(12),
    creado_el: generarFechaReciente(15),
    actualizado_el: generarFechaReciente(12),
    items: mockItems.filter(item => item.pedido_id === 'pedido-005')
  },
  {
    id: 'pedido-006',
    numero_pedido: 'CMD-2025-006',
    numero_mesa: '9',
    cliente_nombre: 'Roberto Silva',
    estado: 'listo',
    tipo_servicio: 'mesa',
    subtotal: 26.90,
    descuentos: 1.50,
    impuestos: 2.54,
    propina: 3.20,
    total: 31.14,
    tiempo_estimado: 12,
    comensales: 1,
    hora_pedido: generarFechaReciente(45),
    hora_confirmacion: generarFechaReciente(44),
    hora_preparacion: generarFechaReciente(40),
    hora_listo: generarFechaReciente(2),
    creado_el: generarFechaReciente(45),
    actualizado_el: generarFechaReciente(2),
    items: mockItems.filter(item => item.pedido_id === 'pedido-006')
  }
]

// Función para obtener items por pedido
export const obtenerItemsPorPedido = (pedidoId: string): MockItemPedido[] => {
  return mockItems.filter(item => item.pedido_id === pedidoId)
}

// Función para obtener todos los items
export const obtenerTodosLosItems = (): MockItemPedido[] => {
  return mockItems
}

// Función para simular actualización de estado de pedido
export const actualizarEstadoPedidoMock = (pedidoId: string, nuevoEstado: string): MockPedido | null => {
  const pedido = mockPedidos.find(p => p.id === pedidoId)
  if (pedido) {
    pedido.estado = nuevoEstado as any
    pedido.actualizado_el = new Date().toISOString()
    
    // Actualizar timestamps según el estado
    const ahora = new Date().toISOString()
    switch (nuevoEstado) {
      case 'confirmado':
        pedido.hora_confirmacion = ahora
        break
      case 'en_preparacion':
        pedido.hora_preparacion = ahora
        break
      case 'listo':
        pedido.hora_listo = ahora
        break
      case 'entregado':
        pedido.hora_entrega = ahora
        break
    }
    
    return pedido
  }
  return null
}

// Función para simular actualización de estado de item
export const actualizarEstadoItemMock = (itemId: string, nuevoEstado: string): MockItemPedido | null => {
  const item = mockItems.find(i => i.id === itemId)
  if (item) {
    item.estado = nuevoEstado as any
    item.actualizado_el = new Date().toISOString()
    
    // Actualizar timestamps según el estado
    const ahora = new Date().toISOString()
    switch (nuevoEstado) {
      case 'en_preparacion':
        item.hora_preparacion = ahora
        break
      case 'listo':
        item.hora_listo = ahora
        break
      case 'servido':
        item.hora_servido = ahora
        break
    }
    
    return item
  }
  return null
}

export default mockPedidos