<template>
  <div 
    :class="[
      'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300',
      !plato.esta_disponible && 'opacity-60',
      addingToCart && 'scale-105 shadow-lg'
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

      <!-- Stock limitado -->
      <div v-if="plato.stock_limitado && plato.cantidad_stock <= 5 && plato.esta_disponible" 
           class="absolute top-2 right-2">
        <span class="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
          Solo {{ plato.cantidad_stock }} left
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

      <!-- Alérgenos (solo si hay) -->
      <div v-if="plato.alergenos && plato.alergenos.length > 0" class="mb-3">
        <button 
          @click="mostrarAlergenos = !mostrarAlergenos"
          class="text-xs text-red-600 font-medium flex items-center"
        >
          ⚠️ Contiene alérgenos
          <svg :class="['w-3 h-3 ml-1 transition-transform', mostrarAlergenos && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="mostrarAlergenos" class="mt-2 flex flex-wrap gap-1">
          <span 
            v-for="alergeno in plato.alergenos" 
            :key="alergeno"
            class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
          >
            {{ alergeno }}
          </span>
        </div>
      </div>

      <!-- Variantes/Personalizaciones -->
      <div v-if="plato.tiene_variantes || tienePersonalizaciones" class="mb-4">
        <button 
          @click="mostrarPersonalizaciones = !mostrarPersonalizaciones"
          class="w-full text-left text-sm text-orange-600 font-medium flex items-center justify-between p-2 bg-orange-50 rounded-lg"
        >
          <span>
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Personalizar pedido
          </span>
          <svg :class="['w-4 h-4 transition-transform', mostrarPersonalizaciones && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Panel de personalización -->
        <div v-if="mostrarPersonalizaciones" class="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
          <!-- Punto de cocción (para carnes) -->
          <div v-if="esCarne" class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Punto de cocción:</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="punto in puntosCoccion"
                :key="punto.value"
                @click="selectedCoccion = punto.value"
                :class="[
                  'px-3 py-2 text-sm rounded-lg border transition-colors',
                  selectedCoccion === punto.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                ]"
              >
                {{ punto.label }}
              </button>
            </div>
          </div>

          <!-- Modificaciones de ingredientes -->
          <div v-if="plato.ingredientes && plato.ingredientes.length > 0" class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Modificar ingredientes:</label>
            <div class="space-y-2">
              <label 
                v-for="ingrediente in plato.ingredientes.slice(0, 5)"
                :key="ingrediente"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="ingrediente"
                  v-model="ingredientesExcluidos"
                  class="rounded text-orange-500 focus:ring-orange-500"
                >
                <span class="text-sm text-gray-700">Sin {{ ingrediente.toLowerCase() }}</span>
              </label>
            </div>
          </div>

          <!-- Notas especiales -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Notas especiales:</label>
            <textarea
              v-model="notasEspeciales"
              placeholder="Ej: Extra picante, sin sal, etc."
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Selector de cantidad y botón agregar -->
      <div class="flex items-center space-x-3">
        <!-- Selector de cantidad -->
        <div class="flex items-center bg-gray-100 rounded-lg overflow-hidden">
          <button
            @click="decrementarCantidad"
            :disabled="cantidad <= 1"
            class="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{{ cantidad }}</span>
          <button
            @click="incrementarCantidad"
            :disabled="plato.stock_limitado && cantidad >= plato.cantidad_stock"
            class="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        <!-- Botón agregar al carrito -->
        <button
          @click="agregarAlCarrito"
          :disabled="!plato.esta_disponible || addingToCart"
          :class="[
            'flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-2',
            plato.esta_disponible && !addingToCart
              ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <svg v-if="addingToCart" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          <span>
            {{ addingToCart ? 'Agregando...' : 'Agregar' }}
            <span v-if="cantidad > 1" class="ml-1">({{ cantidad }})</span>
          </span>
        </button>
      </div>

      <!-- Precio total si cantidad > 1 -->
      <div v-if="cantidad > 1" class="mt-2 text-center">
        <span class="text-sm text-gray-600">Total: </span>
        <span class="text-lg font-bold text-orange-600">
          €{{ (precioFinal * cantidad).toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
}

interface Props {
  plato: Plato
}

interface Emits {
  (e: 'add-to-cart', plato: Plato, cantidad: number, personalizaciones?: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local
const cantidad = ref(1)
const addingToCart = ref(false)
const mostrarAlergenos = ref(false)
const mostrarPersonalizaciones = ref(false)

// Personalización
const selectedCoccion = ref('')
const ingredientesExcluidos = ref<string[]>([])
const notasEspeciales = ref('')

// Computed
const precioFinal = computed(() => props.plato.precio_oferta || props.plato.precio)

const esCarne = computed(() => {
  const nombreLower = props.plato.nombre.toLowerCase()
  const descripcionLower = props.plato.descripcion?.toLowerCase() || ''
  const palabrasCarne = ['carne', 'beef', 'ternera', 'buey', 'filete', 'steak', 'hamburguesa', 'burger']
  return palabrasCarne.some(palabra => 
    nombreLower.includes(palabra) || descripcionLower.includes(palabra)
  )
})

const tienePersonalizaciones = computed(() => {
  return esCarne.value || (props.plato.ingredientes && props.plato.ingredientes.length > 0)
})

const puntosCoccion = [
  { value: 'muy_poco_hecho', label: 'Muy poco hecho' },
  { value: 'poco_hecho', label: 'Poco hecho' },
  { value: 'al_punto', label: 'Al punto' },
  { value: 'muy_hecho', label: 'Muy hecho' }
]

// Métodos
const incrementarCantidad = () => {
  if (!props.plato.stock_limitado || cantidad.value < props.plato.cantidad_stock) {
    cantidad.value++
  }
}

const decrementarCantidad = () => {
  if (cantidad.value > 1) {
    cantidad.value--
  }
}

const agregarAlCarrito = async () => {
  if (!props.plato.esta_disponible || addingToCart.value) return

  addingToCart.value = true

  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))

    const personalizaciones = {
      ...(selectedCoccion.value && { puntoCoccion: selectedCoccion.value }),
      ...(ingredientesExcluidos.value.length > 0 && { sinIngredientes: ingredientesExcluidos.value }),
      ...(notasEspeciales.value.trim() && { notas: notasEspeciales.value.trim() })
    }

    emit('add-to-cart', props.plato, cantidad.value, 
          Object.keys(personalizaciones).length > 0 ? personalizaciones : undefined)
    
    // Reset del formulario
    cantidad.value = 1
    selectedCoccion.value = ''
    ingredientesExcluidos.value = []
    notasEspeciales.value = ''
    mostrarPersonalizaciones.value = false
    
    // Feedback visual
    const element = document.querySelector(`[data-plato-id="${props.plato.id}"]`)
    if (element) {
      element.classList.add('animate-pulse')
      setTimeout(() => element.classList.remove('animate-pulse'), 600)
    }

  } catch (error) {
    console.error('Error agregando al carrito:', error)
  } finally {
    addingToCart.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.active\:scale-95:active {
  transform: scale(0.95);
}

/* Animación suave para el botón */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 0.6s ease-in-out;
}
</style>