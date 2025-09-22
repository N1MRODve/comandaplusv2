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
              <h1 class="text-lg font-semibold text-gray-900">Restaurante Demo</h1>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span class="font-medium">Mesa 5</span>
                <span class="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">DEMO</span>
              </div>
            </div>
          </div>
          
          <button 
            @click="mostrarCarrito = true"
            :class="[
              'relative p-3 rounded-full shadow-lg transition-all duration-300 transform',
              carritoItems.length > 0 
                ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <span 
              v-if="carritoItems.length > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg"
            >
              {{ carritoItems.length }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navegación de categorías -->
    <div v-if="menuData.categorias.length > 0" class="bg-white border-b sticky top-[88px] z-30 shadow-sm">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="categoria in menuData.categorias"
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
    <div class="max-w-md mx-auto pb-32">
      <div
        v-for="categoria in menuData.categorias"
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
          <div
            v-for="plato in categoria.platos"
            :key="plato.id"
            :class="[
              'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300',
              !plato.esta_disponible && 'opacity-60',
              agregandoAlCarrito === plato.id && 'scale-105 shadow-lg'
            ]"
          >
            <!-- Imagen del plato -->
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                v-if="plato.url_imagen"
                :src="plato.url_imagen"
                :alt="plato.nombre"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span class="text-xl">🍽️</span>
                  </div>
                  <p class="text-xs text-gray-500 font-medium">Sin imagen</p>
                </div>
              </div>

              <!-- Badges de estado -->
              <div class="absolute top-2 left-2 flex flex-col space-y-1">
                <span v-if="plato.es_nuevo" class="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm">
                  ✨ Nuevo
                </span>
                <span v-if="plato.es_recomendado" class="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                  ⭐ Popular
                </span>
                <span v-if="plato.precio_oferta" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                  🔥 Oferta
                </span>
              </div>

              <!-- Estado de disponibilidad -->
              <div v-if="!plato.esta_disponible" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span class="px-4 py-2 bg-red-500 text-white font-bold rounded-lg text-sm">
                  Temporalmente agotado
                </span>
              </div>
            </div>

            <!-- Contenido de la tarjeta -->
            <div class="p-4">
              <!-- Header con nombre y precio -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 mr-3">
                  <h3 class="font-bold text-gray-900 text-lg leading-tight">
                    {{ plato.nombre }}
                  </h3>
                  <p v-if="plato.descripcion" class="text-gray-600 text-sm mt-1 line-clamp-2">
                    {{ plato.descripcion }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <div v-if="plato.precio_oferta" class="space-y-1">
                    <span class="text-xl font-black text-red-600">
                      €{{ plato.precio_oferta.toFixed(2) }}
                    </span>
                    <div class="text-sm text-gray-500 line-through">
                      €{{ plato.precio.toFixed(2) }}
                    </div>
                  </div>
                  <span v-else class="text-xl font-black text-gray-900">
                    €{{ plato.precio.toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Información rápida -->
              <div class="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ plato.tiempo_preparacion }} min
                </div>
                <div v-if="plato.calorias" class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  {{ plato.calorias }} kcal
                </div>
              </div>

              <!-- Badges de dieta -->
              <div class="flex flex-wrap gap-1 mb-3">
                <span v-if="plato.es_vegano" class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  🌱 Vegano
                </span>
                <span v-if="plato.es_vegetariano && !plato.es_vegano" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  🥬 Vegetariano
                </span>
                <span v-if="plato.es_sin_gluten" class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  🌾 Sin gluten
                </span>
              </div>

              <!-- Botón agregar al carrito -->
              <button
                @click="agregarAlCarrito(plato)"
                :disabled="!plato.esta_disponible || agregandoAlCarrito === plato.id"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-2',
                  plato.esta_disponible && agregandoAlCarrito !== plato.id
                    ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <svg v-if="agregandoAlCarrito === plato.id" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
                <span>
                  {{ agregandoAlCarrito === plato.id ? 'Agregando...' : 'Agregar al carrito' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón flotante del carrito -->
    <div 
      v-if="carritoItems.length > 0"
      class="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <button
        @click="mostrarCarrito = true"
        class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-2xl shadow-xl flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <div class="flex items-center space-x-3">
          <div class="bg-orange-600/50 backdrop-blur-sm text-white text-sm rounded-full h-8 w-8 flex items-center justify-center font-bold">
            {{ carritoItems.length }}
          </div>
          <div class="text-left">
            <span class="font-semibold block">Ver carrito</span>
            <span class="text-orange-100 text-xs">{{ carritoItems.length }} {{ carritoItems.length === 1 ? 'item' : 'items' }}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="font-bold text-lg">€{{ totalCarrito.toFixed(2) }}</span>
          <div class="flex items-center text-orange-100 text-xs">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            Pedir ahora
          </div>
        </div>
      </button>
    </div>

    <!-- Modal del carrito -->
    <div v-if="mostrarCarrito" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-xl max-w-md w-full max-h-[95vh] flex flex-col">
        <div class="flex items-center justify-between p-4 border-b">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              Tu pedido (Demo)
            </h2>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span>Restaurante Demo</span>
              <span>•</span>
              <span>Mesa 5</span>
            </div>
          </div>
          <button 
            @click="mostrarCarrito = false"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="carritoItems.length > 0" class="p-4 space-y-4">
            <div 
              v-for="(item, index) in carritoItems" 
              :key="`${item.id}-${index}`"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div class="flex space-x-3">
                <img 
                  v-if="item.url_imagen" 
                  :src="item.url_imagen" 
                  :alt="item.nombre"
                  class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                >
                <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span class="text-2xl">🍽️</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-medium text-gray-900">{{ item.nombre }}</h4>
                    <button 
                      @click="eliminarDelCarrito(index)"
                      class="text-red-500 hover:text-red-700 p-1 -mt-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">€{{ item.precio.toFixed(2) }} c/u</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                      <button 
                        @click="actualizarCantidad(index, item.cantidad - 1)"
                        class="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{{ item.cantidad }}</span>
                      <button 
                        @click="actualizarCantidad(index, item.cantidad + 1)"
                        class="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <div class="text-right">
                      <span class="font-bold text-lg text-gray-900">€{{ (item.precio * item.cantidad).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3>
            <p class="text-gray-500 mb-4">Añade algunos platos para comenzar tu pedido</p>
          </div>
        </div>

        <div v-if="carritoItems.length > 0" class="border-t bg-white p-4 space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total</span>
              <span>€{{ totalCarrito.toFixed(2) }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <button 
              @click="realizarPedidoDemo"
              class="w-full bg-orange-500 text-white py-4 px-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
            >
              <span>Pedir ahora • €{{ totalCarrito.toFixed(2) }} (DEMO)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado del pedido -->
    <div v-if="pedidoRealizado && pedidoActual" class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">¡Gracias por tu pedido!</h2>
      <p class="text-gray-600 mb-6">Estamos preparando tu comida. Puedes ver el estado a continuación:</p>
      <div class="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
        <span class="text-lg font-semibold text-blue-800">Estado:</span>
        <span class="ml-3 px-4 py-1 text-lg font-bold text-white rounded-full"
              :class="{
                'bg-gray-500': pedidoActual.estado === 'pendiente',
                'bg-orange-500': pedidoActual.estado === 'en_preparacion',
                'bg-green-500': pedidoActual.estado === 'listo',
                'bg-blue-500': pedidoActual.estado === 'entregado'
              }">
          {{ getEstadoTexto(pedidoActual.estado) }}
        </span>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex space-x-3 mt-6">
        <button
          @click="cerrarSeguimiento"
          class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cerrar seguimiento
        </button>
        <button
          v-if="pedidoActual.estado === 'entregado'"
          @click="pedidoCompletado = true; pedidoRealizado = false"
          class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
        >
          ¡Perfecto!
        </button>
      </div>
      
      <p class="text-center text-sm text-gray-500 mt-4">Esta ventana se actualizará automáticamente.</p>
    </div>

    <!-- Botón flotante para reabrir seguimiento -->
    <div 
      v-if="!pedidoRealizado && pedidoId && pedidoActual && pedidoActual.estado !== 'entregado'"
      class="fixed bottom-24 right-4 z-40"
    >
      <button
        @click="abrirSeguimiento"
        class="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
      </button>
    </div>

    <!-- Mensaje de pedido completado -->
    <div v-if="pedidoCompletado" class="max-w-md mx-auto mt-8 p-6 bg-green-50 rounded-lg shadow-md border border-green-200">
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-green-800 mb-2">¡Pedido completado!</h3>
        <p class="text-green-700 mb-4">Esperamos que hayas disfrutado tu comida</p>
        <button
          @click="pedidoCompletado = false; pedidoId = null"
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Hacer nuevo pedido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useDemoStore } from '@/demo/stores/useDemoStore'

const demoStore = useDemoStore()

// Estado local
const mostrarCarrito = ref(false)
const activeCategoryId = ref('')
const agregandoAlCarrito = ref<string | null>(null)
const carritoItems = ref<any[]>([])

// Estado del seguimiento de pedidos
const pedidoRealizado = ref(false)
const pedidoId = ref<number | null>(null)

// Creamos una propiedad computada que encontrará el pedido actual del cliente
// y se actualizará automáticamente cuando el store cambie.
const pedidoActual = computed(() => {
  if (!pedidoId.value) return null
  return demoStore.pedidos.find((p) => p.id === pedidoId.value)
})

// Estado del seguimiento de pedidos
const mostrandoSeguimiento = ref(false)
const pedidoCompletado = ref(false)

// Computed
const menuData = computed(() => demoStore.getMenuData())
const totalCarrito = computed(() => 
  carritoItems.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
)

// Estados del pedido para el timeline
const etapasPedido = computed(() => [
  {
    estado: 'pendiente',
    nombre: 'Pedido recibido',
    descripcion: 'Tu pedido ha sido confirmado'
  },
  {
    estado: 'confirmado',
    nombre: 'Confirmado',
    descripcion: 'El restaurante ha confirmado tu pedido'
  },
  {
    estado: 'en_preparacion',
    nombre: 'En preparación',
    descripcion: 'Los chefs están preparando tu comida'
  },
  {
    estado: 'listo',
    nombre: 'Listo para servir',
    descripcion: 'Tu pedido está listo, el camarero lo llevará pronto'
  },
  {
    estado: 'entregado',
    nombre: 'Entregado',
    descripcion: '¡Disfruta tu comida!'
  }
])

// Métodos
const scrollToCategory = (categoriaId: string) => {
  const element = document.getElementById(`categoria-${categoriaId}`)
  if (element) {
    const offset = 140
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const agregarAlCarrito = async (plato: any) => {
  if (!plato.esta_disponible || agregandoAlCarrito.value === plato.id) return

  agregandoAlCarrito.value = plato.id

  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))

    const itemExistente = carritoItems.value.find(item => item.id === plato.id)
    
    if (itemExistente) {
      itemExistente.cantidad++
    } else {
      carritoItems.value.push({
        id: plato.id,
        nombre: plato.nombre,
        precio: plato.precio_oferta || plato.precio,
        url_imagen: plato.url_imagen,
        cantidad: 1
      })
    }
    
    // Feedback visual
    mostrarNotificacion(`🍽️ ${plato.nombre} añadido al carrito`, 'success')
    
  } catch (error) {
    console.error('Error agregando al carrito:', error)
  } finally {
    agregandoAlCarrito.value = null
  }
}

const actualizarCantidad = (index: number, nuevaCantidad: number) => {
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(index)
  } else {
    carritoItems.value[index].cantidad = nuevaCantidad
  }
}

const eliminarDelCarrito = (index: number) => {
  carritoItems.value.splice(index, 1)
}

// Función realizarPedido modificada para activar el seguimiento
const realizarPedidoDemo = () => {
  if (carritoItems.value.length === 0) return
  
  // La función crearPedidoConSimulacion ahora devuelve el pedido que acaba de crear
  const nuevoPedido = demoStore.crearPedidoConSimulacion({
    numero_mesa: '5',
    cliente_nombre: 'Cliente Demo',
    items: carritoItems.value,
    subtotal: totalCarrito.value,
    total: totalCarrito.value,
    comensales: 2
  })
  
  pedidoId.value = nuevoPedido.id // Guardamos el ID
  pedidoRealizado.value = true // Activamos la UI de seguimiento
  
  carritoItems.value = []
  mostrarCarrito.value = false
  mostrarNotificacion(`¡Pedido ${nuevoPedido.numero_pedido} realizado con éxito! 🎉`, 'success')
}

// Funciones para el seguimiento
const cerrarSeguimiento = () => {
  mostrandoSeguimiento.value = false
  pedidoRealizado.value = false
}

const abrirSeguimiento = () => {
  if (pedidoActual.value) {
    mostrandoSeguimiento.value = true
    pedidoRealizado.value = true
  }
}

const getEstadoTexto = (estado: string) => {
  const estados = {
    'pendiente': 'Pedido recibido',
    'confirmado': 'Confirmado',
    'en_preparacion': 'En preparación',
    'listo': 'Listo para servir',
    'entregado': 'Entregado'
  }
  return estados[estado as keyof typeof estados] || estado
}

const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'warning' | 'error') => {
  const colores = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 ${colores[tipo]} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`
  notification.textContent = mensaje
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Intersection Observer para navegación
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
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
      root: null,
      rootMargin: '-140px 0px -50% 0px',
      threshold: 0.1
    }
  )

  menuData.value.categorias.forEach((categoria) => {
    const element = document.getElementById(`categoria-${categoria.id}`)
    if (element) {
      observer?.observe(element)
    }
  })
}

onMounted(async () => {
  await nextTick()
  setupIntersectionObserver()
})
</script>

<style scoped>
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