<template>
  <div class="bg-white border-b border-gray-100 px-4 py-4 flex space-x-4">
    <!-- Imagen del plato -->
    <div class="flex-shrink-0">
      <div class="relative">
        <img 
          v-if="plato.url_imagen" 
          :src="plato.url_imagen" 
          :alt="plato.nombre"
          class="w-20 h-20 rounded-lg object-cover"
          @error="onImageError"
        >
        <div v-else class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <!-- Badges -->
        <div class="absolute -top-2 -left-2 flex flex-col space-y-1">
          <span v-if="plato.es_nuevo" class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Nuevo
          </span>
          <span v-if="plato.es_recomendado" class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            ⭐
          </span>
        </div>
        
        <!-- Indicador de no disponible -->
        <div v-if="!plato.esta_disponible" class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <span class="text-white text-xs font-medium">No disponible</span>
        </div>
      </div>
    </div>

    <!-- Contenido del plato -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <!-- Nombre y descripción -->
          <h3 class="text-lg font-medium text-gray-900 truncate">{{ plato.nombre }}</h3>
          <p v-if="plato.descripcion" class="text-sm text-gray-600 mt-1 line-clamp-2">
            {{ plato.descripcion }}
          </p>
          
          <!-- Información adicional -->
          <div class="flex items-center space-x-3 mt-2">
            <!-- Tiempo de preparación -->
            <div v-if="plato.tiempo_preparacion" class="flex items-center text-xs text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ plato.tiempo_preparacion }} min
            </div>
            
            <!-- Calorías -->
            <div v-if="plato.calorias" class="flex items-center text-xs text-gray-500">
              <span>{{ plato.calorias }} cal</span>
            </div>
          </div>

          <!-- Tags dietéticos -->
          <div class="flex flex-wrap gap-1 mt-2">
            <span v-if="plato.es_vegano" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              🌱 Vegano
            </span>
            <span v-if="plato.es_vegetariano && !plato.es_vegano" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              🥬 Vegetariano
            </span>
            <span v-if="plato.es_sin_gluten" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Sin gluten
            </span>
          </div>

          <!-- Alérgenos -->
          <div v-if="plato.alergenos && plato.alergenos.length > 0" class="mt-2">
            <button 
              @click="mostrarAlergenos = !mostrarAlergenos"
              class="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              {{ mostrarAlergenos ? 'Ocultar' : 'Ver' }} alérgenos ({{ plato.alergenos.length }})
            </button>
            <div v-if="mostrarAlergenos" class="mt-1">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="alergeno in plato.alergenos" 
                  :key="alergeno"
                  class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                >
                  {{ alergeno }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Precio y botón -->
        <div class="ml-4 flex flex-col items-end space-y-2">
          <!-- Precio -->
          <div class="text-right">
            <span v-if="plato.precio_oferta" class="text-lg font-bold text-orange-600">
              €{{ plato.precio_oferta.toFixed(2) }}
            </span>
            <span 
              :class="[
                'text-lg font-bold',
                plato.precio_oferta ? 'text-gray-400 line-through text-sm ml-1' : 'text-gray-900'
              ]"
            >
              €{{ plato.precio.toFixed(2) }}
            </span>
          </div>

          <!-- Botón de agregar -->
          <button
            v-if="plato.esta_disponible"
            @click="handleAddToCart"
            :disabled="loading"
            class="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
          >
            {{ loading ? '...' : 'Añadir' }}
          </button>
          
          <button
            v-else
            disabled
            class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed min-w-[80px]"
          >
            No disponible
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Plato {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  precio_oferta?: number
  url_imagen?: string
  alergenos?: string[]
  ingredientes?: string[]
  calorias?: number
  tiempo_preparacion?: number
  esta_disponible: boolean
  es_vegano?: boolean
  es_vegetariano?: boolean
  es_sin_gluten?: boolean
  es_recomendado?: boolean
  es_nuevo?: boolean
}

interface Props {
  plato: Plato
}

interface Emits {
  (e: 'add-to-cart', plato: Plato, cantidad?: number, personalizaciones?: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local
const loading = ref(false)
const mostrarAlergenos = ref(false)

// Métodos
const handleAddToCart = async () => {
  if (!props.plato.esta_disponible || loading.value) return
  
  try {
    loading.value = true
    
    // Si el plato tiene variantes, aquí podrías abrir un modal
    // Por ahora, simplemente emitimos el evento
    emit('add-to-cart', props.plato, 1)
    
    // Feedback visual
    setTimeout(() => {
      loading.value = false
    }, 300)
  } catch (error) {
    console.error('Error adding to cart:', error)
    loading.value = false
  }
}

const onImageError = (event: Event) => {
  // Ocultar imagen si falla la carga
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>