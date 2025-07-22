<template>
  <div 
    :class="[
      'card-premium group cursor-pointer transition-all duration-300 hover:shadow-luxury hover:scale-[1.02]',
      !plato.esta_disponible && 'opacity-60 grayscale-50'
    ]"
  >
    <!-- Imagen del plato -->
    <div class="relative aspect-video overflow-hidden rounded-t-2xl">
      <img
        v-if="plato.url_imagen"
        :src="plato.url_imagen"
        :alt="plato.nombre"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-2">
            <span class="text-2xl">🍽️</span>
          </div>
          <p class="text-sm text-slate-500 font-medium">Sin imagen</p>
        </div>
      </div>

      <!-- Badges de estado -->
      <div class="absolute top-3 left-3 flex flex-col space-y-2">
        <span v-if="plato.es_nuevo" class="badge badge-info shadow-lg backdrop-blur-md">
          ✨ Nuevo
        </span>
        <span v-if="plato.es_recomendado" class="badge badge-warning shadow-lg backdrop-blur-md">
          ⭐ Recomendado
        </span>
        <span v-if="plato.precio_oferta" class="badge badge-danger shadow-lg backdrop-blur-md">
          🔥 Oferta
        </span>
      </div>

      <!-- Estado de disponibilidad -->
      <div class="absolute top-3 right-3">
        <button
          @click.stop="toggleDisponibilidad"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md transition-all duration-300',
            plato.esta_disponible
              ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
              : 'bg-red-500/90 text-white hover:bg-red-600'
          ]"
        >
          {{ plato.esta_disponible ? '✓ Disponible' : '✗ Agotado' }}
        </button>
      </div>

      <!-- Overlay con acciones rápidas -->
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="flex space-x-3">
          <button
            @click.stop="console.log('🔥 Botón Editar (overlay) clickeado, plato:', plato); $emit('editar', plato)"
            class="btn btn-sm bg-white/90 text-slate-900 hover:bg-white backdrop-blur-md"
          >
            <PencilIcon class="w-4 h-4 mr-1" />
            Editar
          </button>
          <button
            @click.stop="$emit('duplicar', plato.id)"
            class="btn btn-sm bg-amber-500/90 text-white hover:bg-amber-600 backdrop-blur-md"
          >
            <DocumentDuplicateIcon class="w-4 h-4 mr-1" />
            Duplicar
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido de la tarjeta -->
    <div class="p-6">
      <!-- Header con nombre y precio -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 mr-3">
          <h3 class="font-bold text-slate-900 text-lg leading-tight group-hover:text-amber-700 transition-colors">
            {{ plato.nombre }}
          </h3>
          <p v-if="plato.descripcion" class="text-slate-600 text-sm mt-1 line-clamp-2">
            {{ plato.descripcion }}
          </p>
        </div>
        <div class="text-right flex-shrink-0">
          <div v-if="plato.precio_oferta" class="space-y-1">
            <span class="text-2xl font-black text-red-600">
              €{{ plato.precio_oferta.toFixed(2) }}
            </span>
            <div class="text-sm text-slate-500 line-through">
              €{{ plato.precio.toFixed(2) }}
            </div>
          </div>
          <span v-else class="text-2xl font-black text-slate-900">
            €{{ plato.precio.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Características del plato -->
      <div class="flex items-center space-x-4 mb-4 text-sm">
        <div class="flex items-center text-slate-500">
          <ClockIcon class="w-4 h-4 mr-1" />
          {{ plato.tiempo_preparacion }} min
        </div>
        <div v-if="plato.calorias" class="flex items-center text-slate-500">
          <FireIcon class="w-4 h-4 mr-1" />
          {{ plato.calorias }} kcal
        </div>
      </div>

      <!-- Badges de dieta -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-if="plato.es_vegano" class="badge badge-success">
          🌱 Vegano
        </span>
        <span v-if="plato.es_vegetariano && !plato.es_vegano" class="badge badge-info">
          🥬 Vegetariano
        </span>
        <span v-if="plato.es_sin_gluten" class="badge badge-warning">
          🌾 Sin gluten
        </span>
      </div>

      <!-- Alérgenos -->
      <div v-if="plato.alergenos && plato.alergenos.length > 0" class="mb-4">
        <p class="text-xs font-semibold text-slate-700 mb-2">Alérgenos:</p>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="alergeno in plato.alergenos.slice(0, 3)" 
            :key="alergeno"
            class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
          >
            {{ alergeno }}
          </span>
          <span 
            v-if="plato.alergenos.length > 3"
            class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
          >
            +{{ plato.alergenos.length - 3 }} más
          </span>
        </div>
      </div>

      <!-- Stock limitado -->
      <div v-if="plato.stock_limitado" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-amber-800">Stock limitado</span>
          <span class="text-sm font-bold text-amber-900">{{ plato.cantidad_stock }} unidades</span>
        </div>
        <div class="w-full bg-amber-200 rounded-full h-2 mt-2">
          <div 
            class="bg-amber-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((plato.cantidad_stock / 10) * 100, 100)}%` }"
          ></div>
        </div>
      </div>

      <!-- Variantes -->
      <div v-if="plato.tiene_variantes && plato.variantes" class="mb-4">
        <p class="text-xs font-semibold text-slate-700 mb-2">Variantes disponibles:</p>
        <div class="text-xs text-slate-600">
          {{ Array.isArray(plato.variantes) ? plato.variantes.length : Object.keys(plato.variantes).length }} opciones
        </div>
      </div>

      <!-- Acciones del pie -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-100">
        <div class="flex space-x-2">
          <button
            @click.stop="console.log('🔥 Botón Editar (pie) clickeado, plato:', plato); $emit('editar', plato)"
            class="btn btn-sm btn-secondary"
            title="Editar plato"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <button
            @click.stop="$emit('duplicar', plato.id)"
            class="btn btn-sm btn-primary"
            title="Duplicar plato"
          >
            <DocumentDuplicateIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="flex space-x-2">
          <button
            @click.stop="toggleDisponibilidad"
            :class="[
              'btn btn-sm transition-all duration-300',
              plato.esta_disponible 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            ]"
          >
            {{ plato.esta_disponible ? 'Disponible' : 'Agotado' }}
          </button>
          <button
            @click.stop="confirmarEliminar"
            class="btn btn-sm bg-red-500 text-white hover:bg-red-600"
            title="Eliminar plato"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PencilIcon, 
  DocumentDuplicateIcon, 
  TrashIcon, 
  ClockIcon, 
  FireIcon 
} from '@heroicons/vue/24/outline'

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
  orden_en_categoria: number
}

interface Props {
  plato: Plato
}

interface Emits {
  (e: 'editar', plato: Plato): void
  (e: 'eliminar', platoId: string): void
  (e: 'cambiar-disponibilidad', platoId: string, disponible: boolean): void
  (e: 'duplicar', platoId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Métodos
const toggleDisponibilidad = () => {
  emit('cambiar-disponibilidad', props.plato.id, !props.plato.esta_disponible)
}

const confirmarEliminar = () => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${props.plato.nombre}"?`)) {
    emit('eliminar', props.plato.id)
  }
}
</script>

<style scoped>
/* Limitar líneas de texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Efecto de escala de grises */
.grayscale-50 {
  filter: grayscale(50%);
}

/* Animaciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects premium */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
}
</style>
