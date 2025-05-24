<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Restaurant Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div v-if="restaurant" class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ restaurant.nombre }}</h1>
            <p class="text-sm text-gray-600">{{ restaurant.descripcion }}</p>
          </div>
          <button
            @click="openCart"
            class="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart class="h-6 w-6" />
            <span
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ itemCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Categories Navigation -->
    <nav class="bg-white shadow-sm sticky top-16 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
          <button
            v-for="categoria in categorias"
            :key="categoria.id"
            @click="scrollToCategory(categoria.id)"
            class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium"
            :class="currentCategory === categoria.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'"
          >
            {{ categoria.nombre }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Menu Categories -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>

      <template v-else>
        <div class="space-y-8">
          <section 
            v-for="categoria in categorias" 
            :key="categoria.id"
            :id="categoria.id"
            class="space-y-4 scroll-mt-32"
          >
            <h2 class="text-xl font-semibold text-gray-900">{{ categoria.nombre }}</h2>
            
            <div class="grid grid-cols-1 gap-4">
              <div
                v-for="plato in platosPorCategoria(categoria.id)"
                :key="plato.id"
                class="bg-white rounded-lg shadow-sm overflow-hidden flex"
              >
                <img
                  v-if="plato.url_imagen"
                  :src="plato.url_imagen"
                  :alt="plato.nombre"
                  class="w-24 h-24 object-cover"
                />
                
                <div class="flex-1 p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-base font-medium text-gray-900">{{ plato.nombre }}</h3>
                      <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ plato.descripcion }}</p>
                      <p class="mt-1 text-sm font-semibold text-orange-500">{{ formatPrice(plato.precio) }}€</p>
                    </div>
                    <div class="flex flex-col items-end space-y-2">
                      <div class="flex items-center space-x-2">
                        <button
                          @click="decrementQuantity(plato)"
                          class="p-1 text-gray-500 hover:text-gray-700"
                          :disabled="!getItemQuantity(plato.id)"
                        >
                          <Minus class="h-5 w-5" />
                        </button>
                        <span class="text-gray-700 w-8 text-center">
                          {{ getItemQuantity(plato.id) }}
                        </span>
                        <button
                          @click="incrementQuantity(plato)"
                          class="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus class="h-5 w-5" />
                        </button>
                      </div>
                      
                      <button
                        v-if="!getItemQuantity(plato.id)"
                        @click="addToCart(plato)"
                        class="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>
    </main>

    <!-- Cart Modal -->
    <AppModal
      :is-open="isCartOpen"
      title="Tu pedido"
      @close="closeCart"
      size="lg"
    >
      <div v-if="items.length === 0" class="text-center py-8">
        <ShoppingCart class="h-12 w-12 mx-auto text-gray-400" />
        <p class="mt-4 text-gray-600">Tu carrito está vacío</p>
      </div>

      <div v-else class="space-y-6">
        <div class="space-y-4">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="flex justify-between items-center"
          >
            <div>
              <h4 class="font-medium text-gray-900">{{ item.nombre }}</h4>
              <p class="text-sm text-gray-500">{{ formatPrice(item.precio) }}€ x {{ item.cantidad }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <p class="font-medium text-gray-900">
                {{ formatPrice(item.precio * item.cantidad) }}€
              </p>
              <button
                @click="removeItem(index)"
                class="text-gray-400 hover:text-gray-600"
              >
                <Trash2 class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>{{ formatPrice(total) }}€</span>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="closeCart"
          class="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Seguir comprando
        </button>
        <button
          v-if="items.length > 0"
          @click="checkout"
          class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Realizar pedido
        </button>
      </template>
    </AppModal>

    <!-- Fixed Cart Button for Mobile -->
    <div 
      v-if="itemCount > 0"
      class="fixed bottom-4 left-4 right-4 md:hidden"
    >
      <button
        @click="openCart"
        class="w-full bg-orange-500 text-white rounded-full py-3 px-6 flex items-center justify-between shadow-lg"
      >
        <span class="font-medium">Ver pedido ({{ itemCount }})</span>
        <span class="font-medium">{{ formatPrice(total) }}€</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useRestaurantStore } from '@/stores/restaurant'
import AppModal from '@/components/ui/AppModal.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const restaurantStore = useRestaurantStore()

const { items, total, itemCount } = storeToRefs(cartStore)
const { addItem, removeItem, clearCart, setRestaurante, setMesa } = cartStore
const { currentRestaurant: restaurant, menu, loading } = storeToRefs(restaurantStore)
const { loadRestaurant, loadMenu } = restaurantStore

const isCartOpen = ref(false)
const currentCategory = ref('')
const restauranteId = route.params.restauranteId as string
const mesa = route.params.mesa as string | undefined

let restaurantChannel: any
let menuChannel: any

onMounted(async () => {
  setRestaurante(restauranteId)
  if (mesa) setMesa(mesa)
  
  restaurantChannel = await loadRestaurant(restauranteId)
  menuChannel = await loadMenu(restauranteId)

  // Intersection Observer for category headers
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentCategory.value = entry.target.id
      }
    })
  }, { threshold: 0.5, rootMargin: '-20% 0px -80% 0px' })

  // Observe all category sections
  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section)
  })
})

onUnmounted(() => {
  if (restaurantChannel) restaurantChannel.unsubscribe()
  if (menuChannel) menuChannel.unsubscribe()
})

const categorias = computed(() => {
  const cats = new Set(menu.value.map(item => item.categoria_id))
  return Array.from(cats).map(id => {
    const plato = menu.value.find(p => p.categoria_id === id)
    return {
      id,
      nombre: plato?.categoria_nombre || ''
    }
  })
})

const platosPorCategoria = (categoriaId: string) => {
  return menu.value.filter(plato => plato.categoria_id === categoriaId)
}

const scrollToCategory = (categoryId: string) => {
  const element = document.getElementById(categoryId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const getItemQuantity = (platoId: string) => {
  const item = items.value.find(i => i.id === platoId)
  return item ? item.cantidad : 0
}

const incrementQuantity = (plato: any) => {
  addItem({
    id: plato.id,
    nombre: plato.nombre,
    precio: plato.precio,
    cantidad: 1
  })
}

const decrementQuantity = (plato: any) => {
  const item = items.value.find(i => i.id === plato.id)
  if (item) {
    if (item.cantidad > 1) {
      item.cantidad--
    } else {
      removeItem(items.value.indexOf(item))
    }
  }
}

const formatPrice = (price: number) => {
  return price.toFixed(2)
}

const openCart = () => {
  isCartOpen.value = true
}

const closeCart = () => {
  isCartOpen.value = false
}

const checkout = async () => {
  if (!items.value.length) return
  
  try {
    // Here we'll implement the checkout logic in the next step
    console.log('Procesando pedido...')
  } catch (error) {
    console.error('Error al procesar el pedido:', error)
  }
}
</script>

<style>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>