<template>
  <div class="space-y-6">
    <!-- Búsqueda rápida -->
    <div class="card-premium p-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar platos..."
            class="form-input w-full"
          >
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="filtroDisponibilidad = 'todos'"
            :class="[
              'btn btn-sm',
              filtroDisponibilidad === 'todos' ? 'btn-primary' : 'btn-secondary'
            ]"
          >
            Todos
          </button>
          <button
            @click="filtroDisponibilidad = 'disponible'"
            :class="[
              'btn btn-sm',
              filtroDisponibilidad === 'disponible' ? 'btn-success' : 'btn-secondary'
            ]"
          >
            Disponibles
          </button>
          <button
            @click="filtroDisponibilidad = 'no_disponible'"
            :class="[
              'btn btn-sm',
              filtroDisponibilidad === 'no_disponible' ? 'btn-danger' : 'btn-secondary'
            ]"
          >
            Agotados
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de categorías y platos -->
    <div class="space-y-6">
      <div
        v-for="categoria in categoriasFiltradas"
        :key="categoria.id"
        class="card-premium"
      >
        <!-- Header de categoría -->
        <div class="card-header">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: categoria.color_tema }"
              ></div>
              <h3 class="text-xl font-bold text-slate-900">{{ categoria.nombre }}</h3>
              <div class="badge badge-secondary">
                {{ obtenerPlatosDeCategoria(categoria.id).length }} platos
              </div>
            </div>
          </div>
        </div>

        <!-- Grid de platos simplificado -->
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="plato in obtenerPlatosDeCategoria(categoria.id)"
              :key="plato.id"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                plato.esta_disponible 
                  ? 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-gold' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              ]"
              @click="toggleDisponibilidad(plato)"
            >
              <!-- Imagen del plato -->
              <div class="aspect-video bg-slate-100 rounded-lg mb-3 overflow-hidden">
                <img
                  v-if="plato.url_imagen"
                  :src="plato.url_imagen"
                  :alt="plato.nombre"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-slate-400 text-sm">Sin imagen</span>
                </div>
              </div>

              <!-- Información del plato -->
              <div class="space-y-2">
                <div class="flex items-start justify-between">
                  <h4 class="font-semibold text-slate-900 text-sm leading-tight">
                    {{ plato.nombre }}
                  </h4>
                  <div class="text-right">
                    <span class="text-lg font-bold text-slate-900">
                      €{{ plato.precio.toFixed(2) }}
                    </span>
                    <span v-if="plato.precio_oferta" class="text-sm text-slate-500 line-through ml-1">
                      €{{ plato.precio_oferta.toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Estado y badges -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <button
                      @click.stop="toggleDisponibilidad(plato)"
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium transition-all duration-300',
                        plato.esta_disponible
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      ]"
                    >
                      {{ plato.esta_disponible ? 'Disponible' : 'Agotado' }}
                    </button>
                    
                    <span v-if="plato.es_recomendado" class="badge badge-warning text-xs">
                      ⭐ Recomendado
                    </span>
                    
                    <span v-if="plato.es_nuevo" class="badge badge-info text-xs">
                      🆕 Nuevo
                    </span>
                  </div>

                  <div class="flex items-center space-x-1 text-xs text-slate-500">
                    <span v-if="plato.es_vegano" title="Vegano">🌱</span>
                    <span v-if="plato.es_vegetariano" title="Vegetariano">🥬</span>
                    <span v-if="plato.es_sin_gluten" title="Sin gluten">🌾</span>
                  </div>
                </div>

                <!-- Descripción corta -->
                <p v-if="plato.descripcion" class="text-sm text-slate-600 line-clamp-2">
                  {{ plato.descripcion }}
                </p>

                <!-- Stock limitado -->
                <div v-if="plato.stock_limitado" class="text-xs text-amber-600">
                  Stock: {{ plato.cantidad_stock }} unidades
                </div>

                <!-- Tiempo de preparación -->
                <div class="text-xs text-slate-500">
                  ⏱️ {{ plato.tiempo_preparacion }} min
                </div>

                <!-- Alérgenos -->
                <div v-if="plato.alergenos && plato.alergenos.length > 0" class="text-xs text-slate-500">
                  <span class="font-medium">Alérgenos:</span>
                  {{ plato.alergenos.join(', ') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="obtenerPlatosDeCategoria(categoria.id).length === 0" class="text-center py-8">
            <p class="text-slate-500">No hay platos en esta categoría</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state general -->
    <div v-if="categoriasFiltradas.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl">🍽️</span>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">No se encontraron platos</h3>
      <p class="text-slate-600">
        Prueba a cambiar los filtros o la búsqueda.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  categorias: any[]
  platos: any[]
}

interface Emits {
  (e: 'cambiar-disponibilidad', platoId: string, disponible: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado local
const busqueda = ref('')
const filtroDisponibilidad = ref<'todos' | 'disponible' | 'no_disponible'>('todos')

// Computed
const categoriasFiltradas = computed(() => {
  return props.categorias.filter(categoria => {
    const platosCategoria = obtenerPlatosDeCategoria(categoria.id)
    return platosCategoria.length > 0
  })
})

const platosFiltrados = computed(() => {
  let platos = [...props.platos]

  // Filtro por búsqueda
  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase()
    platos = platos.filter(plato => 
      plato.nombre.toLowerCase().includes(termino) ||
      plato.descripcion?.toLowerCase().includes(termino) ||
      plato.ingredientes?.some((ing: string) => ing.toLowerCase().includes(termino))
    )
  }

  // Filtro por disponibilidad
  switch (filtroDisponibilidad.value) {
    case 'disponible':
      platos = platos.filter(p => p.esta_disponible)
      break
    case 'no_disponible':
      platos = platos.filter(p => !p.esta_disponible)
      break
  }

  return platos
})

// Métodos
const obtenerPlatosDeCategoria = (categoriaId: string) => {
  return platosFiltrados.value
    .filter(plato => plato.categoria_id === categoriaId)
    .sort((a, b) => a.orden_en_categoria - b.orden_en_categoria)
}

const toggleDisponibilidad = (plato: any) => {
  emit('cambiar-disponibilidad', plato.id, !plato.esta_disponible)
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

/* Efecto hover suave */
.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.02);
}
</style>
