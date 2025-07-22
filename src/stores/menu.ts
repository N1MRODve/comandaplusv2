import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

// Interfaces
interface Categoria {
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

interface Plato {
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

export const useMenuStore = defineStore('menu', () => {
  // Estado
  const categorias = ref<Categoria[]>([])
  const platos = ref<Plato[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasData = computed(() => categorias.value.length > 0 || platos.value.length > 0)
  
  const categoriasActivas = computed(() => 
    categorias.value.filter(c => c.esta_disponible)
      .sort((a, b) => a.orden_visualizacion - b.orden_visualizacion)
  )
  
  const platosDisponibles = computed(() => 
    platos.value.filter(p => p.esta_disponible)
  )
  
  const platosRecomendados = computed(() => 
    platos.value.filter(p => p.es_recomendado && p.esta_disponible)
  )

  // Funciones para obtener datos
  const loadMenu = async () => {
    const authStore = useAuthStore()
    const restauranteId = authStore.currentRestaurant?.id
    
    if (!restauranteId) {
      throw new Error('No hay restaurante seleccionado')
    }

    try {
      loading.value = true
      error.value = null

      // Cargar categorías
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias_menu')
        .select('*')
        .eq('restaurante_id', restauranteId)
        .order('orden_visualizacion', { ascending: true })

      if (categoriasError) throw categoriasError

      // Cargar platos
      const { data: platosData, error: platosError } = await supabase
        .from('platos')
        .select('*')
        .eq('restaurante_id', restauranteId)
        .order('orden_en_categoria', { ascending: true })

      if (platosError) throw platosError

      categorias.value = categoriasData || []
      platos.value = platosData || []

    } catch (err: any) {
      error.value = err.message
      console.error('Error loading menu:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Gestión de categorías
  const createCategoria = async (categoriaData: Partial<Categoria>) => {
    const authStore = useAuthStore()
    const restauranteId = authStore.currentRestaurant?.id
    
    if (!restauranteId) {
      throw new Error('No hay restaurante seleccionado')
    }

    try {
      // Obtener el siguiente orden de visualización
      const maxOrden = categorias.value.length > 0 
        ? Math.max(...categorias.value.map(c => c.orden_visualizacion))
        : 0

      const nuevaCategoria = {
        ...categoriaData,
        restaurante_id: restauranteId,
        orden_visualizacion: maxOrden + 1,
        color_tema: categoriaData.color_tema || '#6B7280',
        esta_disponible: categoriaData.esta_disponible ?? true
      }

      const { data, error } = await supabase
        .from('categorias_menu')
        .insert(nuevaCategoria)
        .select()
        .single()

      if (error) throw error

      categorias.value.push(data)
      return data

    } catch (err: any) {
      error.value = err.message
      console.error('Error creating categoria:', err)
      throw err
    }
  }

  const updateCategoria = async (categoriaId: string, updates: Partial<Categoria>) => {
    try {
      const { data, error } = await supabase
        .from('categorias_menu')
        .update(updates)
        .eq('id', categoriaId)
        .select()
        .single()

      if (error) throw error

      const index = categorias.value.findIndex(c => c.id === categoriaId)
      if (index !== -1) {
        categorias.value[index] = { ...categorias.value[index], ...data }
      }

      return data

    } catch (err: any) {
      error.value = err.message
      console.error('Error updating categoria:', err)
      throw err
    }
  }

  const deleteCategoria = async (categoriaId: string) => {
    try {
      // Primero eliminar todos los platos de la categoría
      const { error: platosError } = await supabase
        .from('platos')
        .delete()
        .eq('categoria_id', categoriaId)

      if (platosError) throw platosError

      // Luego eliminar la categoría
      const { error: categoriaError } = await supabase
        .from('categorias_menu')
        .delete()
        .eq('id', categoriaId)

      if (categoriaError) throw categoriaError

      // Actualizar el estado local
      categorias.value = categorias.value.filter(c => c.id !== categoriaId)
      platos.value = platos.value.filter(p => p.categoria_id !== categoriaId)

    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting categoria:', err)
      throw err
    }
  }

  const reorderCategorias = async (categoriasOrdenadas: Categoria[]) => {
    try {
      const updates = categoriasOrdenadas.map((categoria, index) => ({
        id: categoria.id,
        orden_visualizacion: index + 1
      }))

      const { error } = await supabase
        .from('categorias_menu')
        .upsert(updates)

      if (error) throw error

      // Actualizar el estado local
      categorias.value = categoriasOrdenadas.map((categoria, index) => ({
        ...categoria,
        orden_visualizacion: index + 1
      }))

    } catch (err: any) {
      error.value = err.message
      console.error('Error reordering categorias:', err)
      throw err
    }
  }

  // Gestión de platos
  const createPlato = async (platoData: Partial<Plato>) => {
    const authStore = useAuthStore()
    const restauranteId = authStore.currentRestaurant?.id
    
    if (!restauranteId) {
      throw new Error('No hay restaurante seleccionado')
    }

    try {
      // Obtener el siguiente orden en la categoría
      const platosEnCategoria = platos.value.filter(p => p.categoria_id === platoData.categoria_id)
      const maxOrden = platosEnCategoria.length > 0 
        ? Math.max(...platosEnCategoria.map(p => p.orden_en_categoria))
        : 0

      const nuevoPlato = {
        ...platoData,
        restaurante_id: restauranteId,
        orden_en_categoria: maxOrden + 1,
        esta_disponible: platoData.esta_disponible ?? true,
        stock_limitado: platoData.stock_limitado ?? false,
        cantidad_stock: platoData.cantidad_stock ?? 0,
        tiene_variantes: platoData.tiene_variantes ?? false,
        es_recomendado: platoData.es_recomendado ?? false,
        es_nuevo: platoData.es_nuevo ?? false,
        es_vegano: platoData.es_vegano ?? false,
        es_vegetariano: platoData.es_vegetariano ?? false,
        es_sin_gluten: platoData.es_sin_gluten ?? false,
        tiempo_preparacion: platoData.tiempo_preparacion ?? 15,
        alergenos: platoData.alergenos ?? [],
        ingredientes: platoData.ingredientes ?? []
      }

      const { data, error } = await supabase
        .from('platos')
        .insert(nuevoPlato)
        .select()
        .single()

      if (error) throw error

      platos.value.push(data)
      return data

    } catch (err: any) {
      error.value = err.message
      console.error('Error creating plato:', err)
      throw err
    }
  }

  const updatePlato = async (platoId: string, updates: Partial<Plato>) => {
    try {
      const { data, error } = await supabase
        .from('platos')
        .update(updates)
        .eq('id', platoId)
        .select()
        .single()

      if (error) throw error

      const index = platos.value.findIndex(p => p.id === platoId)
      if (index !== -1) {
        platos.value[index] = { ...platos.value[index], ...data }
      }

      return data

    } catch (err: any) {
      error.value = err.message
      console.error('Error updating plato:', err)
      throw err
    }
  }

  const deletePlato = async (platoId: string) => {
    try {
      const { error } = await supabase
        .from('platos')
        .delete()
        .eq('id', platoId)

      if (error) throw error

      platos.value = platos.value.filter(p => p.id !== platoId)

    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting plato:', err)
      throw err
    }
  }

  const reorderPlatos = async (categoriaId: string, platosOrdenados: Plato[]) => {
    try {
      const updates = platosOrdenados.map((plato, index) => ({
        id: plato.id,
        orden_en_categoria: index + 1
      }))

      const { error } = await supabase
        .from('platos')
        .upsert(updates)

      if (error) throw error

      // Actualizar el estado local
      platos.value = platos.value.map(plato => {
        if (plato.categoria_id === categoriaId) {
          const nuevoIndice = platosOrdenados.findIndex(p => p.id === plato.id)
          if (nuevoIndice !== -1) {
            return { ...plato, orden_en_categoria: nuevoIndice + 1 }
          }
        }
        return plato
      })

    } catch (err: any) {
      error.value = err.message
      console.error('Error reordering platos:', err)
      throw err
    }
  }

  // Funciones de búsqueda y filtrado
  const buscarPlatos = (termino: string) => {
    const terminoLower = termino.toLowerCase()
    return platos.value.filter(plato => 
      plato.nombre.toLowerCase().includes(terminoLower) ||
      plato.descripcion?.toLowerCase().includes(terminoLower) ||
      plato.ingredientes.some(ingrediente => 
        ingrediente.toLowerCase().includes(terminoLower)
      )
    )
  }

  const getPlatosPorCategoria = (categoriaId: string) => {
    return platos.value
      .filter(p => p.categoria_id === categoriaId)
      .sort((a, b) => a.orden_en_categoria - b.orden_en_categoria)
  }

  const getPlatosConFiltrosDieteticos = (filtros: {
    vegano?: boolean
    vegetariano?: boolean
    sinGluten?: boolean
    sinAlergenos?: string[]
  }) => {
    return platos.value.filter(plato => {
      if (filtros.vegano && !plato.es_vegano) return false
      if (filtros.vegetariano && !plato.es_vegetariano) return false
      if (filtros.sinGluten && !plato.es_sin_gluten) return false
      if (filtros.sinAlergenos && filtros.sinAlergenos.some(alergeno => 
        plato.alergenos.includes(alergeno)
      )) return false
      
      return true
    })
  }

  // Gestión de disponibilidad masiva
  const cambiarDisponibilidadMasiva = async (platoIds: string[], disponible: boolean) => {
    try {
      const { error } = await supabase
        .from('platos')
        .update({ esta_disponible: disponible })
        .in('id', platoIds)

      if (error) throw error

      // Actualizar estado local
      platos.value = platos.value.map(plato => 
        platoIds.includes(plato.id) 
          ? { ...plato, esta_disponible: disponible }
          : plato
      )

    } catch (err: any) {
      error.value = err.message
      console.error('Error updating massive availability:', err)
      throw err
    }
  }

  // Gestión de stock
  const actualizarStock = async (platoId: string, cantidad: number) => {
    try {
      const updates: Partial<Plato> = { cantidad_stock: cantidad }
      
      // Si la cantidad es 0, marcar como no disponible
      if (cantidad <= 0) {
        updates.esta_disponible = false
      }

      await updatePlato(platoId, updates)

    } catch (err: any) {
      error.value = err.message
      console.error('Error updating stock:', err)
      throw err
    }
  }

  // Funciones de utilidad
  const getMenuPublico = () => {
    return categoriasActivas.value.map(categoria => ({
      ...categoria,
      platos: getPlatosPorCategoria(categoria.id).filter(p => p.esta_disponible)
    }))
  }

  const getEstadisticasMenu = () => {
    return {
      totalCategorias: categorias.value.length,
      totalPlatos: platos.value.length,
      platosDisponibles: platosDisponibles.value.length,
      platosRecomendados: platosRecomendados.value.length,
      platosVeganos: platos.value.filter(p => p.es_vegano).length,
      platosVegetarianos: platos.value.filter(p => p.es_vegetariano).length,
      platosSinGluten: platos.value.filter(p => p.es_sin_gluten).length,
      precioPromedio: platos.value.length > 0 
        ? platos.value.reduce((sum, p) => sum + p.precio, 0) / platos.value.length
        : 0,
      precioMinimo: platos.value.length > 0 
        ? Math.min(...platos.value.map(p => p.precio))
        : 0,
      precioMaximo: platos.value.length > 0 
        ? Math.max(...platos.value.map(p => p.precio))
        : 0
    }
  }

  // Reset del store
  const reset = () => {
    categorias.value = []
    platos.value = []
    loading.value = false
    error.value = null
  }

  return {
    // Estado
    categorias,
    platos,
    loading,
    error,
    
    // Computed
    hasData,
    categoriasActivas,
    platosDisponibles,
    platosRecomendados,
    
    // Acciones
    loadMenu,
    
    // Categorías
    createCategoria,
    updateCategoria,
    deleteCategoria,
    reorderCategorias,
    
    // Platos
    createPlato,
    updatePlato,
    deletePlato,
    reorderPlatos,
    
    // Búsqueda y filtrado
    buscarPlatos,
    getPlatosPorCategoria,
    getPlatosConFiltrosDieteticos,
    
    // Gestión masiva
    cambiarDisponibilidadMasiva,
    actualizarStock,
    
    // Utilidades
    getMenuPublico,
    getEstadisticasMenu,
    reset
  }
})