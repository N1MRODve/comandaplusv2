<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header del restaurante -->
    <div class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img 
              v-if="restaurant?.url_logo" 
              :src="restaurant.url_logo" 
              :alt="restaurant.nombre"
              class="w-10 h-10 rounded-full object-cover"
            >
            <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center" v-else>
              <span class="text-white font-bold text-lg">{{ restaurant?.nombre?.charAt(0) || 'R' }}</span>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ restaurant?.nombre || 'Cargando...' }}</h1>
              <p v-if="numeroMesa" class="text-sm text-gray-600">Mesa {{ numeroMesa }}</p>
            </div>
          </div>
          <!-- Carrito -->
          <button 
            @click="mostrarCarrito = true"
            class="relative bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      <span class="ml-3 text-gray-600">Cargando menú...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12 px-4">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Error al cargar el menú</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
      <button 
        @click="cargarMenu"
        class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        Reintentar
      </button>
    </div>

    <!-- Navegación de categorías -->
    <div v-else-if="categorias.length > 0" class="bg-white border-b sticky top-16 z-30">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="categoria in categorias"
            :key="categoria.id"
            @click="scrollToCategory(categoria.id)"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeCategoryId === categoria.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <span v-if="categoria.icono" class="mr-2">{{ categoria.icono }}</span>
            {{ categoria.nombre }}
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de categorías y platos -->
    <div class="max-w-md mx-auto pb-24">
      <div
        v-for="categoria in categorias"
        :key="categoria.id"
        :id="`categoria-${categoria.id}`"
        class="mb-6"
      >
        <!-- Header de categoría -->
        <div class="px-4 py-4 bg-white">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <span v-if="categoria.icono" class="mr-3 text-2xl">{{ categoria.icono }}</span>
            {{ categoria.nombre }}
          </h2>
          <p v-if="categoria.descripcion" class="text-sm text-gray-600 mt-1">
            {{ categoria.descripcion }}
          </p>
        </div>

        <!-- Lista de platos -->
        <div class="space-y-1">
          <PlatoCard
            v-for="plato in categoria.platos"
            :key="plato.id"
            :plato="plato"
            @add-to-cart="agregarAlCarrito"
          />
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="categorias.length === 0 && !loading" class="text-center py-12 px-4">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Menú no disponible</h3>
        <p class="mt-1 text-sm text-gray-500">
          No hay platos disponibles en este momento.
        </p>
      </div>
    </div>

    <!-- Botón flotante del carrito (móvil) -->
    <div 
      v-if="cartStore.totalItems > 0"
      class="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <button
        @click="mostrarCarrito = true"
        class="w-full bg-orange-500 text-white py-4 px-6 rounded-lg shadow-lg flex items-center justify-between hover:bg-orange-600 transition-colors"
      >
        <div class="flex items-center">
          <span class="bg-orange-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-bold mr-3">
            {{ cartStore.totalItems }}
          </span>
          <span class="font-medium">Ver carrito</span>
        </div>
        <span class="font-bold">€{{ cartStore.total.toFixed(2) }}</span>
      </button>
    </div>

    <!-- Modal del carrito -->
    <CarritoModal
      v-if="mostrarCarrito"
      :restaurant="restaurant"
      :mesa="numeroMesa"
      @close="mostrarCarrito = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from '@/composables/useToast'
import { useCartStore } from '@/stores/cart'
import PlatoCard from '@/components/menu/PlatoCard.vue'
import CarritoModal from '@/components/menu/CarritoModal.vue'

const route = useRoute()
const { getMenuPublico } = useSupabase()
const { showToast } = useToast()
const cartStore = useCartStore()

// Parámetros de la ruta
const restauranteId = computed(() => route.params.restaurante_id as string)
const numeroMesa = computed(() => route.params.mesa as string)

// Estado reactivo
const loading = ref(false)
const error = ref('')
const restaurant = ref<any>(null)
const categorias = ref<any[]>([])
const mostrarCarrito = ref(false)
const activeCategoryId = ref('')

// Intersection Observer para detectar categoría activa
let observer: IntersectionObserver | null = null

// Métodos
const cargarMenu = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const { data, error: menuError } = await getMenuPublico(restauranteId.value)
    
    if (menuError) {
      throw new Error(menuError.message || 'Error al cargar el menú')
    }

    if (data) {
      restaurant.value = data.restaurant
      categorias.value = data.categorias || []
      
      // Inicializar carrito con datos del restaurante
      cartStore.initializeCart(restauranteId.value, numeroMesa.value)
    }
  } catch (err) {
    console.error('Error cargando menú:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
    showToast('Error al cargar el menú', 'error')
  } finally {
    loading.value = false
  }
}

const agregarAlCarrito = (plato: any, cantidad: number = 1, personalizaciones?: any) => {
  try {
    cartStore.addItem({
      id: plato.id,
      nombre: plato.nombre,
      precio: plato.precio_oferta || plato.precio,
      imagen: plato.url_imagen,
      categoria: plato.categoria_nombre,
      personalizaciones
    }, cantidad)
    
    showToast(`${plato.nombre} añadido al carrito`, 'success')
  } catch (err) {
    console.error('Error añadiendo al carrito:', err)
    showToast('Error al añadir al carrito', 'error')
  }
}

const scrollToCategory = (categoriaId: string) => {
  const element = document.getElementById(`categoria-${categoriaId}`)
  if (element) {
    const offset = 120 // Altura del header sticky
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const setupIntersectionObserver = () => {
  // Configurar observer para detectar categoría activa
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id.replace('categoria-', '')
          activeCategoryId.value = categoryId
        }
      })
    },
    {
      root: null,
      rootMargin: '-120px 0px -50% 0px', // Considerar el header sticky
      threshold: 0.1
    }
  )

  // Observar todas las categorías
  categorias.value.forEach((categoria) => {
    const element = document.getElementById(`categoria-${categoria.id}`)
    if (element) {
      observer?.observe(element)
    }
  })
}

// Lifecycle
onMounted(async () => {
  await cargarMenu()
  
  // Configurar observer después de que el DOM esté listo
  setTimeout(() => {
    setupIntersectionObserver()
  }, 100)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* Ocultar scrollbar en navegación de categorías */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Suavizar transiciones */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
