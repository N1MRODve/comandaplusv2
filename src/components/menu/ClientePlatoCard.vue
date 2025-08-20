<template>
  <div
    :data-plato-id="plato.id"
    :class="[
      'bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:scale-[1.02]',
      !plato.esta_disponible && 'opacity-60 grayscale'
    ]"
  >
    <div class="relative">
      <!-- Enhanced image section -->
      <div class="relative aspect-[4/3] overflow-hidden">
        <img
          v-if="plato.url_imagen"
          :src="plato.url_imagen"
          :alt="plato.nombre"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-3xl">🍽️</span>
            </div>
            <p class="text-sm text-orange-600 font-medium">Imagen próximamente</p>
          </div>
        </div>
        
        <!-- Enhanced badges -->
        <div class="absolute top-3 left-3 flex flex-col space-y-2">
          <span v-if="plato.es_nuevo" class="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
            ✨ Nuevo
          </span>
          <span v-if="plato.es_recomendado" class="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
            ⭐ Popular
          </span>
          <span v-if="plato.precio_oferta" class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
            🔥 Oferta
          </span>
        </div>

        <!-- Availability overlay -->
        <div v-if="!plato.esta_disponible" class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <div class="text-center">
            <div class="bg-red-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg">
              Temporalmente agotado
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced content section -->
      <div class="p-6">
        <!-- Header with name and price -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 mr-4">
            <h3 class="font-bold text-gray-900 text-xl leading-tight mb-2">
              {{ plato.nombre }}
            </h3>
            <p v-if="plato.descripcion" class="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {{ plato.descripcion }}
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <div v-if="plato.precio_oferta" class="space-y-1">
              <span class="text-2xl font-black text-red-600">
                €{{ plato.precio_oferta.toFixed(2) }}
              </span>
              <div class="text-base text-gray-500 line-through">
                €{{ plato.precio.toFixed(2) }}
              </div>
            </div>
            <span v-else class="text-2xl font-black text-gray-900">
              €{{ plato.precio.toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Enhanced characteristics -->
        <div class="flex items-center space-x-4 mb-4 text-sm text-gray-500">
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

        <!-- Enhanced diet badges -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span v-if="plato.es_vegano" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            🌱 Vegano
          </span>
          <span v-if="plato.es_vegetariano && !plato.es_vegano" class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            🥬 Vegetariano
          </span>
          <span v-if="plato.es_sin_gluten" class="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">
            🌾 Sin gluten
          </span>
        </div>

        <!-- Enhanced add to cart button -->
        <button
          @click="$emit('add-to-cart', plato)"
          :disabled="!plato.esta_disponible"
          :class="[
            'w-full px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg',
            plato.esta_disponible
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 active:scale-95 hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          <span>{{ plato.esta_disponible ? 'Añadir al carrito' : 'No disponible' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  plato: {
    id: string
    nombre: string
    descripcion?: string
    precio: number
    precio_oferta?: number
    url_imagen?: string
    esta_disponible: boolean
    tiempo_preparacion: number
    calorias?: number
    es_vegano: boolean
    es_vegetariano: boolean
    es_sin_gluten: boolean
    es_nuevo: boolean
    es_recomendado: boolean
  }
}>()

defineEmits(['add-to-cart'])
</script>

<style scoped>
/* Enhanced line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced grayscale effect */
.grayscale {
  filter: grayscale(100%);
}

/* Custom hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Enhanced active state */
.active\:scale-95:active {
  transform: scale(0.95);
}
</style>