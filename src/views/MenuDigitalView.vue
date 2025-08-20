<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <img 
              v-if="restaurantStore.currentRestaurant?.url_logo" 
              :src="restaurantStore.currentRestaurant.url_logo" 
              :alt="restaurantStore.currentRestaurant.nombre"
              class="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 shadow-sm"
            >
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg" v-else>
              <span class="text-white font-bold text-xl">{{ restaurantStore.currentRestaurant?.nombre?.charAt(0) || 'C' }}</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ restaurantStore.currentRestaurant?.nombre || 'Cargando...' }}</h1>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span v-if="numeroMesa" class="font-semibold text-orange-600">Mesa {{ numeroMesa }}</span>
                <span v-else class="text-orange-600 font-medium">Escanea el QR de tu mesa</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="mostrarCarrito = true"
            :class="[
              'relative p-3 rounded-2xl shadow-lg transition-all duration-300 transform',
              cartStore.totalItems > 0 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:scale-110 shadow-orange-200' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" /></svg>
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-bold shadow-lg animate-pulse"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="restaurantStore.loading" class="flex justify-center items-center py-16">
      <div class="text-center">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Cargando menú delicioso...</h3>
        <p class="text-gray-600">Preparando la mejor experiencia gastronómica</p>
      </div>
    </div>

    <div v-else-if="restaurantStore.error" class="text-center py-16 px-4">
      <div class="max-w-sm mx-auto">
        <div class="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">¡Ups! Algo salió mal</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">{{ restaurantStore.error }}</p>
        <button 
          @click="restaurantStore.loadMenu(restauranteId)"
          class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reintentar
        </button>
      </div>
    </div>

    <div v-else>
      <div v-if="restaurantStore.categorias.length > 0" class="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-[88px] z-30 shadow-sm">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex space-x-3 overflow-x-auto scrollbar-hide">
            <button
              v-for="categoria in restaurantStore.categorias"
              :key="categoria.id"
              @click="scrollToCategory(categoria.id)"
              :class="[
                'flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap shadow-sm',
                activeCategoryId === categoria.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-gray-200'
              ]"
            >
              <span v-if="categoria.icono" class="mr-2 text-lg">{{ categoria.icono }}</span>
              {{ categoria.nombre }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="restaurantStore.categorias.length > 0" class="max-w-md mx-auto pb-32">
        <div
          v-for="categoria in restaurantStore.categorias"
          :key="categoria.id"
          :id="`categoria-${categoria.id}`"
          class="mb-12"
        >
          <div class="px-6 py-8 bg-gradient-to-r from-white to-gray-50 border-b-4 border-orange-200">
            <h2 class="text-3xl font-black text-gray-900 flex items-center mb-2">
              <span v-if="categoria.icono" class="mr-4 text-4xl">{{ categoria.icono }}</span>
              {{ categoria.nombre }}
            </h2>
            <p v-if="categoria.descripcion" class="text-gray-600 text-base leading-relaxed">
              {{ categoria.descripcion }}
            </p>
          </div>

          <div class="px-6 pt-6 space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <ClientePlatoCard
                v-for="plato in categoria.platos"
                :key="plato.id"
                :plato="plato"
                @add-to-cart="agregarAlCarrito"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20 px-6">
        <div class="max-w-sm mx-auto">
          <div class="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Menú no disponible</h3>
          <p class="text-gray-600 mb-8 leading-relaxed">Parece que este restaurante aún no ha configurado su menú digital.</p>
          <div class="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <p class="text-orange-800 text-sm font-medium">
              💡 Si eres el propietario, accede al panel de administración para configurar tu menú.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating cart button with enhanced design -->
    <div 
      v-if="cartStore.totalItems > 0"
      class="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <button
        @click="mostrarCarrito = true"
        class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 px-6 rounded-3xl shadow-2xl flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-orange-400"
      >
        <div class="flex items-center space-x-4">
          <div class="bg-orange-600/30 backdrop-blur-sm text-white text-base rounded-2xl h-12 w-12 flex items-center justify-center font-bold shadow-lg">
            {{ cartStore.totalItems }}
          </div>
          <div class="text-left">
            <span class="font-bold block text-lg">Ver carrito</span>
            <span class="text-orange-100 text-sm">{{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'producto' : 'productos' }}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="font-black text-2xl">€{{ cartStore.total.toFixed(2) }}</span>
          <div class="flex items-center text-orange-100 text-sm font-medium">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            Pedir ahora
          </div>
        </div>
      </button>
    </div>

    <!-- Enhanced cart modal -->
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
import ClientePlatoCard from '@/components/menu/ClientePlatoCard.vue'
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

const agregarAlCarrito = (plato: any) => {
  try {
    cartStore.addItem({
      id: plato.id,
      nombre: plato.nombre,
      precio: plato.precio_oferta || plato.precio,
      imagen: plato.url_imagen,
      categoria: plato.categoria_nombre,
    }, 1)
    
    // Enhanced feedback
    if (navigator.vibrate) navigator.vibrate([50, 30, 50])
    showToast(`🍽️ ${plato.nombre} añadido al carrito`, 'success')
    
    // Visual feedback on the card
    const cardElement = document.querySelector(`[data-plato-id="${plato.id}"]`)
    if (cardElement) {
      cardElement.classList.add('animate-pulse')
      setTimeout(() => cardElement.classList.remove('animate-pulse'), 600)
    }
    
  } catch (err) {
    console.error('❌ Error añadiendo al carrito:', err)
    showToast('Error al añadir al carrito', 'error')
  }
}

const scrollToCategory = (categoriaId: string) => {
  const element = document.getElementById(`categoria-${categoriaId}`)
  if (element) {
    const offset = 160 // Increased offset for better positioning
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
      rootMargin: '-160px 0px -50% 0px', // Adjusted for new header height
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
/* Enhanced styles */
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

/* Enhanced animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Custom shadows */
.shadow-orange-200 {
  box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.3);
}

/* Improved transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
              v-for="plato in categoria.platos"
              :key="plato.id"
              :plato="plato"
              @add-to-cart="agregarAlCarrito"
            />
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-16 px-4">
        <div class="max-w-sm mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Menú no disponible</h3>
          <p class="text-gray-600 mb-6">Parece que este restaurante aún no ha configurado su menú.</p>
        </div>
      </div>
    </div>

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
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            Pedir ahora
          </div>
        </div>
      </button>
    </div>

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
import ClientePlatoCard from '@/components/menu/ClientePlatoCard.vue'
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

const agregarAlCarrito = (plato: any) => {
  try {
    cartStore.addItem({
      id: plato.id,
      nombre: plato.nombre,
      precio: plato.precio_oferta || plato.precio,
      imagen: plato.url_imagen,
      categoria: plato.categoria_nombre,
    }, 1)
    
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