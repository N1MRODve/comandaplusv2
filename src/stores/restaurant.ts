import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

// INTERFACES (Moldes para nuestros datos, con todos los campos)

// Define cómo es un Plato, basándonos en los datos de tu base de datos.
interface Plato {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  precio_oferta: number | null
  url_imagen: string | null
  esta_disponible: boolean
  alergenos: string[]
  tiempo_preparacion: number
  es_nuevo: boolean
  es_recomendado: boolean
  es_vegano: boolean
  es_vegetariano: boolean
  es_sin_gluten: boolean
}

// Define cómo es una Categoría, que a su vez contiene una lista de Platos.
interface Categoria {
  id: string
  nombre: string
  descripcion: string | null
  icono: string | null
  platos: Plato[]
}

// Define cómo es un Restaurante.
interface Restaurant {
  id: string
  nombre: string
  descripcion: string | null
  direccion: string | null
  ciudad: string | null
  codigo_postal: string | null
  telefono: string | null
  email: string
  url_logo: string | null
  url_imagen_portada: string | null
  esta_activo: boolean
  horario_apertura: any // 'any' es flexible para la estructura compleja de horarios
  // ... puedes añadir cualquier otro campo del restaurante que necesites
}


// STORE (El cerebro que gestiona los datos del restaurante)

export const useRestaurantStore = defineStore('restaurant', () => {
  // --- STATE ---
  // El estado ahora es más limpio y se corresponde con nuestra estructura de datos optimizada.
  const currentRestaurant = ref<Restaurant | null>(null)
  const categorias = ref<Categoria[]>([]) // El menú es ahora directamente una lista de categorías con sus platos.
  const loading = ref(false)
  const error = ref<string | null>(null)

  // --- ACTIONS ---
  // La única acción que necesitamos para el menú del cliente.
  async function loadMenu(restaurantId: string) {
    // Si no hay ID, no hacemos nada.
    if (!restaurantId) {
      error.value = 'No se ha proporcionado un ID de restaurante.'
      return
    }
    
    try {
      loading.value = true
      error.value = null
      
      // Llamamos a nuestra función optimizada en Supabase.
      const { data, error: rpcError } = await supabase
        .rpc('get_menu_publico', { p_restaurante_id: restaurantId })

      if (rpcError) {
        // Si hay un error en la llamada, lo lanzamos para que se capture abajo.
        throw rpcError
      }
      
      // ¡Aquí está la magia! Asignamos los datos directamente.
      // No necesitamos calcular ni agrupar nada en el frontend.
      if (data) {
        currentRestaurant.value = data.restaurant
        categorias.value = data.categorias
      } else {
        // Si no vienen datos, podría ser un problema.
        throw new Error('No se recibieron datos del menú.')
      }

    } catch (e: any) {
      // Capturamos cualquier error y lo guardamos en el estado para mostrarlo en la UI.
      error.value = e.message || 'Ha ocurrido un error desconocido al cargar el menú.'
      console.error('Error en loadMenu:', e)
    } finally {
      // Pase lo que pase, al final dejamos de cargar.
      loading.value = false
    }
  }

  // Ya NO necesitamos la función `loadRestaurant` ni la `computed property` para `categorias`,
  // porque `loadMenu` ahora lo hace todo de una vez y de forma más eficiente.

  return {
    // Estado que usaremos en los componentes:
    currentRestaurant,
    categorias,
    loading,
    error,
    // Acciones que llamaremos desde los componentes:
    loadMenu
  }
})