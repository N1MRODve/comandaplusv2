import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface PedidoActivo {
  id: string
  numero_pedido: string
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'entregado'
  total: number
  comensales: number
  tiempo_transcurrido: number
  items_pendientes: number
  items_preparacion: number
  items_listos: number
  items_totales: number
  empleado_nombre?: string
  creado_el: string
}

interface Mesa {
  id: string
  numero: string
  capacidad: number
  estado: 'libre' | 'ocupada' | 'reservada' | 'fuera_servicio'
  ubicacion?: string
  
  // Información del pedido activo
  pedido_activo?: PedidoActivo
  
  // Métricas de tiempo
  tiempo_ocupada?: number
  hora_ocupacion?: string
  tiempo_promedio_hoy?: number
  servicios_completados_hoy?: number
  
  // Información adicional
  tiempo_limpieza?: number
  nombre_reserva?: string
  hora_reserva?: string
  ingresos_hoy?: number
  servicios_hoy?: number
  historial_reciente?: Array<{
    id: string
    fecha: string
    descripcion: string
  }>
}

interface Camarero {
  id: string
  nombre: string
  mesas_asignadas: string[]
  estado: 'activo' | 'descanso' | 'ausente'
}

interface OcupacionHora {
  hora: number
  porcentaje: number
  mesas_ocupadas: number
}

interface MesaRentable {
  numero: string
  ingresos: number
  servicios: number
  tiempo_promedio: number
}

interface TiempoPorCapacidad {
  personas: number
  tiempo_promedio: number
  servicios_completados: number
  rotacion_dia: number
}

interface MetricasTiempo {
  tiempo_promedio_global: number
  tiempo_maximo_hoy: number
  tiempo_minimo_hoy: number
  rotacion_promedio: number
  eficiencia_salon: number
}

export const useSalonStore = defineStore('salon', () => {
  // Estado reactivo
  const mesas = ref<Mesa[]>([])
  const camareros = ref<Camarero[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isRealTimeConnected = ref(false)
  const lastUpdate = ref<Date | null>(null)

  // Métricas calculadas
  const ocupacionPorHoras = ref<OcupacionHora[]>([])
  const mesasMasRentables = ref<MesaRentable[]>([])
  const tiemposPorCapacidad = ref<TiempoPorCapacidad[]>([])
  const metricasTiempo = ref<MetricasTiempo>({
    tiempo_promedio_global: 0,
    tiempo_maximo_hoy: 0,
    tiempo_minimo_hoy: 0,
    rotacion_promedio: 0,
    eficiencia_salon: 0
  })

  // Suscripciones de tiempo real
  let mesasSubscription: any = null
  let pedidosSubscription: any = null

  // Computed properties básicos
  const totalMesas = computed(() => mesas.value.length)
  
  const mesasLibres = computed(() => 
    mesas.value.filter(mesa => mesa.estado === 'libre').length
  )
  
  const mesasOcupadas = computed(() => 
    mesas.value.filter(mesa => mesa.estado === 'ocupada').length
  )
  
  const mesasReservadas = computed(() => 
    mesas.value.filter(mesa => mesa.estado === 'reservada').length
  )
  
  const mesasEnLimpieza = computed(() => 
    mesas.value.filter(mesa => mesa.estado === 'fuera_servicio').length
  )
  
  const porcentajeOcupacion = computed(() => {
    if (totalMesas.value === 0) return 0
    return (mesasOcupadas.value / totalMesas.value) * 100
  })

  const capacidadUtilizada = computed(() => {
    const capacidadTotal = mesas.value.reduce((sum, mesa) => sum + mesa.capacidad, 0)
    const capacidadOcupada = mesas.value
      .filter(mesa => mesa.estado === 'ocupada')
      .reduce((sum, mesa) => sum + (mesa.pedido_activo?.comensales || 0), 0)
    
    if (capacidadTotal === 0) return 0
    return (capacidadOcupada / capacidadTotal) * 100
  })

  // Computed properties de tiempo mejorados
  const tiempoPromedio = computed(() => {
    const mesasConTiempo = mesas.value.filter(mesa => 
      mesa.estado === 'ocupada' && mesa.tiempo_ocupada && mesa.tiempo_ocupada > 0
    )
    
    if (mesasConTiempo.length === 0) {
      // Si no hay mesas ocupadas, usar el promedio del día
      return metricasTiempo.value.tiempo_promedio_global || 0
    }
    
    const sumaMinutos = mesasConTiempo.reduce((sum, mesa) => 
      sum + (mesa.tiempo_ocupada || 0), 0
    )
    
    return Math.round(sumaMinutos / mesasConTiempo.length)
  })

  const rotacionDelDia = computed(() => {
    return mesas.value.reduce((sum, mesa) => sum + (mesa.servicios_completados_hoy || 0), 0)
  })

  const ingresosDelDia = computed(() => {
    return mesas.value.reduce((sum, mesa) => sum + (mesa.ingresos_hoy || 0), 0)
  })

  const eficienciaSalon = computed(() => {
    if (totalMesas.value === 0) return 0
    
    const rotacionEsperada = totalMesas.value * 3 // 3 servicios por mesa esperados por día
    const rotacionReal = rotacionDelDia.value
    
    return Math.min(100, (rotacionReal / rotacionEsperada) * 100)
  })

  // Métricas de pedidos activos
  const pedidosActivos = computed(() => {
    return mesas.value
      .filter(mesa => mesa.pedido_activo)
      .map(mesa => mesa.pedido_activo!)
      .sort((a, b) => b.tiempo_transcurrido - a.tiempo_transcurrido)
  })

  const itemsPendientesTotales = computed(() => {
    return pedidosActivos.value.reduce((sum, pedido) => sum + pedido.items_pendientes, 0)
  })

  const itemsListosTotales = computed(() => {
    return pedidosActivos.value.reduce((sum, pedido) => sum + pedido.items_listos, 0)
  })

  // Métricas de tiempo críticas
  const mesasConTiempoExcesivo = computed(() => {
    return mesas.value.filter(mesa => 
      mesa.estado === 'ocupada' && 
      mesa.tiempo_ocupada && 
      mesa.tiempo_ocupada > 90 // Más de 1.5 horas
    ).length
  })

  const tiempoPromedioRotacion = computed(() => {
    const tiemposCompletados = tiemposPorCapacidad.value
      .filter(t => t.servicios_completados > 0)
      .map(t => t.tiempo_promedio)
    
    if (tiemposCompletados.length === 0) return 45 // Default 45 minutos
    
    return Math.round(
      tiemposCompletados.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposCompletados.length
    )
  })

  // Métodos principales
  const cargarDatosSalon = async (restauranteId: string) => {
    try {
      loading.value = true
      error.value = null

      console.log('🏪 Cargando datos del salón para restaurante:', restauranteId)

      // Cargar mesas básicas
      const { data: mesasData, error: mesasError } = await supabase
        .from('mesas')
        .select('*')
        .eq('restaurante_id', restauranteId)
        .order('numero')

      if (mesasError) {
        console.error('❌ Error cargando mesas:', mesasError)
        throw mesasError
      }

      console.log('✅ Mesas cargadas:', mesasData?.length || 0)

      // Procesar cada mesa y obtener su información completa
      const mesasProcessed = await Promise.all((mesasData || []).map(async (mesa: any) => {
        const mesaCompleta: Mesa = {
          id: mesa.id,
          numero: mesa.numero,
          capacidad: mesa.capacidad || 4,
          estado: mesa.estado || 'libre',
          ubicacion: mesa.ubicacion,
          hora_ocupacion: mesa.hora_ocupacion,
          ingresos_hoy: await calcularIngresosMesaHoy(mesa.numero, restauranteId),
          servicios_hoy: await calcularServiciosMesaHoy(mesa.numero, restauranteId),
          servicios_completados_hoy: await calcularServiciosCompletadosHoy(mesa.numero, restauranteId),
          tiempo_promedio_hoy: await calcularTiempoPromedioMesaHoy(mesa.numero, restauranteId),
          historial_reciente: await obtenerHistorialMesa(mesa.id)
        }

        // Si la mesa está ocupada, calcular tiempo y obtener pedido activo
        if (mesa.estado === 'ocupada') {
          if (mesa.hora_ocupacion) {
            mesaCompleta.tiempo_ocupada = Math.floor(
              (Date.now() - new Date(mesa.hora_ocupacion).getTime()) / 60000
            )
          }

          const pedidoActivo = await obtenerPedidoActivoMesa(mesa.numero, restauranteId)
          if (pedidoActivo) {
            mesaCompleta.pedido_activo = pedidoActivo
            // Usar el tiempo del pedido si es más preciso
            if (!mesaCompleta.tiempo_ocupada || pedidoActivo.tiempo_transcurrido > mesaCompleta.tiempo_ocupada) {
              mesaCompleta.tiempo_ocupada = pedidoActivo.tiempo_transcurrido
            }
          } else {
            // Si no hay pedido activo pero está marcada como ocupada, puede ser un error
            console.log(`⚠️ Mesa ${mesa.numero} ocupada sin pedido activo`)
          }
        }

        // Si está reservada, obtener información de la reserva
        if (mesa.estado === 'reservada') {
          const reserva = await obtenerReservaMesa(mesa.id)
          if (reserva) {
            mesaCompleta.nombre_reserva = reserva.nombre_cliente
            mesaCompleta.hora_reserva = reserva.hora
          }
        }

        return mesaCompleta
      }))

      mesas.value = mesasProcessed

      // Cargar camareros
      await cargarCamareros(restauranteId)

      // Calcular métricas avanzadas
      await calcularMetricasAvanzadas(restauranteId)

      lastUpdate.value = new Date()
      console.log('✅ Datos del salón cargados exitosamente')

    } catch (err) {
      console.error('❌ Error cargando datos del salón:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      throw err
    } finally {
      loading.value = false
    }
  }

  const obtenerPedidoActivoMesa = async (numeroMesa: string, restauranteId: string): Promise<PedidoActivo | null> => {
    try {
      // Obtener pedido activo
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .select(`
          id,
          numero_pedido,
          estado,
          total,
          comensales,
          creado_el,
          empleado_id,
          empleados!inner(
            perfil_id,
            perfiles!inner(nombre_completo)
          )
        `)
        .eq('numero_mesa', numeroMesa)
        .eq('restaurante_id', restauranteId)
        .not('estado', 'in', '(entregado,pagado,cancelado)')
        .order('creado_el', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (pedidoError || !pedidoData) {
        return null
      }

      // Obtener items del pedido
      const { data: itemsData, error: itemsError } = await supabase
        .from('items_pedido')
        .select('estado')
        .eq('pedido_id', pedidoData.id)

      if (itemsError) {
        console.error('Error obteniendo items:', itemsError)
      }

      const items = itemsData || []
      const items_pendientes = items.filter(item => item.estado === 'pendiente').length
      const items_preparacion = items.filter(item => item.estado === 'en_preparacion').length
      const items_listos = items.filter(item => item.estado === 'listo').length

      const tiempoTranscurrido = Math.floor(
        (Date.now() - new Date(pedidoData.creado_el).getTime()) / 60000
      )

      return {
        id: pedidoData.id,
        numero_pedido: pedidoData.numero_pedido,
        estado: pedidoData.estado,
        total: pedidoData.total || 0,
        comensales: pedidoData.comensales || 0,
        tiempo_transcurrido: tiempoTranscurrido,
        items_pendientes,
        items_preparacion,
        items_listos,
        items_totales: items.length,
        empleado_nombre: pedidoData.empleados?.perfiles?.nombre_completo,
        creado_el: pedidoData.creado_el
      }
    } catch (err) {
      console.error('Error en obtenerPedidoActivoMesa:', err)
      return null
    }
  }

  const calcularServiciosCompletadosHoy = async (numeroMesa: string, restauranteId: string): Promise<number> => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('id')
        .eq('numero_mesa', numeroMesa)
        .eq('restaurante_id', restauranteId)
        .gte('creado_el', hoy)
        .in('estado', ['entregado', 'pagado'])

      if (error) {
        console.error('Error calculando servicios completados:', error)
        return 0
      }
      
      return (data || []).length
    } catch (err) {
      console.error('Error en calcularServiciosCompletadosHoy:', err)
      return 0
    }
  }

  const calcularTiempoPromedioMesaHoy = async (numeroMesa: string, restauranteId: string): Promise<number> => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      
      // Obtener pedidos completados con tiempo de ocupación
      const { data, error } = await supabase
        .from('tiempos_ocupacion_mesa')
        .select('tiempo_ocupacion_minutos')
        .eq('numero_mesa', numeroMesa)
        .eq('restaurante_id', restauranteId)
        .gte('fecha', hoy)
        .not('tiempo_ocupacion_minutos', 'is', null)

      if (error || !data || data.length === 0) {
        return 0
      }
      
      const tiempos = data.map(t => t.tiempo_ocupacion_minutos)
      return Math.round(tiempos.reduce((sum, tiempo) => sum + tiempo, 0) / tiempos.length)
    } catch (err) {
      console.error('Error en calcularTiempoPromedioMesaHoy:', err)
      return 0
    }
  }

  const calcularMetricasAvanzadas = async (restauranteId: string) => {
    try {
      // Ocupación por horas (usando datos reales del día)
      const hoy = new Date().toISOString().split('T')[0]
      
      const horas = Array.from({ length: 24 }, (_, i) => i)
      const ocupacionHoras = await Promise.all(horas.map(async (hora) => {
        const inicioHora = `${hoy} ${hora.toString().padStart(2, '0')}:00:00`
        const finHora = `${hoy} ${hora.toString().padStart(2, '0')}:59:59`
        
        // Contar pedidos activos en esa hora
        const { data, error } = await supabase
          .from('pedidos')
          .select('numero_mesa')
          .eq('restaurante_id', restauranteId)
          .gte('creado_el', inicioHora)
          .lte('creado_el', finHora)
          .not('estado', 'in', '(cancelado)')

        const mesasOcupadasHora = new Set(data?.map(p => p.numero_mesa) || []).size
        const porcentaje = totalMesas.value > 0 ? (mesasOcupadasHora / totalMesas.value) * 100 : 0

        return {
          hora,
          porcentaje: Math.round(porcentaje),
          mesas_ocupadas: mesasOcupadasHora
        }
      }))
      
      ocupacionPorHoras.value = ocupacionHoras

      // Mesas más rentables con métricas de tiempo
      const mesasConIngresos = mesas.value
        .filter(mesa => (mesa.ingresos_hoy || 0) > 0)
        .sort((a, b) => (b.ingresos_hoy || 0) - (a.ingresos_hoy || 0))
        .slice(0, 5)

      mesasMasRentables.value = mesasConIngresos.map(mesa => ({
        numero: mesa.numero,
        ingresos: mesa.ingresos_hoy || 0,
        servicios: mesa.servicios_completados_hoy || 0,
        tiempo_promedio: mesa.tiempo_promedio_hoy || 0
      }))

      // Tiempos por capacidad con datos reales
      const capacidades = [...new Set(mesas.value.map(mesa => mesa.capacidad))]
      tiemposPorCapacidad.value = await Promise.all(capacidades.map(async (capacidad) => {
        const mesasCapacidad = mesas.value.filter(mesa => mesa.capacidad === capacidad)
        
        // Calcular métricas reales
        const serviciosCompletados = mesasCapacidad.reduce((sum, mesa) => 
          sum + (mesa.servicios_completados_hoy || 0), 0
        )
        
        const tiemposPromedios = mesasCapacidad
          .map(mesa => mesa.tiempo_promedio_hoy || 0)
          .filter(tiempo => tiempo > 0)
        
        const tiempoPromedio = tiemposPromedios.length > 0 
          ? Math.round(tiemposPromedios.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposPromedios.length)
          : capacidad * 45 // Estimación por defecto

        const rotacionDia = serviciosCompletados / mesasCapacidad.length

        return {
          personas: capacidad,
          tiempo_promedio: tiempoPromedio,
          servicios_completados: serviciosCompletados,
          rotacion_dia: Math.round(rotacionDia * 10) / 10
        }
      }))

      // Métricas globales de tiempo
      await calcularMetricasTiempoGlobales(restauranteId)

    } catch (err) {
      console.error('Error calculando métricas avanzadas:', err)
    }
  }

  const calcularMetricasTiempoGlobales = async (restauranteId: string) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      
      // Obtener tiempos de ocupación del día
      const { data: tiemposData, error } = await supabase
        .from('tiempos_ocupacion_mesa')
        .select('tiempo_ocupacion_minutos')
        .eq('restaurante_id', restauranteId)
        .gte('fecha', hoy)
        .not('tiempo_ocupacion_minutos', 'is', null)

      if (error || !tiemposData || tiemposData.length === 0) {
        metricasTiempo.value = {
          tiempo_promedio_global: 45,
          tiempo_maximo_hoy: 0,
          tiempo_minimo_hoy: 0,
          rotacion_promedio: 0,
          eficiencia_salon: 0
        }
        return
      }

      const tiempos = tiemposData.map(t => t.tiempo_ocupacion_minutos)
      
      metricasTiempo.value = {
        tiempo_promedio_global: Math.round(tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length),
        tiempo_maximo_hoy: Math.max(...tiempos),
        tiempo_minimo_hoy: Math.min(...tiempos),
        rotacion_promedio: Math.round((rotacionDelDia.value / totalMesas.value) * 10) / 10,
        eficiencia_salon: eficienciaSalon.value
      }
    } catch (err) {
      console.error('Error calculando métricas de tiempo globales:', err)
    }
  }

  // Métodos de automatización
  const marcarMesaComoOcupada = async (numeroMesa: string, restauranteId: string, comensales: number = 2) => {
    try {
      console.log(`🔄 Marcando mesa ${numeroMesa} como ocupada automáticamente`)

      const { error } = await supabase
        .from('mesas')
        .update({ 
          estado: 'ocupada',
          hora_ocupacion: new Date().toISOString(),
          actualizado_el: new Date().toISOString() 
        })
        .eq('numero', numeroMesa)
        .eq('restaurante_id', restauranteId)

      if (error) throw error

      // Actualizar estado local
      const mesa = mesas.value.find(m => m.numero === numeroMesa)
      if (mesa) {
        mesa.estado = 'ocupada'
        mesa.hora_ocupacion = new Date().toISOString()
        mesa.tiempo_ocupada = 0
      }

      console.log(`✅ Mesa ${numeroMesa} marcada como ocupada`)

    } catch (err) {
      console.error('❌ Error marcando mesa como ocupada:', err)
      throw err
    }
  }

  const liberarMesaYGuardarTiempo = async (numeroMesa: string, restauranteId: string) => {
    try {
      console.log(`🔄 Liberando mesa ${numeroMesa} y guardando tiempo de ocupación`)

      // Obtener datos actuales de la mesa
      const { data: mesaData, error: mesaError } = await supabase
        .from('mesas')
        .select('hora_ocupacion')
        .eq('numero', numeroMesa)
        .eq('restaurante_id', restauranteId)
        .single()

      if (mesaError || !mesaData?.hora_ocupacion) {
        console.log('Mesa no tenía hora de ocupación registrada')
      } else {
        // Calcular tiempo de ocupación
        const tiempoOcupacion = Math.floor(
          (Date.now() - new Date(mesaData.hora_ocupacion).getTime()) / 60000
        )

        // Guardar el tiempo de ocupación para métricas
        await supabase
          .from('tiempos_ocupacion_mesa')
          .insert([{
            restaurante_id: restauranteId,
            numero_mesa: numeroMesa,
            fecha: new Date().toISOString().split('T')[0],
            hora_inicio: mesaData.hora_ocupacion,
            hora_fin: new Date().toISOString(),
            tiempo_ocupacion_minutos: tiempoOcupacion,
            creado_el: new Date().toISOString()
          }])

        console.log(`📊 Tiempo de ocupación guardado: ${tiempoOcupacion} minutos`)
      }

      // Liberar la mesa
      const { error } = await supabase
        .from('mesas')
        .update({ 
          estado: 'libre',
          hora_ocupacion: null,
          actualizado_el: new Date().toISOString() 
        })
        .eq('numero', numeroMesa)
        .eq('restaurante_id', restauranteId)

      if (error) throw error

      // Actualizar estado local
      const mesa = mesas.value.find(m => m.numero === numeroMesa)
      if (mesa) {
        mesa.estado = 'libre'
        mesa.hora_ocupacion = undefined
        mesa.tiempo_ocupada = 0
        mesa.pedido_activo = undefined
      }

      console.log(`✅ Mesa ${numeroMesa} liberada`)

    } catch (err) {
      console.error('❌ Error liberando mesa:', err)
      throw err
    }
  }

  // Métodos existentes actualizados
  const cambiarEstadoMesa = async (mesaId: string, nuevoEstado: Mesa['estado']) => {
    try {
      console.log(`🔄 Cambiando estado de mesa ${mesaId} a ${nuevoEstado}`)

      const mesa = mesas.value.find(m => m.id === mesaId)
      if (!mesa) throw new Error('Mesa no encontrada')

      // Si se está liberando una mesa ocupada, guardar tiempo
      if (mesa.estado === 'ocupada' && nuevoEstado === 'libre') {
        await liberarMesaYGuardarTiempo(mesa.numero, mesa.id.split('-')[0]) // Assuming restaurant ID is in mesa ID
        return
      }

      // Para otros cambios de estado
      const updateData: any = { 
        estado: nuevoEstado, 
        actualizado_el: new Date().toISOString() 
      }

      // Si se marca como ocupada, guardar hora
      if (nuevoEstado === 'ocupada') {
        updateData.hora_ocupacion = new Date().toISOString()
      } else if (nuevoEstado === 'libre') {
        updateData.hora_ocupacion = null
      }

      const { error } = await supabase
        .from('mesas')
        .update(updateData)
        .eq('id', mesaId)

      if (error) throw error

      // Actualizar estado local
      mesa.estado = nuevoEstado
      if (nuevoEstado === 'ocupada') {
        mesa.hora_ocupacion = new Date().toISOString()
        mesa.tiempo_ocupada = 0
      } else if (nuevoEstado === 'libre') {
        mesa.hora_ocupacion = undefined
        mesa.tiempo_ocupada = 0
        mesa.pedido_activo = undefined
      }

      console.log('✅ Estado de mesa actualizado')

    } catch (err) {
      console.error('❌ Error cambiando estado de mesa:', err)
      throw err
    }
  }

  // Resto de métodos existentes...
  const obtenerReservaMesa = async (mesaId: string) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const horaActual = new Date().toTimeString().slice(0, 5)

      const { data, error } = await supabase
        .from('reservas')
        .select('nombre_cliente, hora')
        .eq('mesa_id', mesaId)
        .eq('fecha', hoy)
        .gte('hora', horaActual)
        .eq('estado', 'confirmada')
        .order('hora', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error obteniendo reserva:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error en obtenerReservaMesa:', err)
      return null
    }
  }

  const calcularIngresosMesaHoy = async (numeroMesa: string, restauranteId: string): Promise<number> => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('total')
        .eq('numero_mesa', numeroMesa)
        .eq('restaurante_id', restauranteId)
        .gte('creado_el', hoy)
        .eq('estado', 'pagado')

      if (error) {
        console.error('Error calculando ingresos:', error)
        return 0
      }
      
      return (data || []).reduce((sum, pedido) => sum + (pedido.total || 0), 0)
    } catch (err) {
      console.error('Error en calcularIngresosMesaHoy:', err)
      return 0
    }
  }

  const calcularServiciosMesaHoy = async (numeroMesa: string, restauranteId: string): Promise<number> => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('id')
        .eq('numero_mesa', numeroMesa)
        .eq('restaurante_id', restauranteId)
        .gte('creado_el', hoy)
        .eq('estado', 'pagado')

      if (error) {
        console.error('Error calculando servicios:', error)
        return 0
      }
      
      return (data || []).length
    } catch (err) {
      console.error('Error en calcularServiciosMesaHoy:', err)
      return 0
    }
  }

  const obtenerHistorialMesa = async (mesaId: string) => {
    try {
      const { data, error } = await supabase
        .from('historial_mesas')
        .select('*')
        .eq('mesa_id', mesaId)
        .order('creado_el', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error obteniendo historial:', error)
        return []
      }
      
      return (data || []).map(evento => ({
        id: evento.id,
        fecha: evento.creado_el,
        descripcion: evento.descripcion
      }))
    } catch (err) {
      console.error('Error en obtenerHistorialMesa:', err)
      return []
    }
  }

  const cargarCamareros = async (restauranteId: string) => {
    try {
      const { data, error } = await supabase
        .from('empleados')
        .select(`
          id,
          perfiles!inner(nombre_completo),
          esta_activo,
          posicion
        `)
        .eq('restaurante_id', restauranteId)
        .eq('esta_activo', true)
        .in('posicion', ['camarero', 'camarera', 'encargado', 'encargada'])

      if (error) {
        console.error('Error cargando camareros:', error)
        return
      }

      camareros.value = (data || []).map(empleado => ({
        id: empleado.id,
        nombre: empleado.perfiles?.nombre_completo || 'Sin nombre',
        mesas_asignadas: [],
        estado: 'activo'
      }))

    } catch (err) {
      console.error('Error en cargarCamareros:', err)
    }
  }

  const actualizarMesa = async (mesaId: string, datosActualizados: Partial<Mesa>) => {
    try {
      const { error } = await supabase
        .from('mesas')
        .update({
          ...datosActualizados,
          actualizado_el: new Date().toISOString()
        })
        .eq('id', mesaId)

      if (error) throw error

      // Actualizar estado local
      const index = mesas.value.findIndex(m => m.id === mesaId)
      if (index !== -1) {
        mesas.value[index] = { ...mesas.value[index], ...datosActualizados }
      }

    } catch (err) {
      console.error('Error actualizando mesa:', err)
      throw err
    }
  }

  const agregarMesa = async (restauranteId: string, nuevaMesa: { numero: string; capacidad: number; ubicacion?: string }) => {
    try {
      const { data, error } = await supabase
        .from('mesas')
        .insert([{
          numero: nuevaMesa.numero,
          capacidad: nuevaMesa.capacidad,
          ubicacion: nuevaMesa.ubicacion || 'interior',
          estado: 'libre',
          restaurante_id: restauranteId,
          creado_el: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Agregar al estado local
      const mesa: Mesa = {
        id: data.id,
        numero: data.numero,
        capacidad: data.capacidad,
        estado: 'libre',
        ubicacion: data.ubicacion,
        ingresos_hoy: 0,
        servicios_hoy: 0,
        servicios_completados_hoy: 0,
        tiempo_promedio_hoy: 0
      }

      mesas.value.push(mesa)

    } catch (err) {
      console.error('Error agregando mesa:', err)
      throw err
    }
  }

  // Tiempo real mejorado
  const enableRealTime = (restauranteId: string) => {
    try {
      console.log('🔴 Habilitando tiempo real para salón con automatización')

      // Suscripción a cambios en mesas
      mesasSubscription = supabase
        .channel('salon-mesas-automatizado')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'mesas',
            filter: `restaurante_id=eq.${restauranteId}`
          },
          (payload) => handleMesaChange(payload)
        )
        .subscribe()

      // Suscripción a cambios en pedidos - CLAVE para automatización
      pedidosSubscription = supabase
        .channel('salon-pedidos-automatizado')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'pedidos',
            filter: `restaurante_id=eq.${restauranteId}`
          },
          (payload) => handlePedidoChangeConAutomatizacion(payload, restauranteId)
        )
        .subscribe()

      isRealTimeConnected.value = true

    } catch (err) {
      console.error('Error habilitando tiempo real:', err)
      isRealTimeConnected.value = false
    }
  }

  const disableRealTime = () => {
    if (mesasSubscription) {
      mesasSubscription.unsubscribe()
      mesasSubscription = null
    }
    if (pedidosSubscription) {
      pedidosSubscription.unsubscribe()
      pedidosSubscription = null
    }
    isRealTimeConnected.value = false
    console.log('🔴 Tiempo real deshabilitado')
  }

  const handleMesaChange = (payload: RealtimePostgresChangesPayload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'UPDATE':
        const index = mesas.value.findIndex(m => m.id === oldRecord.id)
        if (index !== -1) {
          mesas.value[index] = { 
            ...mesas.value[index], 
            ...newRecord,
            // Recalcular tiempo si está ocupada
            tiempo_ocupada: newRecord.estado === 'ocupada' && newRecord.hora_ocupacion 
              ? Math.floor((Date.now() - new Date(newRecord.hora_ocupacion).getTime()) / 60000)
              : 0
          }
        }
        break
      case 'INSERT':
        // Agregar nueva mesa si no existe
        if (!mesas.value.find(m => m.id === newRecord.id)) {
          mesas.value.push(newRecord as Mesa)
        }
        break
      case 'DELETE':
        mesas.value = mesas.value.filter(m => m.id !== oldRecord.id)
        break
    }

    lastUpdate.value = new Date()
  }

  // ¡¡¡ MÉTODO CLAVE PARA AUTOMATIZACIÓN !!!
  const handlePedidoChangeConAutomatizacion = async (payload: RealtimePostgresChangesPayload, restauranteId: string) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    
    console.log('🔄 Cambio en pedido detectado:', eventType, newRecord)

    try {
      switch (eventType) {
        case 'INSERT':
          // NUEVO PEDIDO -> MARCAR MESA COMO OCUPADA AUTOMÁTICAMENTE
          if (newRecord?.numero_mesa && newRecord?.restaurante_id === restauranteId) {
            console.log(`🍽️ Nuevo pedido en mesa ${newRecord.numero_mesa} - Marcando como ocupada`)
            
            // Encontrar la mesa y marcarla como ocupada
            const mesa = mesas.value.find(m => m.numero === newRecord.numero_mesa)
            if (mesa && mesa.estado === 'libre') {
              await marcarMesaComoOcupada(newRecord.numero_mesa, restauranteId, newRecord.comensales || 2)
            }
            
            // Recargar datos del pedido activo para esta mesa
            const pedidoActivo = await obtenerPedidoActivoMesa(newRecord.numero_mesa, restauranteId)
            if (mesa && pedidoActivo) {
              mesa.pedido_activo = pedidoActivo
              mesa.tiempo_ocupada = pedidoActivo.tiempo_transcurrido
            }
          }
          break

        case 'UPDATE':
          // PEDIDO ACTUALIZADO -> ACTUALIZAR INFO DE LA MESA
          const numeroMesa = newRecord?.numero_mesa || oldRecord?.numero_mesa
          if (numeroMesa) {
            const mesa = mesas.value.find(m => m.numero === numeroMesa)
            if (mesa) {
              // Recargar datos del pedido activo
              const pedidoActivo = await obtenerPedidoActivoMesa(numeroMesa, restauranteId)
              
              if (pedidoActivo) {
                mesa.pedido_activo = pedidoActivo
                mesa.tiempo_ocupada = pedidoActivo.tiempo_transcurrido
                
                // Si la mesa no estaba ocupada, marcarla como ocupada
                if (mesa.estado === 'libre') {
                  await marcarMesaComoOcupada(numeroMesa, restauranteId, pedidoActivo.comensales)
                }
              } else {
                // Si no hay pedido activo, puede que se haya completado
                if (mesa.estado === 'ocupada' && (newRecord?.estado === 'entregado' || newRecord?.estado === 'pagado')) {
                  console.log(`✅ Pedido completado en mesa ${numeroMesa} - Liberando mesa`)
                  await liberarMesaYGuardarTiempo(numeroMesa, restauranteId)
                }
              }
            }
          }
          break

        case 'DELETE':
          // PEDIDO ELIMINADO -> VERIFICAR SI LIBERAR MESA
          const numeroMesaEliminada = oldRecord?.numero_mesa
          if (numeroMesaEliminada) {
            const mesa = mesas.value.find(m => m.numero === numeroMesaEliminada)
            if (mesa && mesa.estado === 'ocupada') {
              // Verificar si quedan pedidos activos
              const pedidoActivo = await obtenerPedidoActivoMesa(numeroMesaEliminada, restauranteId)
              if (!pedidoActivo) {
                console.log(`🗑️ Último pedido eliminado en mesa ${numeroMesaEliminada} - Liberando mesa`)
                await liberarMesaYGuardarTiempo(numeroMesaEliminada, restauranteId)
              }
            }
          }
          break
      }

      lastUpdate.value = new Date()

    } catch (error) {
      console.error('❌ Error en automatización de pedidos:', error)
    }
  }

  // Métodos de intervalo para actualizar tiempos
  let intervalId: number | null = null

  const startTimeUpdater = () => {
    // Actualizar tiempos cada minuto
    intervalId = setInterval(() => {
      mesas.value.forEach(mesa => {
        if (mesa.estado === 'ocupada' && mesa.hora_ocupacion) {
          mesa.tiempo_ocupada = Math.floor(
            (Date.now() - new Date(mesa.hora_ocupacion).getTime()) / 60000
          )
        }
        
        if (mesa.pedido_activo) {
          mesa.pedido_activo.tiempo_transcurrido = Math.floor(
            (Date.now() - new Date(mesa.pedido_activo.creado_el).getTime()) / 60000
          )
        }
      })
      
      lastUpdate.value = new Date()
    }, 60000) // Cada minuto
  }

  const stopTimeUpdater = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // Cleanup mejorado
  const cleanup = () => {
    disableRealTime()
    stopTimeUpdater()
    mesas.value = []
    camareros.value = []
    error.value = null
    lastUpdate.value = null
    console.log('🧹 Store salon limpiado')
  }

  return {
    // Estado
    mesas,
    camareros,
    loading,
    error,
    isRealTimeConnected,
    lastUpdate,

    // Métricas básicas
    ocupacionPorHoras,
    mesasMasRentables,
    tiemposPorCapacidad,
    metricasTiempo,

    // Computed básicos
    totalMesas,
    mesasLibres,
    mesasOcupadas,
    mesasReservadas,
    mesasEnLimpieza,
    porcentajeOcupacion,
    capacidadUtilizada,
    tiempoPromedio,
    rotacionDelDia,
    ingresosDelDia,

    // Computed de tiempo avanzados
    eficienciaSalon,
    mesasConTiempoExcesivo,
    tiempoPromedioRotacion,

    // Métricas de pedidos
    pedidosActivos,
    itemsPendientesTotales,
    itemsListosTotales,

    // Métodos principales
    cargarDatosSalon,
    cambiarEstadoMesa,
    actualizarMesa,
    agregarMesa,
    
    // Métodos de automatización
    marcarMesaComoOcupada,
    liberarMesaYGuardarTiempo,
    
    // Tiempo real
    enableRealTime,
    disableRealTime,
    startTimeUpdater,
    stopTimeUpdater,
    cleanup
  }
})