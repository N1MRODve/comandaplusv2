import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iksfrzqpjtwjoonbqwaz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrc2ZyenFwanR3am9vbmJxd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjA4NzcsImV4cCI6MjA2MjczNjg3N30.TAXEbb8V4Ji1D6rZWfsQbO3HUfB_nvP10GfVE-tKG9M'

// Crear cliente de Supabase con configuraciones optimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'comandaplus-dashboard-v1.0.0'
    }
  }
})

// Tipos TypeScript extendidos para el dashboard
export type Database = {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string
          auth_user_id: string
          nombre_completo: string
          email: string
          telefono?: string
          url_avatar?: string
          rol: 'admin' | 'dueño' | 'encargado' | 'empleado' | 'cliente'
          esta_activo: boolean
          creado_el: string
          actualizado_el: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          nombre_completo: string
          email: string
          telefono?: string
          url_avatar?: string
          rol?: 'admin' | 'dueño' | 'encargado' | 'empleado' | 'cliente'
          esta_activo?: boolean
          creado_el?: string
          actualizado_el?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          nombre_completo?: string
          email?: string
          telefono?: string
          url_avatar?: string
          rol?: 'admin' | 'dueño' | 'encargado' | 'empleado' | 'cliente'
          esta_activo?: boolean
          creado_el?: string
          actualizado_el?: string
        }
      }
      restaurantes: {
        Row: {
          id: string
          nombre: string
          tipo_establecimiento: 'restaurante' | 'café' | 'bar' | 'pub' | 'cafetería' | 'gastrobar' | 'otro'
          descripcion?: string
          direccion: string
          ciudad: string
          codigo_postal?: string
          telefono?: string
          email?: string
          url_logo?: string
          url_imagen_portada?: string
          propietario_id: string
          capacidad_maxima: number
          numero_mesas: number
          horario_apertura?: any
          configuracion?: any
          esta_activo: boolean
          fecha_apertura?: string
          redes_sociales?: any
          creado_el: string
          actualizado_el: string
        }
        Insert: {
          id?: string
          nombre: string
          tipo_establecimiento?: 'restaurante' | 'café' | 'bar' | 'pub' | 'cafetería' | 'gastrobar' | 'otro'
          descripcion?: string
          direccion: string
          ciudad: string
          codigo_postal?: string
          telefono?: string
          email?: string
          url_logo?: string
          url_imagen_portada?: string
          propietario_id: string
          capacidad_maxima?: number
          numero_mesas?: number
          horario_apertura?: any
          configuracion?: any
          esta_activo?: boolean
          fecha_apertura?: string
          redes_sociales?: any
        }
        Update: {
          id?: string
          nombre?: string
          tipo_establecimiento?: 'restaurante' | 'café' | 'bar' | 'pub' | 'cafetería' | 'gastrobar' | 'otro'
          descripcion?: string
          direccion?: string
          ciudad?: string
          codigo_postal?: string
          telefono?: string
          email?: string
          url_logo?: string
          url_imagen_portada?: string
          propietario_id?: string
          capacidad_maxima?: number
          numero_mesas?: number
          horario_apertura?: any
          configuracion?: any
          esta_activo?: boolean
          fecha_apertura?: string
          redes_sociales?: any
        }
      }
      empleados: {
        Row: {
          id: string
          perfil_id: string
          restaurante_id: string
          posicion: string
          tarifa_hora: number
          fecha_inicio: string
          fecha_fin?: string
          esta_activo: boolean
          permisos?: any
          notas?: string
          creado_el: string
          actualizado_el: string
        }
      }
      categorias_menu: {
        Row: {
          id: string
          nombre: string
          descripcion?: string
          restaurante_id: string
          orden_visualizacion: number
          icono?: string
          color_tema: string
          esta_disponible: boolean
          horario_disponibilidad?: any
          configuracion?: any
          creado_el: string
          actualizado_el: string
        }
      }
      pedidos: {
        Row: {
          id: string
          numero_pedido: string
          numero_mesa: string
          cliente_id?: string
          restaurante_id: string
          empleado_id?: string
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
          nombre_cliente?: string
          telefono_cliente?: string
          direccion_entrega?: string
          coordenadas_entrega?: any
          hora_pedido: string
          hora_confirmacion?: string
          hora_preparacion?: string
          hora_listo?: string
          hora_entrega?: string
          tiempo_preparacion_real?: number
          creado_el: string
          actualizado_el: string
        }
      }
      items_pedido: {
        Row: {
          id: string
          pedido_id: string
          plato_id: string
          nombre_plato: string
          precio: number
          cantidad: number
          variante_seleccionada?: any
          modificaciones?: any
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
      }
      platos: {
        Row: {
          id: string
          nombre: string
          descripcion?: string
          precio: number
          precio_oferta?: number
          url_imagen?: string
          categoria_id: string
          restaurante_id: string
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
          horario_disponibilidad?: any
          configuracion?: any
          orden_en_categoria: number
          creado_el: string
          actualizado_el: string
        }
      }
      pagos: {
        Row: {
          id: string
          pedido_id: string
          monto: number
          moneda: string
          metodo_pago: string
          estado: string
          id_transaccion?: string
          proveedor_pago?: string
          fecha_procesamiento?: string
          fecha_completado?: string
          creado_el: string
          actualizado_el: string
        }
      }
      turnos: {
        Row: {
          id: string
          empleado_id: string
          restaurante_id: string
          fecha: string
          hora_inicio: string
          hora_fin?: string
          hora_entrada_real?: string
          hora_salida_real?: string
          estado: string
          tipo_turno: string
          horas_trabajadas?: number
          notas?: string
          creado_el: string
          actualizado_el: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_menu_publico: {
        Args: { restaurante_uuid: string }
        Returns: any
      }
      crear_pedido_mesa: {
        Args: {
          p_restaurante_id: string
          p_numero_mesa: string
          p_items: any[]
          p_cliente_id?: string
          p_notas?: string
        }
        Returns: any
      }
      get_pedidos_activos: {
        Args: { restaurante_uuid: string }
        Returns: any[]
      }
      get_restaurant_dashboard: {
        Args: { restaurante_uuid: string }
        Returns: any
      }
      get_analytics_rapidos: {
        Args: { restaurante_uuid: string }
        Returns: any
      }
      get_items_estacion: {
        Args: { 
          restaurante_uuid: string
          estacion_param?: string 
        }
        Returns: any[]
      }
      resumen_financiero_restaurante: {
        Args: { 
          restaurante_uuid: string
          p_fecha_inicio?: string
          p_fecha_fin?: string
        }
        Returns: any
      }
      get_stats_tiempo_real: {
        Args: { restaurante_uuid: string }
        Returns: any
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos específicos para el dashboard
export type RestauranteDashboard = {
  pedidos_hoy: number
  ventas_hoy: number
  ticket_promedio: number
  empleados_activos: number
  mesas_ocupadas: number
  tiempo_promedio_preparacion: number
  platos_mas_vendidos: Array<{
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

export type AnalyticsRapidos = {
  ventas_mes_actual: number
  crecimiento_mes_anterior: number
  clientes_mes: number
  productos_mas_vendidos: Array<{
    id: string
    nombre: string
    cantidad_vendida: number
    ingresos_totales: number
  }>
  horarios_pico: Array<{
    hora: number
    pedidos_promedio: number
  }>
}

// Helper para manejar errores de Supabase mejorado
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Credenciales de acceso incorrectas',
    'Email not confirmed': 'Debes confirmar tu email antes de continuar',
    'User not found': 'Usuario no encontrado',
    'Invalid email': 'Email no válido',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'User already registered': 'Este email ya está registrado',
    'Database connection error': 'Error de conexión con la base de datos',
    'Row Level Security policy violation': 'No tienes permisos para realizar esta acción',
    'JWT expired': 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
    'Permission denied': 'No tienes permisos suficientes para esta acción'
  }

  const message = errorMessages[error.message] || error.message || 'Error desconocido'
  
  return {
    message,
    code: error.code,
    details: error.details,
    isAuthError: error.message?.includes('JWT') || error.message?.includes('credentials'),
    isPermissionError: error.message?.includes('Permission') || error.message?.includes('policy')
  }
}

// Funciones utilitarias para el dashboard
export const dashboardQueries = {
  // Obtener datos del dashboard principal
  getDashboardData: async (restauranteId: string) => {
    const { data, error } = await supabase.rpc('get_restaurant_dashboard', {
      restaurante_uuid: restauranteId
    })
    if (error) throw error
    return data as RestauranteDashboard
  },

  // Obtener analytics rápidos
  getAnalyticsRapidos: async (restauranteId: string) => {
    const { data, error } = await supabase.rpc('get_analytics_rapidos', {
      restaurante_uuid: restauranteId
    })
    if (error) throw error
    return data as AnalyticsRapidos
  },

  // Obtener pedidos activos con realtime
  getPedidosActivos: async (restauranteId: string) => {
    const { data, error } = await supabase.rpc('get_pedidos_activos', {
      restaurante_uuid: restauranteId
    })
    if (error) throw error
    return data
  },

  // Obtener resumen financiero
  getResumenFinanciero: async (restauranteId: string, fechaInicio?: string, fechaFin?: string) => {
    const { data, error } = await supabase.rpc('resumen_financiero_restaurante', {
      restaurante_uuid: restauranteId,
      p_fecha_inicio: fechaInicio,
      p_fecha_fin: fechaFin
    })
    if (error) throw error
    return data
  },

  // Obtener estadísticas en tiempo real
  getStatsRealTime: async (restauranteId: string) => {
    const { data, error } = await supabase.rpc('get_stats_tiempo_real', {
      restaurante_uuid: restauranteId
    })
    if (error) throw error
    return data
  }
}

// Configuración de realtime para dashboard
export const setupRealtimeSubscriptions = (restauranteId: string, callbacks: {
  onPedidoChange?: (payload: any) => void
  onItemChange?: (payload: any) => void
  onPagoChange?: (payload: any) => void
}) => {
  const channels: any[] = []

  // Suscripción a cambios en pedidos
  if (callbacks.onPedidoChange) {
    const pedidosChannel = supabase
      .channel(`pedidos-${restauranteId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'pedidos',
          filter: `restaurante_id=eq.${restauranteId}`
        },
        callbacks.onPedidoChange
      )
      .subscribe()
    
    channels.push(pedidosChannel)
  }

  // Suscripción a cambios en items de pedido
  if (callbacks.onItemChange) {
    const itemsChannel = supabase
      .channel(`items-${restauranteId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'items_pedido'
        },
        callbacks.onItemChange
      )
      .subscribe()
    
    channels.push(itemsChannel)
  }

  // Suscripción a cambios en pagos
  if (callbacks.onPagoChange) {
    const pagosChannel = supabase
      .channel(`pagos-${restauranteId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'pagos'
        },
        callbacks.onPagoChange
      )
      .subscribe()
    
    channels.push(pagosChannel)
  }

  // Función para limpiar suscripciones
  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel)
    })
  }
}

// Configuración de autenticación
export const authConfig = {
  redirectTo: `${window.location.origin}/auth/callback`,
  appearance: {
    theme: 'default',
    variables: {
      default: {
        colors: {
          brand: '#f97316',
          brandAccent: '#ea580c'
        }
      }
    }
  },
  localization: {
    variables: {
      sign_up: {
        email_label: 'Email',
        password_label: 'Contraseña',
        button_label: 'Registrarse',
        loading_button_label: 'Registrando...',
        social_provider_text: 'Continuar con {{provider}}',
        link_text: '¿No tienes cuenta? Regístrate'
      },
      sign_in: {
        email_label: 'Email',
        password_label: 'Contraseña',
        button_label: 'Iniciar sesión',
        loading_button_label: 'Iniciando sesión...',
        social_provider_text: 'Continuar con {{provider}}',
        link_text: '¿Ya tienes cuenta? Inicia sesión'
      }
    }
  }
}

export default supabase