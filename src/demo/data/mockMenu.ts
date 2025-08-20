export interface MockCategoria {
  id: string
  nombre: string
  descripcion?: string
  orden_visualizacion: number
  icono?: string
  color_tema: string
  esta_disponible: boolean
  platos: MockPlato[]
}

export interface MockPlato {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  precio_oferta?: number
  url_imagen?: string
  categoria_id: string
  alergenos: string[]
  ingredientes: string[]
  calorias?: number
  tiempo_preparacion: number
  esta_disponible: boolean
  stock_limitado: boolean
  cantidad_stock: number
  tiene_variantes: boolean
  variantes?: any
  es_recomendado: boolean
  es_nuevo: boolean
  es_vegano: boolean
  es_vegetariano: boolean
  es_sin_gluten: boolean
  orden_en_categoria: number
  creado_el: string
  actualizado_el: string
}

// Platos de ejemplo con imágenes de Pexels
const mockPlatos: MockPlato[] = [
  // ENTRANTES
  {
    id: 'plato-001',
    nombre: 'Paella Valenciana',
    descripcion: 'Auténtica paella valenciana con pollo, conejo, judías verdes, garrofón y azafrán',
    precio: 18.50,
    url_imagen: 'https://images.pexels.com/photos/16743486/pexels-photo-16743486.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-001',
    alergenos: ['Gluten'],
    ingredientes: ['Arroz', 'Pollo', 'Conejo', 'Judías verdes', 'Garrofón', 'Azafrán', 'Aceite de oliva'],
    calorias: 420,
    tiempo_preparacion: 25,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      tamaños: ['Individual', 'Para 2', 'Para 4'],
      extras: ['Mariscos', 'Verduras extra']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: false,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T14:30:00Z'
  },
  {
    id: 'plato-002',
    nombre: 'Gazpacho Andaluz',
    descripcion: 'Refrescante gazpacho tradicional con tomate, pepino, pimiento y aceite de oliva virgen extra',
    precio: 7.50,
    url_imagen: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-001',
    alergenos: [],
    ingredientes: ['Tomate', 'Pepino', 'Pimiento', 'Cebolla', 'Ajo', 'Aceite de oliva', 'Vinagre'],
    calorias: 85,
    tiempo_preparacion: 8,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: false,
    es_recomendado: false,
    es_nuevo: true,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-10T09:00:00Z',
    actualizado_el: '2025-01-15T11:20:00Z'
  },
  {
    id: 'plato-003',
    nombre: 'Ensalada César',
    descripcion: 'Lechuga romana, pollo a la plancha, parmesano, picatostes y salsa césar casera',
    precio: 9.50,
    precio_oferta: 8.50,
    url_imagen: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-001',
    alergenos: ['Huevos', 'Lactosa', 'Gluten'],
    ingredientes: ['Lechuga romana', 'Pollo', 'Queso parmesano', 'Pan', 'Huevo', 'Anchoas'],
    calorias: 320,
    tiempo_preparacion: 10,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      proteinas: ['Pollo', 'Gambas', 'Sin proteína'],
      extras: ['Extra parmesano', 'Aguacate']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: false,
    orden_en_categoria: 3,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T16:45:00Z'
  },
  {
    id: 'plato-004',
    nombre: 'Croquetas de Jamón',
    descripcion: 'Croquetas caseras de jamón ibérico con bechamel cremosa (6 unidades)',
    precio: 8.90,
    url_imagen: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-001',
    alergenos: ['Gluten', 'Lactosa', 'Huevos'],
    ingredientes: ['Jamón ibérico', 'Harina', 'Leche', 'Mantequilla', 'Huevo', 'Pan rallado'],
    calorias: 280,
    tiempo_preparacion: 12,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 8,
    tiene_variantes: false,
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: false,
    orden_en_categoria: 4,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T13:15:00Z'
  },

  // PLATOS PRINCIPALES
  {
    id: 'plato-005',
    nombre: 'Hamburguesa Gourmet',
    descripcion: 'Carne de ternera 200g, queso cheddar, bacon, lechuga, tomate, cebolla caramelizada y patatas',
    precio: 14.50,
    url_imagen: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-002',
    alergenos: ['Gluten', 'Lactosa'],
    ingredientes: ['Carne de ternera', 'Pan brioche', 'Queso cheddar', 'Bacon', 'Lechuga', 'Tomate', 'Patatas'],
    calorias: 650,
    tiempo_preparacion: 12,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      punto_carne: ['Poco hecha', 'Al punto', 'Muy hecha'],
      extras: ['Extra bacon', 'Extra queso', 'Aguacate']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: false,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T12:00:00Z'
  },
  {
    id: 'plato-006',
    nombre: 'Pulpo a la Gallega',
    descripcion: 'Pulpo cocido con patatas, pimentón dulce, sal gorda y aceite de oliva virgen extra',
    precio: 15.80,
    url_imagen: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-002',
    alergenos: ['Mariscos'],
    ingredientes: ['Pulpo', 'Patatas', 'Pimentón dulce', 'Sal gorda', 'Aceite de oliva'],
    calorias: 290,
    tiempo_preparacion: 18,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 5,
    tiene_variantes: false,
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T15:30:00Z'
  },
  {
    id: 'plato-007',
    nombre: 'Salmón a la Plancha',
    descripcion: 'Filete de salmón fresco con verduras de temporada y salsa de eneldo',
    precio: 16.90,
    url_imagen: 'https://images.pexels.com/photos/3622643/pexels-photo-3622643.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-002',
    alergenos: ['Pescado'],
    ingredientes: ['Salmón', 'Brócoli', 'Zanahoria', 'Calabacín', 'Eneldo', 'Limón'],
    calorias: 380,
    tiempo_preparacion: 15,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      punto_coccion: ['Poco hecho', 'Al punto', 'Bien hecho'],
      acompañamiento: ['Verduras', 'Arroz', 'Patatas']
    },
    es_recomendado: false,
    es_nuevo: true,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: true,
    orden_en_categoria: 3,
    creado_el: '2025-01-12T10:00:00Z',
    actualizado_el: '2025-01-15T17:00:00Z'
  },
  {
    id: 'plato-008',
    nombre: 'Risotto de Setas',
    descripcion: 'Arroz arborio con mezcla de setas silvestres, parmesano y trufa',
    precio: 13.80,
    url_imagen: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-002',
    alergenos: ['Lactosa'],
    ingredientes: ['Arroz arborio', 'Setas variadas', 'Queso parmesano', 'Caldo de verduras', 'Vino blanco', 'Trufa'],
    calorias: 340,
    tiempo_preparacion: 20,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: false,
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 4,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T10:30:00Z'
  },

  // POSTRES
  {
    id: 'plato-009',
    nombre: 'Tarta de Queso',
    descripcion: 'Cremosa tarta de queso con base de galleta y coulis de frutos rojos',
    precio: 6.50,
    url_imagen: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-003',
    alergenos: ['Lactosa', 'Gluten', 'Huevos'],
    ingredientes: ['Queso crema', 'Galletas', 'Mantequilla', 'Azúcar', 'Huevos', 'Frutos rojos'],
    calorias: 380,
    tiempo_preparacion: 5,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 6,
    tiene_variantes: false,
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: false,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T09:45:00Z'
  },
  {
    id: 'plato-010',
    nombre: 'Flan de la Casa',
    descripcion: 'Flan casero con caramelo líquido y nata montada',
    precio: 4.80,
    url_imagen: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-003',
    alergenos: ['Lactosa', 'Huevos'],
    ingredientes: ['Leche', 'Huevos', 'Azúcar', 'Vainilla', 'Nata'],
    calorias: 220,
    tiempo_preparacion: 3,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: false,
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T08:20:00Z'
  },
  {
    id: 'plato-011',
    nombre: 'Helado Artesanal',
    descripcion: 'Selección de helados artesanales: vainilla, chocolate, fresa y pistacho',
    precio: 5.20,
    url_imagen: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-003',
    alergenos: ['Lactosa', 'Frutos secos'],
    ingredientes: ['Leche', 'Nata', 'Azúcar', 'Huevos', 'Saborizantes naturales'],
    calorias: 180,
    tiempo_preparacion: 2,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      sabores: ['Vainilla', 'Chocolate', 'Fresa', 'Pistacho', 'Limón'],
      presentacion: ['Copa', 'Cucurucho', 'Tarrina']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 3,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T16:10:00Z'
  },

  // BEBIDAS
  {
    id: 'plato-012',
    nombre: 'Agua Mineral',
    descripcion: 'Agua mineral natural 500ml',
    precio: 2.50,
    categoria_id: 'cat-004',
    alergenos: [],
    ingredientes: ['Agua mineral'],
    tiempo_preparacion: 1,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      tipo: ['Con gas', 'Sin gas'],
      tamaño: ['500ml', '1L']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T08:00:00Z'
  },
  {
    id: 'plato-013',
    nombre: 'Vino Tinto Crianza',
    descripcion: 'Vino tinto crianza D.O. Rioja, notas a frutos rojos y especias',
    precio: 18.00,
    url_imagen: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-004',
    alergenos: ['Sulfitos'],
    ingredientes: ['Uva tempranillo', 'Sulfitos'],
    tiempo_preparacion: 2,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 12,
    tiene_variantes: false,
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T14:20:00Z'
  },
  {
    id: 'plato-014',
    nombre: 'Café Cortado',
    descripcion: 'Café espresso con un toque de leche caliente',
    precio: 2.20,
    categoria_id: 'cat-004',
    alergenos: ['Lactosa'],
    ingredientes: ['Café arábica', 'Leche'],
    tiempo_preparacion: 3,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      leche: ['Entera', 'Desnatada', 'Soja', 'Avena'],
      tamaño: ['Normal', 'Doble']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 3,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T07:30:00Z'
  },
  {
    id: 'plato-015',
    nombre: 'Sangría de la Casa',
    descripcion: 'Sangría tradicional con vino tinto, frutas frescas y especias',
    precio: 12.00,
    url_imagen: 'https://images.pexels.com/photos/5946963/pexels-photo-5946963.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-004',
    alergenos: ['Sulfitos'],
    ingredientes: ['Vino tinto', 'Naranja', 'Limón', 'Manzana', 'Azúcar', 'Canela'],
    tiempo_preparacion: 5,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      tamaño: ['Copa', 'Jarra 1L', 'Jarra 2L']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 4,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T11:45:00Z'
  },
  {
    id: 'plato-016',
    nombre: 'Cerveza Estrella Galicia',
    descripcion: 'Cerveza rubia de barril, fresca y con espuma cremosa',
    precio: 3.50,
    url_imagen: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'cat-004',
    alergenos: ['Gluten'],
    ingredientes: ['Malta', 'Lúpulo', 'Agua', 'Levadura'],
    tiempo_preparacion: 2,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      tamaño: ['Caña (200ml)', 'Tercio (330ml)', 'Pinta (500ml)']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: false,
    orden_en_categoria: 5,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T13:00:00Z'
  }
]

// Categorías con sus platos
export const mockCategorias: MockCategoria[] = [
  {
    id: 'cat-001',
    nombre: 'Entrantes',
    descripcion: 'Deliciosos aperitivos para comenzar tu comida',
    orden_visualizacion: 1,
    icono: '🥗',
    color_tema: '#10B981',
    esta_disponible: true,
    platos: mockPlatos.filter(plato => plato.categoria_id === 'cat-001')
  },
  {
    id: 'cat-002',
    nombre: 'Platos Principales',
    descripcion: 'Nuestras especialidades de la casa',
    orden_visualizacion: 2,
    icono: '🍽️',
    color_tema: '#F59E0B',
    esta_disponible: true,
    platos: mockPlatos.filter(plato => plato.categoria_id === 'cat-002')
  },
  {
    id: 'cat-003',
    nombre: 'Postres',
    descripcion: 'Dulces tentaciones para terminar',
    orden_visualizacion: 3,
    icono: '🍰',
    color_tema: '#EC4899',
    esta_disponible: true,
    platos: mockPlatos.filter(plato => plato.categoria_id === 'cat-003')
  },
  {
    id: 'cat-004',
    nombre: 'Bebidas',
    descripcion: 'Refrescos, vinos y bebidas especiales',
    orden_visualizacion: 4,
    icono: '🍹',
    color_tema: '#3B82F6',
    esta_disponible: true,
    platos: mockPlatos.filter(plato => plato.categoria_id === 'cat-004')
  }
]

// Funciones para simular operaciones
export const actualizarDisponibilidadPlatoMock = (platoId: string, disponible: boolean): MockPlato | null => {
  const plato = mockPlatos.find(p => p.id === platoId)
  if (plato) {
    plato.esta_disponible = disponible
    plato.actualizado_el = new Date().toISOString()
    return plato
  }
  return null
}

export const crearPlatoMock = (platoData: Partial<MockPlato>): MockPlato => {
  const nuevoPlato: MockPlato = {
    id: `plato-${Date.now()}`,
    nombre: platoData.nombre || 'Nuevo Plato',
    descripcion: platoData.descripcion,
    precio: platoData.precio || 0,
    precio_oferta: platoData.precio_oferta,
    url_imagen: platoData.url_imagen,
    categoria_id: platoData.categoria_id || 'cat-001',
    alergenos: platoData.alergenos || [],
    ingredientes: platoData.ingredientes || [],
    calorias: platoData.calorias,
    tiempo_preparacion: platoData.tiempo_preparacion || 15,
    esta_disponible: platoData.esta_disponible ?? true,
    stock_limitado: platoData.stock_limitado ?? false,
    cantidad_stock: platoData.cantidad_stock || 0,
    tiene_variantes: platoData.tiene_variantes ?? false,
    variantes: platoData.variantes,
    es_recomendado: platoData.es_recomendado ?? false,
    es_nuevo: platoData.es_nuevo ?? true,
    es_vegano: platoData.es_vegano ?? false,
    es_vegetariano: platoData.es_vegetariano ?? false,
    es_sin_gluten: platoData.es_sin_gluten ?? false,
    orden_en_categoria: platoData.orden_en_categoria || 1,
    creado_el: new Date().toISOString(),
    actualizado_el: new Date().toISOString()
  }
  
  mockPlatos.push(nuevoPlato)
  
  // Agregar a la categoría correspondiente
  const categoria = mockCategorias.find(c => c.id === nuevoPlato.categoria_id)
  if (categoria) {
    categoria.platos.push(nuevoPlato)
  }
  
  return nuevoPlato
}

export const actualizarPlatoMock = (platoId: string, updates: Partial<MockPlato>): MockPlato | null => {
  const platoIndex = mockPlatos.findIndex(p => p.id === platoId)
  if (platoIndex !== -1) {
    mockPlatos[platoIndex] = { ...mockPlatos[platoIndex], ...updates, actualizado_el: new Date().toISOString() }
    
    // Actualizar también en la categoría
    const categoria = mockCategorias.find(c => c.id === mockPlatos[platoIndex].categoria_id)
    if (categoria) {
      const platoEnCategoriaIndex = categoria.platos.findIndex(p => p.id === platoId)
      if (platoEnCategoriaIndex !== -1) {
        categoria.platos[platoEnCategoriaIndex] = mockPlatos[platoIndex]
      }
    }
    
    return mockPlatos[platoIndex]
  }
  return null
}

export const eliminarPlatoMock = (platoId: string): boolean => {
  const platoIndex = mockPlatos.findIndex(p => p.id === platoId)
  if (platoIndex !== -1) {
    const plato = mockPlatos[platoIndex]
    
    // Eliminar del array principal
    mockPlatos.splice(platoIndex, 1)
    
    // Eliminar de la categoría
    const categoria = mockCategorias.find(c => c.id === plato.categoria_id)
    if (categoria) {
      categoria.platos = categoria.platos.filter(p => p.id !== platoId)
    }
    
    return true
  }
  return false
}

export const crearCategoriaMock = (categoriaData: Partial<MockCategoria>): MockCategoria => {
  const nuevaCategoria: MockCategoria = {
    id: `cat-${Date.now()}`,
    nombre: categoriaData.nombre || 'Nueva Categoría',
    descripcion: categoriaData.descripcion,
    orden_visualizacion: categoriaData.orden_visualizacion || mockCategorias.length + 1,
    icono: categoriaData.icono,
    color_tema: categoriaData.color_tema || '#6B7280',
    esta_disponible: categoriaData.esta_disponible ?? true,
    platos: []
  }
  
  mockCategorias.push(nuevaCategoria)
  return nuevaCategoria
}

export const obtenerMenuCompleto = () => {
  return {
    restaurant: {
      id: 'demo-restaurant',
      nombre: 'Restaurante Demo',
      descripcion: 'Un restaurante de demostración para ComandaPlus',
      direccion: 'Calle Demo 123',
      ciudad: 'Madrid',
      telefono: '+34 912 345 678',
      email: 'demo@comandaplus.com',
      url_logo: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=200',
      esta_activo: true
    },
    categorias: mockCategorias
  }
}

export { mockPlatos }
export default mockCategorias