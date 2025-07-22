<template>
  <div class="min-h-screen bg-luxury">
    <!-- Header premium -->
    <div class="nav-luxury border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-gradient-luxury text-3xl font-black">Gestión de Menú</h1>
            <p class="text-slate-600 mt-2">
              {{ authStore.currentRestaurant?.nombre }} - {{ totalPlatos }} platos en {{ totalCategorias }} categorías
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Botón para vista de empleados -->
            <button
              @click="toggleVistaEmpleado"
              :class="[
                'btn btn-secondary',
                vistaEmpleado && 'bg-amber-100 text-amber-800 border-amber-300'
              ]"
            >
              {{ vistaEmpleado ? 'Vista Gestión' : 'Vista Empleado' }}
            </button>
            
            <!-- Botón nueva categoría -->
            <button
              v-if="!vistaEmpleado"
              @click="abrirModalCategoria()"
              class="btn btn-primary"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              Nueva Categoría
            </button>
            
            <!-- Botón nuevo plato -->
            <button
              v-if="!vistaEmpleado && categorias.length > 0"
              @click="abrirModalPlato()"
              class="btn btn-success"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              Nuevo Plato
            </button>

            <!-- Botón actualizar -->
            <button
              @click="refreshData"
              :disabled="loading"
              class="btn btn-secondary"
            >
              <ArrowPathIcon :class="['w-5 h-5', loading && 'animate-spin']" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y controles -->
    <div v-if="!vistaEmpleado" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="card-premium p-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Filtros por categoría -->
          <div class="flex items-center space-x-3">
            <span class="text-luxury">Filtrar por categoría:</span>
            <div class="flex space-x-2">
              <button
                @click="categoriaFiltro = null"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                  categoriaFiltro === null
                    ? 'bg-amber-500 text-white shadow-gold'
                    : 'bg-white/80 text-slate-600 hover:bg-amber-50'
                ]"
              >
                Todas ({{ totalPlatos }})
              </button>
              <button
                v-for="categoria in categorias"
                :key="categoria.id"
                @click="categoriaFiltro = categoria.id"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                  categoriaFiltro === categoria.id
                    ? 'bg-amber-500 text-white shadow-gold'
                    : 'bg-white/80 text-slate-600 hover:bg-amber-50'
                ]"
              >
                {{ categoria.nombre }} ({{ contarPlatosPorCategoria(categoria.id) }})
              </button>
            </div>
          </div>

          <!-- Filtros adicionales -->
          <div class="flex items-center space-x-4">
            <!-- Filtro disponibilidad -->
            <div class="flex items-center space-x-2">
              <label class="text-luxury">Estado:</label>
              <select
                v-model="filtroDisponibilidad"
                class="form-select rounded-xl border-slate-200/50"
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponibles</option>
                <option value="no_disponible">No disponibles</option>
                <option value="recomendado">Recomendados</option>
                <option value="nuevo">Nuevos</option>
              </select>
            </div>

            <!-- Ordenar por -->
            <div class="flex items-center space-x-2">
              <label class="text-luxury">Ordenar:</label>
              <select
                v-model="ordenarPor"
                class="form-select rounded-xl border-slate-200/50"
              >
                <option value="orden">Orden del menú</option>
                <option value="nombre">Nombre</option>
                <option value="precio">Precio</option>
                <option value="fecha">Fecha creación</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="alert-error">
        <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
        <div>
          <h3 class="font-semibold">Error al cargar el menú</h3>
          <p class="mt-1">{{ error }}</p>
          <button @click="refreshData" class="mt-2 text-sm underline hover:no-underline">
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>

    <!-- Vista de Empleado (Simplificada) -->
    <div v-else-if="vistaEmpleado" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <MenuEmpleadoView 
        :categorias="categorias"
        :platos="platosFiltrados"
        @cambiar-disponibilidad="cambiarDisponibilidadPlato"
      />
    </div>

    <!-- Vista de Gestión (Completa) -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <!-- Empty state -->
      <div v-if="categorias.length === 0" class="text-center py-20">
        <div class="card-premium p-12 max-w-md mx-auto">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon class="w-8 h-8 text-amber-600" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">¡Comienza creando tu menú!</h3>
          <p class="text-slate-600 mb-6">
            Crea categorías para organizar tus platos y empieza a construir tu carta digital.
          </p>
          <button @click="abrirModalCategoria()" class="btn btn-primary">
            <PlusIcon class="w-5 h-5 mr-2" />
            Crear primera categoría
          </button>
        </div>
      </div>

      <!-- Grid de categorías -->
      <div v-else class="space-y-8">
        <div
          v-for="categoria in categoriasFiltradas"
          :key="categoria.id"
          class="card-premium"
        >
          <!-- Header de categoría -->
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div 
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: categoria.color_tema }"
                ></div>
                <div>
                  <h2 class="text-xl font-bold text-slate-900">{{ categoria.nombre }}</h2>
                  <p v-if="categoria.descripcion" class="text-slate-600 text-sm mt-1">
                    {{ categoria.descripcion }}
                  </p>
                </div>
                <div class="badge badge-secondary">
                  {{ contarPlatosPorCategoria(categoria.id) }} platos
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="abrirModalPlato(categoria)"
                  class="btn btn-sm btn-primary"
                >
                  <PlusIcon class="w-4 h-4 mr-1" />
                  Añadir plato
                </button>
                <button
                  @click="abrirModalCategoria(categoria)"
                  class="btn btn-sm btn-secondary"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="eliminarCategoria(categoria)"
                  class="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Grid de platos de la categoría -->
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PlatoCard
                v-for="plato in obtenerPlatosDeCategoria(categoria.id)"
                :key="plato.id"
                :plato="plato"
                @editar="(platoParaEditar) => abrirModalPlato(categoria, platoParaEditar)"
                @eliminar="eliminarPlato"
                @cambiar-disponibilidad="cambiarDisponibilidadPlato"
                @duplicar="duplicarPlato"
              />
            </div>
            
            <!-- Empty state para categoría sin platos -->
            <div v-if="obtenerPlatosDeCategoria(categoria.id).length === 0" class="text-center py-12">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon class="w-6 h-6 text-slate-400" />
              </div>
              <p class="text-slate-500 mb-4">Esta categoría no tiene platos aún</p>
              <button
                @click="abrirModalPlato(categoria)"
                class="btn btn-sm btn-outline"
              >
                Añadir primer plato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para gestión de categorías -->
    <CategoriaModal
      v-if="modalCategoriaAbierto"
      :categoria="categoriaSeleccionada"
      :abierto="modalCategoriaAbierto"
      @cerrar="cerrarModalCategoria"
      @guardar="guardarCategoria"
    />

    <!-- Modal para gestión de platos -->
    <PlatoModal
      v-if="modalPlatoAbierto"
      :plato="platoSeleccionado"
      :categoria="categoriaSeleccionada"
      :categorias="categorias"
      :abierto="modalPlatoAbierto"
      @cerrar="cerrarModalPlato"
      @guardar="guardarPlato"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import {
  PlusIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

// Components
import MenuEmpleadoView from '@/components/menu/MenuEmpleadoView.vue'
import PlatoCard from '@/components/menu/PlatoCard.vue'
import CategoriaModal from '@/components/menu/CategoriaModal.vue'
import PlatoModal from '@/components/menu/PlatoModal.vue'

// Stores
const authStore = useAuthStore()
const menuStore = useMenuStore()

// Estado local
const loading = ref(false)
const error = ref<string | null>(null)
const vistaEmpleado = ref(false)

// Filtros
const categoriaFiltro = ref<string | null>(null)
const filtroDisponibilidad = ref('todos')
const ordenarPor = ref('orden')

// Modales
const modalCategoriaAbierto = ref(false)
const modalPlatoAbierto = ref(false)
const categoriaSeleccionada = ref<any>(null)
const platoSeleccionado = ref<any>(null)

// Computed properties
const categorias = computed(() => menuStore.categorias)
const platos = computed(() => menuStore.platos)
const totalCategorias = computed(() => categorias.value.length)
const totalPlatos = computed(() => platos.value.length)

// Categorías filtradas
const categoriasFiltradas = computed(() => {
  let cats = [...categorias.value]
  
  if (categoriaFiltro.value) {
    cats = cats.filter(c => c.id === categoriaFiltro.value)
  }
  
  return cats.sort((a, b) => a.orden_visualizacion - b.orden_visualizacion)
})

// Platos filtrados
const platosFiltrados = computed(() => {
  let platosArray = [...platos.value]
  
  // Filtro por categoría
  if (categoriaFiltro.value) {
    platosArray = platosArray.filter(p => p.categoria_id === categoriaFiltro.value)
  }
  
  // Filtro por disponibilidad
  switch (filtroDisponibilidad.value) {
    case 'disponible':
      platosArray = platosArray.filter(p => p.esta_disponible)
      break
    case 'no_disponible':
      platosArray = platosArray.filter(p => !p.esta_disponible)
      break
    case 'recomendado':
      platosArray = platosArray.filter(p => p.es_recomendado)
      break
    case 'nuevo':
      platosArray = platosArray.filter(p => p.es_nuevo)
      break
  }
  
  // Ordenar
  switch (ordenarPor.value) {
    case 'nombre':
      platosArray.sort((a, b) => a.nombre.localeCompare(b.nombre))
      break
    case 'precio':
      platosArray.sort((a, b) => a.precio - b.precio)
      break
    case 'fecha':
      platosArray.sort((a, b) => new Date(b.creado_el).getTime() - new Date(a.creado_el).getTime())
      break
    default: // orden
      platosArray.sort((a, b) => a.orden_en_categoria - b.orden_en_categoria)
  }
  
  return platosArray
})

// Métodos principales
const refreshData = async () => {
  try {
    loading.value = true
    error.value = null
    await menuStore.loadMenu()
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el menú'
  } finally {
    loading.value = false
  }
}

const toggleVistaEmpleado = () => {
  vistaEmpleado.value = !vistaEmpleado.value
}

const contarPlatosPorCategoria = (categoriaId: string): number => {
  return platos.value.filter(p => p.categoria_id === categoriaId).length
}

const obtenerPlatosDeCategoria = (categoriaId: string) => {
  return platosFiltrados.value.filter(p => p.categoria_id === categoriaId)
}

// Gestión de categorías
const abrirModalCategoria = (categoria?: any) => {
  categoriaSeleccionada.value = categoria || null
  modalCategoriaAbierto.value = true
}

const cerrarModalCategoria = () => {
  categoriaSeleccionada.value = null
  modalCategoriaAbierto.value = false
}

const guardarCategoria = async (datosCategoria: any) => {
  try {
    if (categoriaSeleccionada.value) {
      await menuStore.updateCategoria(categoriaSeleccionada.value.id, datosCategoria)
    } else {
      await menuStore.createCategoria(datosCategoria)
    }
    cerrarModalCategoria()
    await refreshData()
  } catch (err: any) {
    error.value = err.message || 'Error al guardar la categoría'
  }
}

const eliminarCategoria = async (categoria: any) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"? También se eliminarán todos sus platos.`)) {
    try {
      await menuStore.deleteCategoria(categoria.id)
      await refreshData()
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar la categoría'
    }
  }
}

// Gestión de platos - CON DEBUG
const abrirModalPlato = (categoria?: any, plato?: any) => {
  console.log('🔍 abrirModalPlato llamado con:')
  console.log('categoria:', categoria)
  console.log('plato:', plato)
  
  categoriaSeleccionada.value = categoria || null
  platoSeleccionado.value = plato || null
  modalPlatoAbierto.value = true
  
  console.log('📋 Variables asignadas:')
  console.log('categoriaSeleccionada:', categoriaSeleccionada.value)
  console.log('platoSeleccionado:', platoSeleccionado.value)
  console.log('modalPlatoAbierto:', modalPlatoAbierto.value)
}

const cerrarModalPlato = () => {
  categoriaSeleccionada.value = null
  platoSeleccionado.value = null
  modalPlatoAbierto.value = false
}

const guardarPlato = async (datosPlato: any) => {
  try {
    if (platoSeleccionado.value) {
      await menuStore.updatePlato(platoSeleccionado.value.id, datosPlato)
    } else {
      await menuStore.createPlato(datosPlato)
    }
    cerrarModalPlato()
    await refreshData()
  } catch (err: any) {
    error.value = err.message || 'Error al guardar el plato'
  }
}

const eliminarPlato = async (platoId: string) => {
  const plato = platos.value.find(p => p.id === platoId)
  if (plato && confirm(`¿Estás seguro de que quieres eliminar "${plato.nombre}"?`)) {
    try {
      await menuStore.deletePlato(platoId)
      await refreshData()
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar el plato'
    }
  }
}

const cambiarDisponibilidadPlato = async (platoId: string, disponible: boolean) => {
  try {
    await menuStore.updatePlato(platoId, { esta_disponible: disponible })
    await refreshData()
  } catch (err: any) {
    error.value = err.message || 'Error al cambiar disponibilidad'
  }
}

const duplicarPlato = async (platoId: string) => {
  try {
    const plato = platos.value.find(p => p.id === platoId)
    if (plato) {
      const platoDuplicado = {
        ...plato,
        nombre: `${plato.nombre} (copia)`,
        id: undefined,
        creado_el: undefined,
        actualizado_el: undefined
      }
      await menuStore.createPlato(platoDuplicado)
      await refreshData()
    }
  } catch (err: any) {
    error.value = err.message || 'Error al duplicar el plato'
  }
}

// Lifecycle
onMounted(async () => {
  if (!menuStore.hasData) {
    await refreshData()
  }
})

onUnmounted(() => {
  // Cleanup si es necesario
})

// Watchers
watch(() => authStore.currentRestaurant?.id, async (newId) => {
  if (newId) {
    await refreshData()
  }
})
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
.categoria-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
}

.plato-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .plato-grid {
    grid-template-columns: 1fr;
  }
}

/* Animaciones suaves para las transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>