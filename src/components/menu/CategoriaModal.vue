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
          class="relative w-full max-w-2xl glass-luxury rounded-3xl shadow-luxury animate-slide-in-bottom"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-8 border-b border-white/20">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">
                {{ esEdicion ? 'Editar Categoría' : 'Nueva Categoría' }}
              </h2>
              <p class="text-slate-600 mt-1">
                {{ esEdicion ? 'Modifica los datos de la categoría' : 'Crea una nueva categoría para organizar tu menú' }}
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
          <form @submit.prevent="guardar" class="p-8 space-y-6">
            <!-- Nombre de la categoría -->
            <div class="form-group">
              <label class="form-label">
                Nombre de la categoría *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="form-input"
                placeholder="Ej: Entrantes, Platos principales, Bebidas..."
                maxlength="50"
              >
              <p class="form-help">
                Este nombre aparecerá en el menú digital para los clientes
              </p>
            </div>

            <!-- Descripción -->
            <div class="form-group">
              <label class="form-label">
                Descripción (opcional)
              </label>
              <textarea
                v-model="form.descripcion"
                class="form-textarea"
                rows="3"
                placeholder="Describe brevemente esta categoría..."
                maxlength="200"
              ></textarea>
              <p class="form-help">
                Ayuda a los clientes a entender qué tipo de platos encontrarán
              </p>
            </div>

            <!-- Color y configuración visual -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Color del tema -->
              <div class="form-group">
                <label class="form-label">
                  Color del tema
                </label>
                <div class="flex items-center space-x-3">
                  <input
                    v-model="form.color_tema"
                    type="color"
                    class="w-12 h-12 rounded-xl border-2 border-white shadow-lg cursor-pointer"
                  >
                  <div class="flex-1">
                    <input
                      v-model="form.color_tema"
                      type="text"
                      class="form-input"
                      placeholder="#6B7280"
                    >
                  </div>
                </div>
                <p class="form-help">
                  Color que identificará esta categoría en el sistema
                </p>
              </div>

              <!-- Icono -->
              <div class="form-group">
                <label class="form-label">
                  Icono (opcional)
                </label>
                <select
                  v-model="form.icono"
                  class="form-select"
                >
                  <option value="">Sin icono</option>
                  <option value="🍽️">🍽️ Platos generales</option>
                  <option value="🥗">🥗 Ensaladas</option>
                  <option value="🍕">🍕 Pizzas</option>
                  <option value="🍔">🍔 Hamburguesas</option>
                  <option value="🍝">🍝 Pastas</option>
                  <option value="🥩">🥩 Carnes</option>
                  <option value="🐟">🐟 Pescados</option>
                  <option value="🍤">🍤 Mariscos</option>
                  <option value="🍜">🍜 Sopas</option>
                  <option value="🍰">🍰 Postres</option>
                  <option value="🍹">🍹 Bebidas</option>
                  <option value="☕">☕ Cafés</option>
                  <option value="🍺">🍺 Cervezas</option>
                  <option value="🍷">🍷 Vinos</option>
                  <option value="🥤">🥤 Refrescos</option>
                </select>
              </div>
            </div>

            <!-- Configuración avanzada -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-slate-900">Configuración</h3>
              
              <!-- Disponibilidad -->
              <div class="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200/50">
                <div>
                  <h4 class="font-medium text-slate-900">Categoría disponible</h4>
                  <p class="text-sm text-slate-600">Si está desactivada, no aparecerá en el menú</p>
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

              <!-- Orden de visualización -->
              <div class="form-group">
                <label class="form-label">
                  Orden en el menú
                </label>
                <input
                  v-model.number="form.orden_visualizacion"
                  type="number"
                  min="1"
                  max="100"
                  class="form-input"
                  placeholder="1"
                >
                <p class="form-help">
                  Las categorías se ordenarán de menor a mayor número
                </p>
              </div>
            </div>

            <!-- Vista previa -->
            <div class="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200/50">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Vista previa</h3>
              <div class="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div 
                  class="w-6 h-6 rounded-full shadow-sm"
                  :style="{ backgroundColor: form.color_tema || '#6B7280' }"
                ></div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span v-if="form.icono" class="text-xl">{{ form.icono }}</span>
                    <h4 class="font-semibold text-slate-900">
                      {{ form.nombre || 'Nombre de la categoría' }}
                    </h4>
                  </div>
                  <p v-if="form.descripcion" class="text-sm text-slate-600 mt-1">
                    {{ form.descripcion }}
                  </p>
                </div>
                <div class="badge badge-secondary">
                  Orden {{ form.orden_visualizacion || 1 }}
                </div>
              </div>
            </div>
          </form>

          <!-- Footer con acciones -->
          <div class="flex justify-end space-x-4 px-8 py-6 border-t border-white/20 bg-white/30 rounded-b-3xl">
            <button
              type="button"
              @click="$emit('cerrar')"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              @click="guardar"
              :disabled="!form.nombre.trim()"
              class="btn btn-primary"
            >
              {{ esEdicion ? 'Actualizar' : 'Crear' }} Categoría
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Categoria {
  id?: string
  nombre: string
  descripcion?: string
  color_tema: string
  icono?: string
  esta_disponible: boolean
  orden_visualizacion: number
}

interface Props {
  categoria?: Categoria | null
  abierto: boolean
}

interface Emits {
  (e: 'cerrar'): void
  (e: 'guardar', categoria: Partial<Categoria>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estado del formulario
const form = ref<Partial<Categoria>>({
  nombre: '',
  descripcion: '',
  color_tema: '#6B7280',
  icono: '',
  esta_disponible: true,
  orden_visualizacion: 1
})

// Computed
const esEdicion = computed(() => !!props.categoria?.id)

// Métodos
const resetForm = () => {
  if (props.categoria) {
    form.value = { ...props.categoria }
  } else {
    form.value = {
      nombre: '',
      descripcion: '',
      color_tema: '#6B7280',
      icono: '',
      esta_disponible: true,
      orden_visualizacion: 1
    }
  }
}

const guardar = () => {
  if (!form.value.nombre?.trim()) return
  
  emit('guardar', { ...form.value })
}

// Watchers
watch(() => props.abierto, (nuevo) => {
  if (nuevo) {
    resetForm()
  }
})

watch(() => props.categoria, () => {
  if (props.abierto) {
    resetForm()
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

/* Color picker personalizado */
input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch {
  border-radius: 0.75rem;
  border: none;
}

input[type="color"]::-moz-color-swatch {
  border-radius: 0.75rem;
  border: none;
}
</style>
