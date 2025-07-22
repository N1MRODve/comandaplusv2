<template>
  <Teleport to="body">
    <div
      v-if="abierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="$emit('cerrar')"
    >
      <!-- Overlay premium -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-4xl glass-luxury rounded-3xl shadow-luxury animate-slide-in-bottom max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-8 border-b border-white/20 sticky top-0 bg-white/80 backdrop-blur-md rounded-t-3xl">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">
                {{ esEdicion ? 'Editar Plato' : 'Nuevo Plato' }}
              </h2>
              <p class="text-slate-600 mt-1">
                {{ esEdicion ? 'Modifica los datos del plato' : 'Añade un nuevo plato a tu menú' }}
              </p>
            </div>
            <button
              @click="$emit('cerrar')"
              class="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="guardar" class="space-y-8">
            <div class="p-8 space-y-8">
              <!-- Información básica -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Información básica
                </h3>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Nombre del plato -->
                  <div class="form-group">
                    <label class="form-label">
                      Nombre del plato *
                    </label>
                    <input
                      v-model="form.nombre"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Ej: Paella Valenciana, Ensalada César..."
                      maxlength="100"
                    >
                  </div>

                  <!-- Categoría -->
                  <div class="form-group">
                    <label class="form-label">
                      Categoría *
                    </label>
                    <select
                      v-model="form.categoria_id"
                      required
                      class="form-select"
                    >
                      <option value="">Selecciona una categoría</option>
                      <option 
                        v-for="cat in categorias" 
                        :key="cat.id" 
                        :value="cat.id"
                      >
                        {{ cat.icono }} {{ cat.nombre }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Descripción -->
                <div class="form-group">
                  <label class="form-label">
                    Descripción
                  </label>
                  <textarea
                    v-model="form.descripcion"
                    class="form-textarea"
                    rows="3"
                    placeholder="Describe los ingredientes, preparación o características especiales..."
                    maxlength="500"
                  ></textarea>
                </div>

                <!-- Imagen -->
                <div class="form-group">
                  <label class="form-label">
                    Imagen del plato
                  </label>
                  <div class="flex items-start space-x-4">
                    <div class="flex-1">
                      <input
                        v-model="form.url_imagen"
                        type="url"
                        class="form-input"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      >
                      <p class="form-help text-sm text-slate-500 mt-1">
                        URL de la imagen del plato (recomendado: 800x600px)
                      </p>
                    </div>
                    <div v-if="form.url_imagen" class="flex-shrink-0">
                      <img
                        :src="form.url_imagen"
                        alt="Vista previa"
                        class="w-20 h-20 object-cover rounded-xl border border-slate-200"
                        @error="form.url_imagen = ''"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Precios -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Precios
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Precio regular -->
                  <div class="form-group">
                    <label class="form-label">
                      Precio regular *
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">€</span>
                      <input
                        v-model.number="form.precio"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        class="form-input pl-8"
                        placeholder="12.50"
                      >
                    </div>
                  </div>

                  <!-- Precio de oferta -->
                  <div class="form-group">
                    <label class="form-label">
                      Precio de oferta (opcional)
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">€</span>
                      <input
                        v-model.number="form.precio_oferta"
                        type="number"
                        step="0.01"
                        min="0"
                        class="form-input pl-8"
                        placeholder="9.99"
                      >
                    </div>
                    <p class="form-help text-sm text-slate-500 mt-1">
                      Si se establece, se mostrará como precio rebajado
                    </p>
                  </div>
                </div>
              </div>

              <!-- Características -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Características
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Tiempo de preparación -->
                  <div class="form-group">
                    <label class="form-label">
                      Tiempo preparación (min)
                    </label>
                    <input
                      v-model.number="form.tiempo_preparacion"
                      type="number"
                      min="1"
                      max="120"
                      class="form-input"
                      placeholder="15"
                    >
                  </div>

                  <!-- Calorías -->
                  <div class="form-group">
                    <label class="form-label">
                      Calorías (opcional)
                    </label>
                    <input
                      v-model.number="form.calorias"
                      type="number"
                      min="0"
                      class="form-input"
                      placeholder="350"
                    >
                  </div>

                  <!-- Orden en categoría -->
                  <div class="form-group">
                    <label class="form-label">
                      Orden en menú
                    </label>
                    <input
                      v-model.number="form.orden_en_categoria"
                      type="number"
                      min="1"
                      class="form-input"
                      placeholder="1"
                    >
                  </div>
                </div>

                <!-- Badges de dieta -->
                <div class="space-y-4">
                  <h4 class="font-medium text-slate-900">Características dietéticas</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label class="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-slate-200/50 cursor-pointer hover:bg-white/80 transition-colors">
                      <input
                        v-model="form.es_vegano"
                        type="checkbox"
                        class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      >
                      <span class="text-sm font-medium text-slate-700">🌱 Vegano</span>
                    </label>

                    <label class="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-slate-200/50 cursor-pointer hover:bg-white/80 transition-colors">
                      <input
                        v-model="form.es_vegetariano"
                        type="checkbox"
                        class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      >
                      <span class="text-sm font-medium text-slate-700">🥬 Vegetariano</span>
                    </label>

                    <label class="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-slate-200/50 cursor-pointer hover:bg-white/80 transition-colors">
                      <input
                        v-model="form.es_sin_gluten"
                        type="checkbox"
                        class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      >
                      <span class="text-sm font-medium text-slate-700">🌾 Sin gluten</span>
                    </label>

                    <label class="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-slate-200/50 cursor-pointer hover:bg-white/80 transition-colors">
                      <input
                        v-model="form.es_recomendado"
                        type="checkbox"
                        class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      >
                      <span class="text-sm font-medium text-slate-700">⭐ Recomendado</span>
                    </label>

                    <label class="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-slate-200/50 cursor-pointer hover:bg-white/80 transition-colors">
                      <input
                        v-model="form.es_nuevo"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      >
                      <span class="text-sm font-medium text-slate-700">✨ Nuevo</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Ingredientes y alérgenos -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Ingredientes y alérgenos
                </h3>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Ingredientes -->
                  <div class="form-group">
                    <label class="form-label">
                      Ingredientes principales
                    </label>
                    <TagInput
                      v-model="form.ingredientes"
                      placeholder="Escribe un ingrediente y presiona Enter"
                      :suggestions="ingredientesSugeridos"
                    />
                    <p class="form-help text-sm text-slate-500 mt-1">
                      Lista los ingredientes principales del plato
                    </p>
                  </div>

                  <!-- Alérgenos -->
                  <div class="form-group">
                    <label class="form-label">
                      Alérgenos
                    </label>
                    <div class="space-y-2">
                      <label 
                        v-for="alergeno in alergenosComunes"
                        :key="alergeno"
                        class="flex items-center space-x-2 text-sm"
                      >
                        <input
                          v-model="form.alergenos"
                          :value="alergeno"
                          type="checkbox"
                          class="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        >
                        <span>{{ alergeno }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Disponibilidad y stock -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Disponibilidad y stock
                </h3>

                <div class="space-y-4">
                  <!-- Disponibilidad -->
                  <div class="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200/50">
                    <div>
                      <h4 class="font-medium text-slate-900">Plato disponible</h4>
                      <p class="text-sm text-slate-600">Si está desactivado, no aparecerá en el menú</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="form.esta_disponible"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <!-- Stock limitado -->
                  <div class="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200/50">
                    <div>
                      <h4 class="font-medium text-slate-900">Stock limitado</h4>
                      <p class="text-sm text-slate-600">Activar si el plato tiene cantidad limitada</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="form.stock_limitado"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <!-- Cantidad en stock -->
                  <div v-if="form.stock_limitado" class="form-group">
                    <label class="form-label">
                      Cantidad disponible
                    </label>
                    <input
                      v-model.number="form.cantidad_stock"
                      type="number"
                      min="0"
                      class="form-input max-w-xs"
                      placeholder="10"
                    >
                    <p class="form-help text-sm text-slate-500 mt-1">
                      Cuando llegue a 0, el plato se marcará como no disponible automáticamente
                    </p>
                  </div>
                </div>
              </div>

              <!-- Vista previa CORREGIDA -->
              <div v-if="form.nombre" class="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200/50">
                <h3 class="text-lg font-semibold text-slate-900 mb-4">Vista previa</h3>
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden max-w-md">
                  <!-- Imagen preview -->
                  <div class="aspect-video bg-slate-100 relative">
                    <img
                      v-if="form.url_imagen"
                      :src="form.url_imagen"
                      :alt="form.nombre"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="text-slate-400">Sin imagen</span>
                    </div>
                    
                    <!-- Badges preview -->
                    <div class="absolute top-2 left-2 flex flex-col space-y-1">
                      <span v-if="form.es_nuevo" class="badge badge-info text-xs">✨ Nuevo</span>
                      <span v-if="form.es_recomendado" class="badge badge-warning text-xs">⭐ Recomendado</span>
                    </div>
                  </div>

                  <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-semibold text-slate-900">{{ form.nombre }}</h4>
                      <div class="text-right">
                        <!-- PRECIO DE OFERTA CORREGIDO -->
                        <span v-if="form.precio_oferta && typeof form.precio_oferta === 'number'" class="text-red-600 font-bold">
                          €{{ form.precio_oferta.toFixed(2) }}
                        </span>
                        <!-- PRECIO REGULAR CORREGIDO -->
                        <span 
                          v-if="form.precio && typeof form.precio === 'number'"
                          :class="[
                            'font-bold',
                            form.precio_oferta ? 'text-sm text-slate-500 line-through ml-1' : 'text-slate-900'
                          ]"
                        >
                          €{{ form.precio.toFixed(2) }}
                        </span>
                        <!-- Fallback si no hay precio válido -->
                        <span v-else class="text-slate-500 font-bold">
                          €0.00
                        </span>
                      </div>
                    </div>
                    
                    <p v-if="form.descripcion" class="text-sm text-slate-600 mb-3">
                      {{ form.descripcion }}
                    </p>
                    
                    <div class="flex flex-wrap gap-1">
                      <span v-if="form.es_vegano" class="badge badge-success text-xs">🌱 Vegano</span>
                      <span v-if="form.es_vegetariano && !form.es_vegano" class="badge badge-info text-xs">🥬 Vegetariano</span>
                      <span v-if="form.es_sin_gluten" class="badge badge-warning text-xs">🌾 Sin gluten</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer con acciones -->
            <div class="flex justify-end space-x-4 px-8 py-6 border-t border-white/20 bg-white/30 rounded-b-3xl sticky bottom-0">
              <button
                type="button"
                @click="$emit('cerrar')"
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="!validacionFormulario || guardando"
                class="btn btn-primary"
              >
                <span v-if="guardando" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
                <span v-else>
                  {{ esEdicion ? 'Actualizar' : 'Crear' }} Plato
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import TagInput from './TagInput.vue'

interface Plato {
  id?: string
  nombre: string
  descripcion?: string
  precio: number
  precio_oferta?: number
  url_imagen?: string
  categoria_id: string
  alergenos: string[]
  ingredientes: string[]
  calorias?: number
  tiempo_preparacion: number
  esta_disponible: boolean
  stock_limitado: boolean
  cantidad_stock: number
  es_recomendado: boolean
  es_nuevo: boolean
  es_vegano: boolean
  es_vegetariano: boolean
  es_sin_gluten: boolean
  orden_en_categoria: number
}

interface Props {
  plato?: Plato | null
  categoria?: any
  categorias: any[]
  abierto: boolean
}

interface Emits {
  (e: 'cerrar'): void
  (e: 'guardar', plato: Partial<Plato>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado del formulario
const form = ref<Partial<Plato>>({
  nombre: '',
  descripcion: '',
  precio: 0,
  precio_oferta: undefined,
  url_imagen: '',
  categoria_id: '',
  alergenos: [],
  ingredientes: [],
  calorias: undefined,
  tiempo_preparacion: 15,
  esta_disponible: true,
  stock_limitado: false,
  cantidad_stock: 0,
  es_recomendado: false,
  es_nuevo: false,
  es_vegano: false,
  es_vegetariano: false,
  es_sin_gluten: false,
  orden_en_categoria: 1
})

// Estado de carga
const guardando = ref(false)

// Datos de referencia
const alergenosComunes = [
  'Gluten', 'Lactosa', 'Huevos', 'Pescado', 'Mariscos', 'Frutos secos',
  'Cacahuetes', 'Soja', 'Apio', 'Mostaza', 'Sésamo', 'Sulfitos'
]

const ingredientesSugeridos = [
  'Tomate', 'Cebolla', 'Ajo', 'Aceite de oliva', 'Sal', 'Pimienta',
  'Queso', 'Jamón', 'Pollo', 'Ternera', 'Pescado', 'Lechuga',
  'Patata', 'Arroz', 'Pasta', 'Pan', 'Huevo', 'Limón'
]

// Computed
const esEdicion = computed(() => !!props.plato?.id)

// NUEVA VALIDACIÓN MEJORADA
const validacionFormulario = computed(() => {
  return !!(
    form.value.nombre?.trim() && 
    form.value.categoria_id && 
    form.value.precio && 
    typeof form.value.precio === 'number' && 
    form.value.precio > 0
  )
})

// Métodos
const resetForm = () => {
  console.log('🔄 resetForm llamado')
  console.log('props.plato:', props.plato)
  console.log('props.categoria:', props.categoria)
  console.log('props.abierto:', props.abierto)
  
  if (props.plato) {
    console.log('✅ Cargando datos del plato:', props.plato.nombre)
    // ASEGURAR QUE LOS NÚMEROS SE CONVIERTAN CORRECTAMENTE
    form.value = { 
      ...props.plato,
      precio: Number(props.plato.precio) || 0,
      precio_oferta: props.plato.precio_oferta ? Number(props.plato.precio_oferta) : undefined,
      calorias: props.plato.calorias ? Number(props.plato.calorias) : undefined,
      tiempo_preparacion: Number(props.plato.tiempo_preparacion) || 15,
      cantidad_stock: Number(props.plato.cantidad_stock) || 0,
      orden_en_categoria: Number(props.plato.orden_en_categoria) || 1
    }
    console.log('📝 Formulario después de cargar:', form.value)
  } else {
    console.log('➕ Creando formulario nuevo')
    form.value = {
      nombre: '',
      descripcion: '',
      precio: 0, // ASEGURAR QUE SIEMPRE ES NÚMERO
      precio_oferta: undefined,
      url_imagen: '',
      categoria_id: props.categoria?.id || '',
      alergenos: [],
      ingredientes: [],
      calorias: undefined,
      tiempo_preparacion: 15,
      esta_disponible: true,
      stock_limitado: false,
      cantidad_stock: 0,
      es_recomendado: false,
      es_nuevo: false,
      es_vegano: false,
      es_vegetariano: false,
      es_sin_gluten: false,
      orden_en_categoria: 1
    }
    console.log('📝 Formulario nuevo:', form.value)
  }
}

const guardar = async () => {
  if (!validacionFormulario.value) {
    console.warn('Faltan campos requeridos o hay errores en el formulario')
    return
  }
  
  try {
    guardando.value = true
    
    // LIMPIAR Y VALIDAR DATOS ANTES DE ENVIAR
    const datosLimpios = {
      ...form.value,
      precio: Number(form.value.precio),
      precio_oferta: form.value.precio_oferta ? Number(form.value.precio_oferta) : null,
      calorias: form.value.calorias ? Number(form.value.calorias) : null,
      tiempo_preparacion: Number(form.value.tiempo_preparacion) || 15,
      cantidad_stock: Number(form.value.cantidad_stock) || 0,
      orden_en_categoria: Number(form.value.orden_en_categoria) || 1
    }
    
    console.log('💾 Guardando plato con datos:', datosLimpios)
    emit('guardar', datosLimpios)
  } catch (error) {
    console.error('Error al guardar:', error)
  } finally {
    guardando.value = false
  }
}

// Watchers con DEBUG
watch(() => props.abierto, (nuevo) => {
  console.log('👁️ Watch props.abierto:', nuevo)
  if (nuevo) {
    console.log('🚀 Modal abierto, llamando resetForm')
    nextTick(() => {
      resetForm()
    })
    guardando.value = false
  }
})

watch(() => props.plato, (nuevoPlato) => {
  console.log('👁️ Watch props.plato:', nuevoPlato)
  if (props.abierto) {
    console.log('🔄 Plato cambió y modal abierto, llamando resetForm')
    nextTick(() => {
      resetForm()
    })
  }
})

// Watch para vegano automático
watch(() => form.value.es_vegano, (esVegano) => {
  if (esVegano) {
    form.value.es_vegetariano = true
  }
})

// Ejecutar resetForm cuando el componente se monta y el modal está abierto
onMounted(() => {
  console.log('🎬 PlatoModal montado')
  console.log('Props al montar - abierto:', props.abierto, 'plato:', props.plato)
  if (props.abierto) {
    console.log('🔄 Modal ya abierto al montar, ejecutando resetForm')
    nextTick(() => {
      resetForm()
    })
  }
})
</script>

<style scoped>
.animate-slide-in-bottom {
  animation: slideInBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInBottom {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Toggle personalizado */
input[type="checkbox"]:checked + div {
  background-color: rgb(245 158 11);
}

/* Scrollbar personalizado para el modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Ajuste para el form-help */
.form-help {
  @apply text-sm text-slate-500 mt-1;
}
</style>