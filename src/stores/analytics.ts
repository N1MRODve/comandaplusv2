import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

// Interfaces para Analytics
interface VentasPorDia {
  fecha: string
  total_ventas: number
  numero_pedidos: number
  ticket_medio: number
}

interface PlatoPopular {
  plato_id: string
  nombre_plato: string
  categoria: string
  cantidad_vendida: number
  ingresos_totales: number
  porcentaje_total: number
}

interface AnalisisHorario {
  hora: number
  pedidos: number
  ventas: number
  porcentaje_dia: number
}

interface RendimientoEmpleado {
  empleado_id: string
  nombre_empleado: string
  pedidos_atendidos: number
  ventas_generadas: number
  horas_trabajadas: number
  ventas_por_hora: number
}

interface MetricasGenerales {
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
}

interface ComparativaPeriodos {
  ventas_actuales: number
  ventas_anteriores: number
  pedidos_actuales: number
  pedidos_anteriores: number
  crecimiento_ventas: number
  crecimiento_pedidos: number
  mejores_dias: string[]
  peores_dias: string[]
}

export const useAnalyticsStore = defineStore('analytics', () => {
  // Estado
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Datos de analytics
  const metricasGenerales = ref<MetricasGenerales | null>(null)
  const ventasPorDia = ref<VentasPorDia[]>([])
  const platosPopulares = ref<PlatoPopular[]>([])
  const analisisHorario = ref<AnalisisHorario[]>([])
  const rendimientoEmpleados = ref<RendimientoEmpleado[]>([])
  const comparativaPeriodos = ref<ComparativaPeriodos | null>(null)

  // Computed properties
  const hasData = computed(() => metricasGenerales.value !== null)
  
  const ventasUltimos7Dias = computed(() => 
    ventasPorDia.value.slice(-7).reduce((sum, dia) => sum + dia.total_ventas, 0)
  )
  
  const pedidosUltimos7Dias = computed(() => 
    ventasPorDia.value.slice(-7).reduce((sum, dia) => sum + dia.numero_pedidos, 0)
  )
  
  const ticketMedioUltimos7Dias = computed(() => {
    const ventas = ventasUltimos7Dias.value
    const pedidos = pedidosUltimos7Dias.value
    return pedidos > 0 ? ventas / pedidos : 0
  })
  
  const horaPico = computed(() => {
    if (analisisHorario.value.length === 0) return null
    return analisisHorario.value.reduce((max, hora) => 
      hora.pedidos > max.pedidos ? hora : max
    )
  })
  
  const mejorEmpleado = computed(() => {
    if (rendimientoEmpleados.value.length === 0) return null
    return rendimientoEmpleados.value.reduce((mejor, empleado) => 
      empleado.ventas_por_hora > mejor.ventas_por_hora ? empleado : mejor
    )
  })

  // Función principal para cargar todos los analytics
  const loadAnalytics = async (fechaInicio?: string, fechaFin?: string) => {
    const authStore = useAuthStore()
    const restauranteId = authStore.currentRestaurant?.id
    
    if (!restauranteId) {
      throw new Error('No hay restaurante seleccionado')
    }

    try {
      loading.value = true
      error.value = null

      // Establecer fechas por defecto (últimos 30 días)
      const fin = fechaFin || new Date().toISOString().split('T')[0]
      const inicio = fechaInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Cargar todas las métricas en paralelo
      await Promise.all([
        loadMetricasGenerales(restauranteId),
        loadVentasPorDia(restauranteId, inicio, fin),
        loadPlatosPopulares(restauranteId, inicio, fin),
        loadAnalisisHorario(restauranteId, inicio, fin),
        loadRendimientoEmpleados(restauranteId, inicio, fin),
        loadComparativaPeriodos(restauranteId, inicio, fin)
      ])

    } catch (err: any) {
      error.value = err.message
      console.error('Error loading analytics:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Métricas generales
  const loadMetricasGenerales = async (restauranteId: string) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      // Ventas de hoy
      const { data: ventasHoy } = await supabase
        .from('pedidos')
        .select('total')
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', hoy)
        .lt('creado_el', hoy + 'T23:59:59')

      // Ventas de ayer
      const { data: ventasAyer } = await supabase
        .from('pedidos')
        .select('total')
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', ayer)
        .lt('creado_el', ayer + 'T23:59:59')

      // Calcular métricas
      const ventasHoyTotal = ventasHoy?.reduce((sum, p) => sum + (p.total || 0), 0) || 0
      const ventasAyerTotal = ventasAyer?.reduce((sum, p) => sum + (p.total || 0), 0) || 0
      const pedidosHoyTotal = ventasHoy?.length || 0
      const pedidosAyerTotal = ventasAyer?.length || 0

      metricasGenerales.value = {
        ventas_hoy: ventasHoyTotal,
        ventas_ayer: ventasAyerTotal,
        ventas_semana: 0, // Se calculará con más datos
        ventas_mes: 0,    // Se calculará con más datos
        pedidos_hoy: pedidosHoyTotal,
        pedidos_ayer: pedidosAyerTotal,
        pedidos_semana: 0,
        pedidos_mes: 0,
        ticket_medio_hoy: pedidosHoyTotal > 0 ? ventasHoyTotal / pedidosHoyTotal : 0,
        ticket_medio_mes: 0,
        clientes_nuevos_mes: 0,
        tiempo_preparacion_medio: 0
      }

    } catch (err: any) {
      console.error('Error loading métricas generales:', err)
      throw err
    }
  }

  // Ventas por día
  const loadVentasPorDia = async (restauranteId: string, fechaInicio: string, fechaFin: string) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          creado_el,
          total,
          estado
        `)
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', fechaInicio)
        .lte('creado_el', fechaFin + 'T23:59:59')
        .order('creado_el')

      if (error) throw error

      // Agrupar por día
      const ventasPorDiaMap = new Map<string, { ventas: number, pedidos: number }>()
      
      data?.forEach(pedido => {
        const fecha = pedido.creado_el.split('T')[0]
        const actual = ventasPorDiaMap.get(fecha) || { ventas: 0, pedidos: 0 }
        
        ventasPorDiaMap.set(fecha, {
          ventas: actual.ventas + (pedido.total || 0),
          pedidos: actual.pedidos + 1
        })
      })

      // Convertir a array
      ventasPorDia.value = Array.from(ventasPorDiaMap.entries()).map(([fecha, datos]) => ({
        fecha,
        total_ventas: datos.ventas,
        numero_pedidos: datos.pedidos,
        ticket_medio: datos.pedidos > 0 ? datos.ventas / datos.pedidos : 0
      })).sort((a, b) => a.fecha.localeCompare(b.fecha))

    } catch (err: any) {
      console.error('Error loading ventas por día:', err)
      throw err
    }
  }

  // Platos más populares - VERSIÓN CORREGIDA
  const loadPlatosPopulares = async (restauranteId: string, fechaInicio: string, fechaFin: string) => {
    try {
      // Primera consulta: obtener items de pedido con platos
      const { data: itemsData, error: itemsError } = await supabase
        .from('items_pedido')
        .select(`
          plato_id,
          cantidad,
          precio,
          pedidos!inner(
            restaurante_id,
            estado,
            creado_el
          ),
          platos!inner(
            nombre,
            categoria_id
          )
        `)
        .eq('pedidos.restaurante_id', restauranteId)
        .eq('pedidos.estado', 'pagado')
        .gte('pedidos.creado_el', fechaInicio)
        .lte('pedidos.creado_el', fechaFin + 'T23:59:59')

      if (itemsError) throw itemsError

      // Segunda consulta: obtener categorías para enlazar
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias_menu')
        .select('id, nombre')
        .eq('restaurante_id', restauranteId)

      if (categoriasError) throw categoriasError

      // Crear mapa de categorías
      const categoriasMap = new Map(categoriasData?.map(cat => [cat.id, cat.nombre]) || [])

      // Agrupar por plato
      const platosMap = new Map<string, { 
        nombre: string, 
        categoria: string, 
        cantidad: number, 
        ingresos: number 
      }>()

      itemsData?.forEach((item: any) => {
        const platoId = item.plato_id
        const actual = platosMap.get(platoId) || {
          nombre: item.platos?.nombre || 'Plato desconocido',
          categoria: categoriasMap.get(item.platos?.categoria_id) || 'Sin categoría',
          cantidad: 0,
          ingresos: 0
        }

        platosMap.set(platoId, {
          ...actual,
          cantidad: actual.cantidad + (item.cantidad || 0),
          ingresos: actual.ingresos + ((item.cantidad || 0) * (item.precio || 0))
        })
      })

      // Convertir a array y ordenar
      const totalIngresos = Array.from(platosMap.values()).reduce((sum, p) => sum + p.ingresos, 0)
      
      platosPopulares.value = Array.from(platosMap.entries())
        .map(([platoId, datos]) => ({
          plato_id: platoId,
          nombre_plato: datos.nombre,
          categoria: datos.categoria,
          cantidad_vendida: datos.cantidad,
          ingresos_totales: datos.ingresos,
          porcentaje_total: totalIngresos > 0 ? (datos.ingresos / totalIngresos) * 100 : 0
        }))
        .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
        .slice(0, 10) // Top 10

    } catch (err: any) {
      console.error('Error loading platos populares:', err)
      throw err
    }
  }

  // Análisis por horas
  const loadAnalisisHorario = async (restauranteId: string, fechaInicio: string, fechaFin: string) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('creado_el, total')
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', fechaInicio)
        .lte('creado_el', fechaFin + 'T23:59:59')

      if (error) throw error

      // Agrupar por hora
      const horarioMap = new Map<number, { pedidos: number, ventas: number }>()
      
      // Inicializar todas las horas
      for (let hora = 0; hora < 24; hora++) {
        horarioMap.set(hora, { pedidos: 0, ventas: 0 })
      }

      data?.forEach(pedido => {
        const hora = new Date(pedido.creado_el).getHours()
        const actual = horarioMap.get(hora)!
        
        horarioMap.set(hora, {
          pedidos: actual.pedidos + 1,
          ventas: actual.ventas + (pedido.total || 0)
        })
      })

      // Calcular totales para porcentajes
      const totalPedidos = Array.from(horarioMap.values()).reduce((sum, h) => sum + h.pedidos, 0)

      analisisHorario.value = Array.from(horarioMap.entries()).map(([hora, datos]) => ({
        hora,
        pedidos: datos.pedidos,
        ventas: datos.ventas,
        porcentaje_dia: totalPedidos > 0 ? (datos.pedidos / totalPedidos) * 100 : 0
      }))

    } catch (err: any) {
      console.error('Error loading análisis horario:', err)
      throw err
    }
  }

  // Rendimiento de empleados - VERSIÓN CORREGIDA
  const loadRendimientoEmpleados = async (restauranteId: string, fechaInicio: string, fechaFin: string) => {
    try {
      // Primera consulta: obtener pedidos con empleado_id
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select('empleado_id, total')
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', fechaInicio)
        .lte('creado_el', fechaFin + 'T23:59:59')
        .not('empleado_id', 'is', null)

      if (pedidosError) throw pedidosError

      // Obtener IDs únicos de empleados
      const empleadoIds = [...new Set(pedidosData?.map(p => p.empleado_id).filter(Boolean) || [])]

      if (empleadoIds.length === 0) {
        rendimientoEmpleados.value = []
        return
      }

      // Segunda consulta: obtener datos de empleados
      const { data: empleadosData, error: empleadosError } = await supabase
        .from('empleados')
        .select(`
          id,
          perfil_id,
          perfiles!inner(nombre_completo)
        `)
        .in('id', empleadoIds)

      if (empleadosError) throw empleadosError

      // Crear mapa de empleados
      const empleadosMap = new Map(
        empleadosData?.map(emp => [
          emp.id, 
          emp.perfiles?.nombre_completo || 'Empleado desconocido'
        ]) || []
      )

      // Agrupar pedidos por empleado
      const ventasPorEmpleado = new Map<string, { pedidos: number, ventas: number }>()

      pedidosData?.forEach(pedido => {
        const empleadoId = pedido.empleado_id
        if (!empleadoId) return

        const actual = ventasPorEmpleado.get(empleadoId) || { pedidos: 0, ventas: 0 }
        ventasPorEmpleado.set(empleadoId, {
          pedidos: actual.pedidos + 1,
          ventas: actual.ventas + (pedido.total || 0)
        })
      })

      // Convertir a array final
      rendimientoEmpleados.value = Array.from(ventasPorEmpleado.entries())
        .map(([empleadoId, datos]) => ({
          empleado_id: empleadoId,
          nombre_empleado: empleadosMap.get(empleadoId) || 'Empleado desconocido',
          pedidos_atendidos: datos.pedidos,
          ventas_generadas: datos.ventas,
          horas_trabajadas: 8, // Estimado, se podría calcular de la tabla turnos
          ventas_por_hora: datos.ventas / 8 // Estimado
        }))
        .sort((a, b) => b.ventas_por_hora - a.ventas_por_hora)

    } catch (err: any) {
      console.error('Error loading rendimiento empleados:', err)
      throw err
    }
  }

  // Comparativa de períodos
  const loadComparativaPeriodos = async (restauranteId: string, fechaInicio: string, fechaFin: string) => {
    try {
      // Calcular período anterior del mismo tamaño
      const diasDiferencia = Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24))
      const fechaInicioAnterior = new Date(new Date(fechaInicio).getTime() - diasDiferencia * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const fechaFinAnterior = new Date(new Date(fechaInicio).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Datos período actual
      const { data: datosActuales } = await supabase
        .from('pedidos')
        .select('total, creado_el')
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', fechaInicio)
        .lte('creado_el', fechaFin + 'T23:59:59')

      // Datos período anterior
      const { data: datosAnteriores } = await supabase
        .from('pedidos')
        .select('total, creado_el')
        .eq('restaurante_id', restauranteId)
        .eq('estado', 'pagado')
        .gte('creado_el', fechaInicioAnterior)
        .lte('creado_el', fechaFinAnterior + 'T23:59:59')

      const ventasActuales = datosActuales?.reduce((sum, p) => sum + (p.total || 0), 0) || 0
      const ventasAnteriores = datosAnteriores?.reduce((sum, p) => sum + (p.total || 0), 0) || 0
      const pedidosActuales = datosActuales?.length || 0
      const pedidosAnteriores = datosAnteriores?.length || 0

      comparativaPeriodos.value = {
        ventas_actuales: ventasActuales,
        ventas_anteriores: ventasAnteriores,
        pedidos_actuales: pedidosActuales,
        pedidos_anteriores: pedidosAnteriores,
        crecimiento_ventas: ventasAnteriores > 0 ? ((ventasActuales - ventasAnteriores) / ventasAnteriores) * 100 : 0,
        crecimiento_pedidos: pedidosAnteriores > 0 ? ((pedidosActuales - pedidosAnteriores) / pedidosAnteriores) * 100 : 0,
        mejores_dias: [], // Se podría calcular
        peores_dias: []   // Se podría calcular
      }

    } catch (err: any) {
      console.error('Error loading comparativa períodos:', err)
      throw err
    }
  }

  // Funciones de exportación
  const exportarDatos = async (formato: 'csv' | 'json', tipoReporte: 'ventas' | 'platos' | 'empleados') => {
    try {
      let datos: any = []
      let filename = ''

      switch (tipoReporte) {
        case 'ventas':
          datos = ventasPorDia.value
          filename = `ventas_${new Date().toISOString().split('T')[0]}`
          break
        case 'platos':
          datos = platosPopulares.value
          filename = `platos_populares_${new Date().toISOString().split('T')[0]}`
          break
        case 'empleados':
          datos = rendimientoEmpleados.value
          filename = `rendimiento_empleados_${new Date().toISOString().split('T')[0]}`
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

    } catch (err: any) {
      console.error('Error exportando datos:', err)
      throw err
    }
  }

  // Reset del store
  const reset = () => {
    metricasGenerales.value = null
    ventasPorDia.value = []
    platosPopulares.value = []
    analisisHorario.value = []
    rendimientoEmpleados.value = []
    comparativaPeriodos.value = null
    loading.value = false
    error.value = null
  }

  return {
    // Estado
    loading,
    error,
    metricasGenerales,
    ventasPorDia,
    platosPopulares,
    analisisHorario,
    rendimientoEmpleados,
    comparativaPeriodos,
    
    // Computed
    hasData,
    ventasUltimos7Dias,
    pedidosUltimos7Dias,
    ticketMedioUltimos7Dias,
    horaPico,
    mejorEmpleado,
    
    // Acciones
    loadAnalytics,
    loadMetricasGenerales,
    loadVentasPorDia,
    loadPlatosPopulares,
    loadAnalisisHorario,
    loadRendimientoEmpleados,
    loadComparativaPeriodos,
    exportarDatos,
    reset
  }
})