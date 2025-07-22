<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group',
      !plato.esta_disponible && 'opacity-50 grayscale'
    ]"
  >
    <div class="flex p-4 space-x-4">
      <div class="relative flex-shrink-0">
        <img
          v-if="plato.url_imagen"
          :src="plato.url_imagen"
          :alt="plato.nombre"
          class="w-24 h-24 rounded-lg object-cover"
          loading="lazy"
        />
        <div v-else class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-3xl text-gray-400">🍽️</span>
        </div>
        
        <span v-if="plato.precio_oferta" class="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg">
          OFERTA
        </span>
      </div>

      <div class="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-gray-800 text-base leading-tight truncate">
            {{ plato.nombre }}
          </h3>
          <p v-if="plato.descripcion" class="text-gray-500 text-sm mt-1 line-clamp-2">
            {{ plato.descripcion }}
          </p>
        </div>

        <div class="flex items-end justify-between mt-2">
          <div class="text-left">
            <div v-if="plato.precio_oferta" class="flex items-baseline space-x-1">
              <span class="text-lg font-black text-red-600">€{{ plato.precio_oferta.toFixed(2) }}</span>
              <span class="text-sm text-gray-400 line-through">€{{ plato.precio.toFixed(2) }}</span>
            </div>
            <span v-else class="text-lg font-black text-gray-800">€{{ plato.precio.toFixed(2) }}</span>
          </div>
          
          <button
            @click="$emit('add-to-cart', plato)"
            :disabled="!plato.esta_disponible"
            :class="[
              'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center space-x-2',
              plato.esta_disponible
                ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-sm'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" /></svg>
            <span>{{ plato.esta_disponible ? 'Añadir' : 'Agotado' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente recibe la información de un plato como una "prop"
defineProps<{
  plato: {
    id: string
    nombre: string
    descripcion?: string
    precio: number
    precio_oferta?: number
    url_imagen?: string
    esta_disponible: boolean
    // ...otros campos que quieras usar
  }
}>()

// Y "emite" un evento hacia el componente padre cuando se le da clic al botón
defineEmits(['add-to-cart'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>