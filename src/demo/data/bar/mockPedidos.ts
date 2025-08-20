export interface BarPedido {
  id: string
  numero_pedido: string
  numero_mesa: string
  cliente_nombre: string
  telefono_cliente?: string
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'entregado' | 'pagado' | 'cancelado'
  tipo_servicio: 'mesa' | 'barra' | 'para_llevar'
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
  items: BarItemPedido[]
}

export interface BarItemPedido {
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

// Items de pedido de ejemplo para bar
const barItems: BarItemPedido[] = [
  // Items para Pedido 1 (Mesa Barra-1)
  {
    id: 'bar-item-001',
    pedido_id: 'bar-pedido-001',
    plato_id: 'bar-001',
    nombre_plato: 'Gin Tonic Premium',
    precio: 12.50,
    cantidad: 2,
    modificaciones: ['Gin Hendricks', 'Extra pepino'],
    estado: 'listo',
    estacion_preparacion: 'barra',
    prioridad: 0,
    tiempo_preparacion_estimado: 3,
    precio_unitario: 12.50,
    descuento_aplicado: 0,
    subtotal: 25.00,
    hora_pedido: generarFechaReciente(15),
    hora_preparacion: generarFechaReciente(12),
    hora_listo: generarFechaReciente(2),
    creado_el: generarFechaReciente(15),
    actualizado_el: generarFechaReciente(2)
  },
  {
    id: 'bar-item-002',
    pedido_id: 'bar-pedido-001',
    plato_id: 'bar-010',
    nombre_plato: 'Patatas Bravas',
    precio: 6.50,
    cantidad: 1,
    estado: 'servido',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 8,
    precio_unitario: 6.50,
    descuento_aplicado: 0,
    subtotal: 6.50,
    hora_pedido: generarFechaReciente(15),
    hora_preparacion: generarFechaReciente(10),
    hora_listo: generarFechaReciente(8),
    hora_servido: generarFechaReciente(5),
    creado_el: generarFechaReciente(15),
    actualizado_el: generarFechaReciente(5)
  },

  // Items para Pedido 2 (Mesa 3)
  {
    id: 'bar-item-003',
    pedido_id: 'bar-pedido-002',
    plato_id: 'bar-004',
    nombre_plato: 'Mojito Cubano',
    precio: 9.50,
    cantidad: 3,
    estado: 'en_preparacion',
    estacion_preparacion: 'barra',
    prioridad: 1,
    tiempo_preparacion_estimado: 4,
    precio_unitario: 9.50,
    descuento_aplicado: 0,
    subtotal: 28.50,
    hora_pedido: generarFechaReciente(8),
    hora_preparacion: generarFechaReciente(5),
    creado_el: generarFechaReciente(8),
    actualizado_el: generarFechaReciente(5)
  },
  {
    id: 'bar-item-004',
    pedido_id: 'bar-pedido-002',
    plato_id: 'bar-011',
    nombre_plato: 'Nachos con Guacamole',
    precio: 8.90,
    cantidad: 1,
    modificaciones: ['Extra picante'],
    estado: 'pendiente',
    estacion_preparacion: 'cocina',
    prioridad: 0,
    tiempo_preparacion_estimado: 6,
    precio_unitario: 8.90,
    descuento_aplicado: 0,
    subtotal: 8.90,
    hora_pedido: generarFechaReciente(8),
    creado_el: generarFechaReciente(8),
    actualizado_el: generarFechaReciente(8)
  },

  // Items para Pedido 3 (Mesa 7)
  {
    id: 'bar-item-005',
    pedido_id: 'bar-pedido-003',
    plato_id: 'bar-012',
    nombre_plato: 'Tabla de Ibéricos',
    precio: 18.50,
    cantidad: 1,
    modificaciones: ['Para 4 personas'],
    estado: 'listo',
    estacion_preparacion: 'cocina',
    prioridad: 2,
    tiempo_preparacion_estimado: 5,
    precio_unitario: 18.50,
    descuento_aplicado: 0,
    subtotal: 18.50,
    hora_pedido: generarFechaReciente(25),
    hora_preparacion: generarFechaReciente(20),
    hora_listo: generarFechaReciente(3),
    creado_el: generarFechaReciente(25),
    actualizado_el: generarFechaReciente(3)
  },
  {
    id: 'bar-item-006',
    pedido_id: 'bar-pedido-003',
    plato_id: 'bar-008',
    nombre_plato: 'Vermut Rojo de la Casa',
    precio: 5.50,
    cantidad: 4,
    estado: 'servido',
    estacion_preparacion: 'barra',
    prioridad: 0,
    tiempo_preparacion_estimado: 2,
    precio_unitario: 5.50,
    descuento_aplicado: 0,
    subtotal: 22.00,
    hora_pedido: generarFechaReciente(25),
    hora_preparacion: generarFechaReciente(23),
    hora_listo: generarFechaReciente(22),
    hora_servido: generarFechaReciente(20),
    creado_el: generarFechaReciente(25),
    actualizado_el: generarFechaReciente(20)
  }
]

// Pedidos principales del bar
export const barPedidos: BarPedido[] = [
  {
    id: 'bar-pedido-001',
    numero_pedido: 'BAR-2025-001',
    numero_mesa: 'Barra-1',
    cliente_nombre: 'David Martínez',
    telefono_cliente: '+34 678 123 456',
    estado: 'listo',
    tipo_servicio: 'barra',
    subtotal: 31.50,
    descuentos: 0,
    impuestos: 3.15,
    propina: 4.00,
    total: 38.65,
    notas: 'Cliente habitual, le gusta el gin con mucho hielo',
    tiempo_estimado: 5,
    comensales: 2,
    hora_pedido: generarFechaReciente(15),
    hora_confirmacion: generarFechaReciente(14),
    hora_preparacion: generarFechaReciente(12),
    hora_listo: generarFechaReciente(2),
    creado_el: generarFechaReciente(15),
    actualizado_el: generarFechaReciente(2),
    items: barItems.filter(item => item.pedido_id === 'bar-pedido-001')
  },
  {
    id: 'bar-pedido-002',
    numero_pedido: 'BAR-2025-002',
    numero_mesa: '3',
    cliente_nombre: 'Laura Sánchez',
    telefono_cliente: '+34 654 987 321',
    estado: 'en_preparacion',
    tipo_servicio: 'mesa',
    subtotal: 37.40,
    descuentos: 2.00,
    impuestos: 3.54,
    propina: 5.00,
    total: 43.94,
    notas: 'Celebración de cumpleaños, grupo joven',
    notas_cocina: 'Nachos extra picantes',
    tiempo_estimado: 8,
    comensales: 4,
    hora_pedido: generarFechaReciente(8),
    hora_confirmacion: generarFechaReciente(7),
    hora_preparacion: generarFechaReciente(5),
    creado_el: generarFechaReciente(8),
    actualizado_el: generarFechaReciente(5),
    items: barItems.filter(item => item.pedido_id === 'bar-pedido-002')
  },
  {
    id: 'bar-pedido-003',
    numero_pedido: 'BAR-2025-003',
    numero_mesa: '7',
    cliente_nombre: 'Roberto Silva',
    estado: 'listo',
    tipo_servicio: 'mesa',
    subtotal: 40.50,
    descuentos: 0,
    impuestos: 4.05,
    propina: 5.50,
    total: 50.05,
    notas: 'Mesa junto a la ventana',
    tiempo_estimado: 6,
    comensales: 3,
    hora_pedido: generarFechaReciente(25),
    hora_confirmacion: generarFechaReciente(24),
    hora_preparacion: generarFechaReciente(20),
    hora_listo: generarFechaReciente(3),
    creado_el: generarFechaReciente(25),
    actualizado_el: generarFechaReciente(3),
    items: barItems.filter(item => item.pedido_id === 'bar-pedido-003')
  }
]

export default barPedidos