export interface BarCategoria {
  id: string
  nombre: string
  descripcion?: string
  orden_visualizacion: number
  icono?: string
  color_tema: string
  esta_disponible: boolean
  platos: BarPlato[]
}

export interface BarPlato {
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

// Productos de bar con imágenes de Pexels
const barPlatos: BarPlato[] = [
  // CÓCTELES DE AUTOR
  {
    id: 'bar-001',
    nombre: 'Gin Tonic Premium',
    descripcion: 'Gin Hendricks con tónica Fever Tree, pepino, enebro y lima',
    precio: 12.50,
    url_imagen: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-001',
    alergenos: [],
    ingredientes: ['Gin Hendricks', 'Tónica Fever Tree', 'Pepino', 'Enebro', 'Lima'],
    tiempo_preparacion: 3,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      gin: ['Hendricks', 'Bombay', 'Tanqueray', 'Beefeater'],
      tonica: ['Fever Tree', 'Schweppes', 'Nordic Mist']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T14:30:00Z'
  },
  {
    id: 'bar-002',
    nombre: 'Negroni Sbagliato',
    descripcion: 'Campari, vermut rojo, prosecco y naranja. Versión espumosa del clásico',
    precio: 11.00,
    url_imagen: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-001',
    alergenos: ['Sulfitos'],
    ingredientes: ['Campari', 'Vermut rojo', 'Prosecco', 'Naranja'],
    tiempo_preparacion: 4,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: false,
    es_recomendado: true,
    es_nuevo: true,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-10T10:00:00Z',
    actualizado_el: '2025-01-15T16:20:00Z'
  },
  {
    id: 'bar-003',
    nombre: 'Whiskey Sour',
    descripcion: 'Bourbon, zumo de limón, jarabe de azúcar y clara de huevo',
    precio: 10.50,
    url_imagen: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-001',
    alergenos: ['Huevos'],
    ingredientes: ['Bourbon', 'Zumo de limón', 'Jarabe de azúcar', 'Clara de huevo'],
    tiempo_preparacion: 5,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      whiskey: ['Bourbon', 'Rye', 'Irish'],
      estilo: ['Con clara', 'Sin clara', 'Ahumado']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 3,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T12:15:00Z'
  },

  // CÓCTELES CLÁSICOS
  {
    id: 'bar-004',
    nombre: 'Mojito Cubano',
    descripcion: 'Ron blanco, menta fresca, lima, azúcar y soda',
    precio: 9.50,
    url_imagen: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-002',
    alergenos: [],
    ingredientes: ['Ron blanco', 'Menta fresca', 'Lima', 'Azúcar', 'Soda'],
    tiempo_preparacion: 4,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      ron: ['Blanco', 'Dorado'],
      intensidad: ['Suave', 'Fuerte']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T11:45:00Z'
  },
  {
    id: 'bar-005',
    nombre: 'Dry Martini',
    descripcion: 'Gin premium, vermut seco, aceituna o twist de limón',
    precio: 13.00,
    url_imagen: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-002',
    alergenos: [],
    ingredientes: ['Gin', 'Vermut seco', 'Aceituna', 'Limón'],
    tiempo_preparacion: 3,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      proporcion: ['Dry', 'Extra Dry', 'Perfect'],
      garnish: ['Aceituna', 'Twist de limón', 'Cebollita']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T13:30:00Z'
  },

  // CERVEZAS Y SIDRAS
  {
    id: 'bar-006',
    nombre: 'IPA Artesana',
    descripcion: 'Cerveza India Pale Ale de producción local, amargor intenso',
    precio: 4.50,
    url_imagen: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-003',
    alergenos: ['Gluten'],
    ingredientes: ['Malta', 'Lúpulo', 'Levadura', 'Agua'],
    tiempo_preparacion: 2,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 24,
    tiene_variantes: true,
    variantes: {
      tamaño: ['Tercio (330ml)', 'Pinta (500ml)'],
      temperatura: ['Bien fría', 'Temperatura ambiente']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: false,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T17:00:00Z'
  },
  {
    id: 'bar-007',
    nombre: 'Cerveza Rubia de Barril',
    descripcion: 'Cerveza rubia fresca de barril con espuma cremosa',
    precio: 3.20,
    url_imagen: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-003',
    alergenos: ['Gluten'],
    ingredientes: ['Malta', 'Lúpulo', 'Levadura', 'Agua'],
    tiempo_preparacion: 1,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      tamaño: ['Caña (200ml)', 'Doble (400ml)', 'Jarra (1L)']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: false,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T09:30:00Z'
  },

  // VINOS Y VERMUTS
  {
    id: 'bar-008',
    nombre: 'Vermut Rojo de la Casa',
    descripcion: 'Vermut artesanal con naranja, aceituna y hielo',
    precio: 5.50,
    url_imagen: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-004',
    alergenos: ['Sulfitos'],
    ingredientes: ['Vermut rojo', 'Naranja', 'Aceituna', 'Hielo'],
    tiempo_preparacion: 2,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      estilo: ['Con soda', 'Solo', 'Con tónica'],
      garnish: ['Naranja', 'Limón', 'Aceituna']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T16:00:00Z'
  },
  {
    id: 'bar-009',
    nombre: 'Vino Ribera del Duero',
    descripcion: 'Vino tinto joven D.O. Ribera del Duero, notas frutales',
    precio: 16.00,
    url_imagen: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-004',
    alergenos: ['Sulfitos'],
    ingredientes: ['Uva tempranillo', 'Sulfitos'],
    tiempo_preparacion: 2,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 8,
    tiene_variantes: true,
    variantes: {
      servicio: ['Copa', 'Botella'],
      temperatura: ['Temperatura ambiente', 'Ligeramente fresco']
    },
    es_recomendado: false,
    es_nuevo: false,
    es_vegano: true,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T14:20:00Z'
  },

  // TAPAS PARA PICAR
  {
    id: 'bar-010',
    nombre: 'Patatas Bravas',
    descripcion: 'Patatas fritas con salsa brava picante y alioli',
    precio: 6.50,
    url_imagen: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-005',
    alergenos: ['Huevos'],
    ingredientes: ['Patatas', 'Tomate', 'Pimentón', 'Ajo', 'Huevo', 'Aceite'],
    calorias: 280,
    tiempo_preparacion: 8,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      picante: ['Suave', 'Picante', 'Extra picante'],
      salsa: ['Solo brava', 'Solo alioli', 'Ambas']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: true,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T13:45:00Z'
  },
  {
    id: 'bar-011',
    nombre: 'Nachos con Guacamole',
    descripcion: 'Nachos crujientes con guacamole casero, queso y jalapeños',
    precio: 8.90,
    url_imagen: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-005',
    alergenos: ['Lactosa'],
    ingredientes: ['Nachos', 'Aguacate', 'Queso', 'Jalapeños', 'Tomate', 'Cebolla'],
    calorias: 420,
    tiempo_preparacion: 6,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      picante: ['Sin picante', 'Medio', 'Picante'],
      extras: ['Extra queso', 'Extra guacamole', 'Carne picada']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: true,
    es_sin_gluten: false,
    orden_en_categoria: 2,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T15:20:00Z'
  },

  // RACIONES PARA COMPARTIR
  {
    id: 'bar-012',
    nombre: 'Tabla de Ibéricos',
    descripcion: 'Selección de jamón ibérico, chorizo, lomo y queso manchego',
    precio: 18.50,
    url_imagen: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-006',
    alergenos: ['Lactosa'],
    ingredientes: ['Jamón ibérico', 'Chorizo', 'Lomo', 'Queso manchego', 'Pan'],
    calorias: 580,
    tiempo_preparacion: 5,
    esta_disponible: true,
    stock_limitado: true,
    cantidad_stock: 8,
    tiene_variantes: true,
    variantes: {
      tamaño: ['Para 2', 'Para 4', 'Para 6'],
      extras: ['Pan tostado', 'Tomate rallado', 'Aceite premium']
    },
    es_recomendado: true,
    es_nuevo: false,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: false,
    orden_en_categoria: 1,
    creado_el: '2025-01-01T10:00:00Z',
    actualizado_el: '2025-01-15T12:40:00Z'
  },
  {
    id: 'bar-013',
    nombre: 'Mini Hamburguesas',
    descripcion: 'Trio de mini hamburguesas con diferentes salsas (6 unidades)',
    precio: 12.80,
    url_imagen: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    categoria_id: 'bar-cat-006',
    alergenos: ['Gluten', 'Lactosa', 'Huevos'],
    ingredientes: ['Carne de ternera', 'Pan brioche', 'Queso', 'Lechuga', 'Tomate'],
    calorias: 480,
    tiempo_preparacion: 12,
    esta_disponible: true,
    stock_limitado: false,
    cantidad_stock: 0,
    tiene_variantes: true,
    variantes: {
      salsas: ['BBQ', 'Mostaza miel', 'Chipotle'],
      punto: ['Poco hecha', 'Al punto', 'Muy hecha']
    },
    es_recomendado: false,
    es_nuevo: true,
    es_vegano: false,
    es_vegetariano: false,
    es_sin_gluten: false,
    orden_en_categoria: 2,
    creado_el: '2025-01-12T10:00:00Z',
    actualizado_el: '2025-01-15T18:15:00Z'
  }
]

// Categorías con sus productos
export const barCategorias: BarCategoria[] = [
  {
    id: 'bar-cat-001',
    nombre: 'Cócteles de Autor',
    descripcion: 'Creaciones únicas de nuestros bartenders',
    orden_visualizacion: 1,
    icono: '🍸',
    color_tema: '#8B5CF6',
    esta_disponible: true,
    platos: barPlatos.filter(plato => plato.categoria_id === 'bar-cat-001')
  },
  {
    id: 'bar-cat-002',
    nombre: 'Clásicos',
    descripcion: 'Los cócteles de siempre, perfectamente ejecutados',
    orden_visualizacion: 2,
    icono: '🥃',
    color_tema: '#F59E0B',
    esta_disponible: true,
    platos: barPlatos.filter(plato => plato.categoria_id === 'bar-cat-002')
  },
  {
    id: 'bar-cat-003',
    nombre: 'Cervezas y Sidras',
    descripcion: 'Selección de cervezas artesanas y sidras naturales',
    orden_visualizacion: 3,
    icono: '🍺',
    color_tema: '#10B981',
    esta_disponible: true,
    platos: barPlatos.filter(plato => plato.categoria_id === 'bar-cat-003')
  },
  {
    id: 'bar-cat-004',
    nombre: 'Vinos y Vermuts',
    descripcion: 'Carta de vinos y vermuts seleccionados',
    orden_visualizacion: 4,
    icono: '🍷',
    color_tema: '#DC2626',
    esta_disponible: true,
    platos: barPlatos.filter(plato => plato.categoria_id === 'bar-cat-004')
  },
  {
    id: 'bar-cat-005',
    nombre: 'Tapas para Picar',
    descripcion: 'Pequeños bocados perfectos para acompañar',
    orden_visualizacion: 5,
    icono: '🫒',
    color_tema: '#059669',
    esta_disponible: true,
    platos: barPlatos.filter(plato => plato.categoria_id === 'bar-cat-005')
  },
  {
    id: 'bar-cat-006',
    nombre: 'Raciones para Compartir',
    descripcion: 'Platos generosos para disfrutar en grupo',
    orden_visualizacion: 6,
    icono: '🍽️',
    color_tema: '#7C2D12',
    esta_disponible: true,
    platos: barPlatos.filter(plato => plato.categoria_id === 'bar-cat-006')
  }
]

// Función para obtener el menú completo del bar
export const obtenerMenuCompletoBar = () => {
  return {
    restaurant: {
      id: 'demo-bar',
      nombre: 'The Cocktail Lounge',
      descripcion: 'Bar de copas y cócteles con ambiente sofisticado',
      direccion: 'Calle del Barrio 45',
      ciudad: 'Madrid',
      telefono: '+34 915 678 901',
      email: 'info@cocktaillounge.com',
      url_logo: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=200',
      esta_activo: true
    },
    categorias: barCategorias
  }
}

export { barPlatos }
export default barCategorias