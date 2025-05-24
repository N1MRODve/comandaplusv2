import { supabase } from '@/lib/supabase'
import type { 
  PostgrestResponse, 
  PostgrestSingleResponse,
  RealtimeChannel 
} from '@supabase/supabase-js'

export function useSupabase() {
  
  // Función helper para ejecutar RPC con manejo de errores
  const executeRPC = async <T = any>(
    functionName: string, 
    params?: Record<string, any>
  ): Promise<{ data: T | null; error: any }> => {
    try {
      const { data, error } = await supabase.rpc(functionName, params)
      return { data, error }
    } catch (err) {
      console.error(`Error executing RPC ${functionName}:`, err)
      return { data: null, error: err }
    }
  }

  // Función helper para consultas con manejo de errores
  const executeQuery = async <T = any>(
    query: any
  ): Promise<{ data: T | null; error: any }> => {
    try {
      const result = await query
      return { data: result.data, error: result.error }
    } catch (err) {
      console.error('Error executing query:', err)
      return { data: null, error: err }
    }
  }

  // Crear canal de tiempo real
  const createRealtimeChannel = (
    channelName: string,
    config?: {
      table?: string
      schema?: string
      filter?: string
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
    }
  ): RealtimeChannel => {
    return supabase.channel(channelName)
  }

  // Suscribirse a cambios en una tabla
  const subscribeToTable = (
    table: string,
    callback: (payload: any) => void,
    options?: {
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      schema?: string
      filter?: string
    }
  ): RealtimeChannel => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: options?.event || '*',
          schema: options?.schema || 'public',
          table: table,
          ...(options?.filter && { filter: options.filter })
        },
        callback
      )
      .subscribe()

    return channel
  }

  // Funciones específicas de ComandaPlus
  const getMenuPublico = async (restauranteId: string) => {
    return executeRPC('get_menu_publico', { restaurante_uuid: restauranteId })
  }

  const getPedidosActivos = async (restauranteId: string) => {
    return executeRPC('get_pedidos_activos', { p_restaurante_id: restauranteId })
  }

  const crearPedidoMesa = async (data: {
    restaurante_id: string
    numero_mesa: string
    items: any[]
    cliente_id?: string
    notas?: string
  }) => {
    return executeRPC('crear_pedido_mesa', {
      p_restaurante_id: data.restaurante_id,
      p_numero_mesa: data.numero_mesa,
      p_items: data.items,
      p_cliente_id: data.cliente_id,
      p_notas: data.notas
    })
  }

  const getRestaurantDashboard = async (restauranteId: string) => {
    return executeRPC('get_restaurant_dashboard', { p_restaurante_id: restauranteId })
  }

  const getAnalyticsRapidos = async (restauranteId: string) => {
    return executeRPC('get_analytics_rapidos', { p_restaurante_id: restauranteId })
  }

  const actualizarEstadoPedido = async (pedidoId: string, nuevoEstado: string) => {
    return executeQuery(
      supabase
        .from('pedidos')
        .update({ 
          estado: nuevoEstado,
          [`hora_${nuevoEstado}`]: new Date().toISOString(),
          actualizado_el: new Date().toISOString()
        })
        .eq('id', pedidoId)
        .select()
    )
  }

  const actualizarDisponibilidadPlato = async (platoId: string, disponible: boolean) => {
    return executeQuery(
      supabase
        .from('platos')
        .update({ 
          esta_disponible: disponible,
          actualizado_el: new Date().toISOString()
        })
        .eq('id', platoId)
        .select()
    )
  }

  // Obtener perfil de usuario por auth_user_id
  const getUserProfile = async (authUserId: string) => {
    return executeQuery(
      supabase
        .from('perfiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle()
    )
  }

  // Obtener restaurantes del usuario
  const getUserRestaurants = async (perfilId: string) => {
    try {
      // Restaurantes como propietario
      const { data: ownedRestaurants } = await supabase
        .from('restaurantes')
        .select('*, propietario:perfiles!propietario_id(*)')
        .eq('propietario_id', perfilId)
        .eq('esta_activo', true)

      // Restaurantes como empleado
      const { data: employeeData } = await supabase
        .from('empleados')
        .select(`
          posicion,
          esta_activo,
          restaurante:restaurantes(*)
        `)
        .eq('perfil_id', perfilId)
        .eq('esta_activo', true)

      const allRestaurants = [
        ...(ownedRestaurants || []).map(r => ({ 
          ...r, 
          userRole: 'propietario' 
        })),
        ...(employeeData || [])
          .filter(e => e.restaurante)
          .map(e => ({ 
            ...e.restaurante, 
            userRole: e.posicion 
          }))
      ]

      return { data: allRestaurants, error: null }
    } catch (error) {
      console.error('Error getting user restaurants:', error)
      return { data: [], error }
    }
  }

  // Verificar acceso a restaurante
  const checkRestaurantAccess = async (restauranteId: string, perfilId: string) => {
    try {
      // Verificar si es propietario
      const { data: restaurant } = await supabase
        .from('restaurantes')
        .select('id')
        .eq('id', restauranteId)
        .eq('propietario_id', perfilId)
        .maybeSingle()

      if (restaurant) {
        return { data: { hasAccess: true, role: 'propietario' }, error: null }
      }

      // Verificar si es empleado
      const { data: employee } = await supabase
        .from('empleados')
        .select('posicion')
        .eq('restaurante_id', restauranteId)
        .eq('perfil_id', perfilId)
        .eq('esta_activo', true)
        .maybeSingle()

      if (employee) {
        return { data: { hasAccess: true, role: employee.posicion }, error: null }
      }

      return { data: { hasAccess: false, role: null }, error: null }
    } catch (error) {
      console.error('Error checking restaurant access:', error)
      return { data: { hasAccess: false, role: null }, error }
    }
  }

  // Obtener items por estación
  const getItemsPorEstacion = async (restauranteId: string, estacion?: string) => {
    return executeRPC('obtener_items_por_estacion', {
      p_restaurante_id: restauranteId,
      p_estacion: estacion
    })
  }

  return {
    // Cliente Supabase base
    supabase,
    
    // Helpers generales
    executeRPC,
    executeQuery,
    createRealtimeChannel,
    subscribeToTable,
    
    // Funciones específicas de negocio
    getMenuPublico,
    getPedidosActivos,
    crearPedidoMesa,
    getRestaurantDashboard,
    getAnalyticsRapidos,
    actualizarEstadoPedido,
    actualizarDisponibilidadPlato,
    getUserProfile,
    getUserRestaurants,
    checkRestaurantAccess,
    getItemsPorEstacion
  }
}