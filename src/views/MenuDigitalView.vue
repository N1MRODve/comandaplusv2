<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header del menú digital -->
    <div class="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
              <span class="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ restaurantStore.currentRestaurant?.nombre || 'Cargando...' }}</h1>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span v-if="numeroMesa" class="font-medium">Mesa {{ numeroMesa }}</span>
                <span v-else class="text-orange-600 font-medium">Escanea el QR de tu mesa</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="mostrarCarrito = true"
            :class="[
              'relative p-3 rounded-full shadow-lg transition-all duration-300 transform',
              cartStore.totalItems > 0 
                ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
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
    <div v-if="restaurantStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="restaurantStore.error" class="text-center py-12 px-4">
      <div class="max-w-sm mx-auto">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">¡Ups! Algo salió mal</h3>
        <p class="text-gray-600 mb-4">{{ restaurantStore.error }}</p>
        <button 
          @click="restaurantStore.loadMenu(restauranteId)"
          class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Navegación de categorías -->
      <div v-if="restaurantStore.categorias.length > 0" class="bg-white border-b sticky top-[88px] z-30 shadow-sm">
        <div class="max-w-md mx-auto px-4 py-3">
          <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
            <button
              v-for="categoria in restaurantStore.categorias"
              :key="categoria.id"
              @click="scrollToCategory(categoria.id)"
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                activeCategoryId === categoria.id
                  ? 'bg-orange-500 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              ]"
            >
              <span v-if="categoria.icono" class="mr-2">{{ categoria.icono }}</span>
              {{ categoria.nombre }}
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido del menú -->
      <div v-if="restaurantStore.categorias.length > 0" class="max-w-md mx-auto pb-32">
        <div
          v-for="categoria in restaurantStore.categorias"
          :key="categoria.id"
          :id="`categoria-${categoria.id}`"
          class="mb-8"
        >
          <div class="px-4 py-6 bg-white border-b-2 border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 flex items-center">
              <span v-if="categoria.icono" class="mr-3 text-3xl">{{ categoria.icono }}</span>
              {{ categoria.nombre }}
            </h2>
            <p v-if="categoria.descripcion" class="text-gray-600 mt-1 text-sm">
              {{ categoria.descripcion }}
            </p>
          </div>

          <div class="px-4 space-y-4 pt-4">
            <PlatoCardCliente
              v-for="plato in categoria.platos"
              :key="plato.id"
              :plato="plato"
              @add-to-cart="agregarAlCarrito"
            />
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-16 px-4">
        <div class="max-w-sm mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Menú no disponible</h3>
          <p class="text-gray-600 mb-4">Parece que este restaurante aún no ha configurado su menú.</p>
        </div>
      </div>
    </div>

    <!-- Floating cart button -->
    <div 
      v-if="cartStore.totalItems > 0"
      class="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <button
        @click="mostrarCarrito = true"
        class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-2xl shadow-xl flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <div class="flex items-center space-x-3">
          <div class="bg-orange-600/50 backdrop-blur-sm text-white text-sm rounded-full h-8 w-8 flex items-center justify-center font-bold">
            {{ cartStore.totalItems }}
          </div>
          <div class="text-left">
            <span class="font-semibold block">Ver carrito</span>
            <span class="text-orange-100 text-xs">{{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'item' : 'items' }}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="font-bold text-lg">€{{ cartStore.total.toFixed(2) }}</span>
          <div class="flex items-center text-orange-100 text-xs">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            Pedir ahora
          </div>
        </div>
      </button>
    </div>

    <!-- Cart modal -->
    <CarritoModal
      v-if="mostrarCarrito"
      :restaurant="restaurantStore.currentRestaurant"
      :mesa="numeroMesa"
      @close="mostrarCarrito = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurantStore } from '@/stores/restaurant'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'

// Importamos los componentes que vamos a usar
import PlatoCardCliente from '@/components/menu/PlatoCardCliente.vue'
import CarritoModal from '@/components/menu/CarritoModal.vue'

// Inicializamos los stores y composables
const route = useRoute()
const restaurantStore = useRestaurantStore()
const cartStore = useCartStore()
const { showToast } = useToast()

// Estado local de la vista
const mostrarCarrito = ref(false)
const activeCategoryId = ref('')

// Obtenemos los parámetros de la ruta de forma reactiva
const restauranteId = computed(() => route.params.restaurante_id as string)
const numeroMesa = computed(() => route.params.mesa as string | undefined)

// --- MÉTODOS ---

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
    
    // Feedback para el usuario
    if (navigator.vibrate) navigator.vibrate(50)
    showToast(`🍽️ ${plato.nombre} añadido al carrito`, 'success')
    
  } catch (err) {
    console.error('❌ Error añadiendo al carrito:', err)
    showToast('Error al añadir al carrito', 'error')
  }
}

const scrollToCategory = (categoriaId: string) => {
  const element = document.getElementById(`categoria-${categoriaId}`)
  if (element) {
    const offset = 140 // Ajusta este valor según la altura de tus headers fijos
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// --- LÓGICA DEL INTERSECTION OBSERVER ---

let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  // Limpiamos el observer anterior si existe
  if (observer) observer.disconnect()

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
      root: null, // Observa la intersección con el viewport
      rootMargin: '-140px 0px -50% 0px', // Ajusta el margen para activar la categoría correcta
      threshold: 0.1 // Un umbral bajo para que se active pronto
    }
  )

  // Observamos cada una de las secciones de categoría
  restaurantStore.categorias.forEach((categoria) => {
    const element = document.getElementById(`categoria-${categoria.id}`)
    if (element) {
      observer?.observe(element)
    }
  })
}

// --- CICLO DE VIDA DEL COMPONENTE ---

onMounted(async () => {
  console.log('🍽️ MenuDigitalView montado para cliente')
  
  // Llamamos a la acción de nuestro store optimizado
  await restaurantStore.loadMenu(restauranteId.value)
  
  // Inicializamos el carrito para esta mesa
  cartStore.initializeCart(restauranteId.value, numeroMesa.value)
  
  // Una vez que los datos están cargados y el DOM se ha actualizado,
  // configuramos el Intersection Observer.
  if (!restaurantStore.error) {
    await nextTick() // Esperamos a que Vue renderice los elementos
    setupIntersectionObserver()
  }
})

onBeforeUnmount(() => {
  // Es una buena práctica limpiar los observers cuando el componente se destruye
  if (observer) {
    observer.disconnect()
    console.log('🧹 IntersectionObserver desconectado')
  }
})
</script>

<style scoped>
/* Estos estilos ya los tenías y están perfectos */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>