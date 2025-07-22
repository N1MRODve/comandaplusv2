<template>
  <div class="editor-mesas">
    <!-- Header del Editor -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Editor de Mesas</h2>
          <p class="text-sm text-gray-600 mt-1">Arrastra, redimensiona y organiza las mesas del salón</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Modo del editor -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Modo:</span>
            <select v-model="modoEditor" class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="seleccionar">🔍 Seleccionar</option>
              <option value="crear">➕ Crear Mesa</option>
              <option value="editar">✏️ Editar</option>
              <option value="unir">🔗 Unir Mesas</option>
              <option value="separar">✂️ Separar</option>
            </select>
          </div>
          
          <!-- Botones de acción -->
          <button @click="guardarCambios" :disabled="!hayChangios" 
                  class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors">
            💾 Guardar Layout
          </button>
          <button @click="resetearEditor"
                  class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            🔄 Resetear
          </button>
          <button @click="cerrarEditor"
                  class="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
            ✖️ Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Barra de Herramientas -->
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Herramientas de creación -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Crear:</span>
            <button v-for="tipo in tiposMesa" :key="tipo.id"
                    @click="seleccionarTipoMesa(tipo)"
                    :class="[
                      'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                      tipoMesaSeleccionado?.id === tipo.id 
                        ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    ]">
              {{ tipo.icono }} {{ tipo.nombre }}
            </button>
          </div>
          
          <!-- Configuración de la nueva mesa -->
          <div v-if="modoEditor === 'crear' && tipoMesaSeleccionado" class="flex items-center space-x-2 pl-4 border-l border-gray-300">
            <label class="text-sm text-gray-600">Capacidad:</label>
            <select v-model="nuevaMesa.capacidad" class="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="2">2 personas</option>
              <option value="4">4 personas</option>
              <option value="6">6 personas</option>
              <option value="8">8 personas</option>
              <option value="10">10 personas</option>
              <option value="12">12 personas</option>
            </select>
            <label class="text-sm text-gray-600">Número:</label>
            <input v-model="nuevaMesa.numero" type="text" placeholder="Ej: 15" 
                   class="border border-gray-300 rounded px-2 py-1 text-sm w-16">
          </div>
        </div>

        <!-- Información de selección -->
        <div v-if="mesaSeleccionada" class="flex items-center space-x-4">
          <div class="bg-white rounded-lg px-3 py-2 border border-gray-300">
            <span class="text-sm font-medium text-gray-900">Mesa {{ mesaSeleccionada.numero }}</span>
            <span class="text-xs text-gray-600 ml-2">{{ mesaSeleccionada.capacidad }} personas</span>
          </div>
          <button @click="eliminarMesa(mesaSeleccionada)"
                  class="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors">
            🗑️ Eliminar
          </button>
        </div>

        <!-- Información de mesas unidas -->
        <div v-if="mesasSeleccionadasParaUnir.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Mesas a unir:</span>
          <div class="flex items-center space-x-1">
            <span v-for="mesa in mesasSeleccionadasParaUnir" :key="mesa.id"
                  class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {{ mesa.numero }}
            </span>
          </div>
          <button @click="unirMesasSeleccionadas"
                  :disabled="mesasSeleccionadasParaUnir.length < 2"
                  class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors">
            🔗 Unir ({{ mesasSeleccionadasParaUnir.length }})
          </button>
          <button @click="cancelarUnion"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
            ✖️ Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Canvas Principal del Editor -->
    <div class="flex-1 relative overflow-hidden bg-gray-100">
      <!-- Grid de referencia -->
      <div class="absolute inset-0 opacity-20 pointer-events-none"
           :style="{ 
             backgroundImage: 'radial-gradient(circle, #9CA3AF 1px, transparent 1px)', 
             backgroundSize: `${gridSize}px ${gridSize}px` 
           }">
      </div>

      <!-- Canvas de mesas -->
      <div ref="canvas" 
           class="absolute inset-0 cursor-crosshair"
           @mousedown="onMouseDown"
           @mousemove="onMouseMove"
           @mouseup="onMouseUp"
           @click="onCanvasClick">
        
        <!-- Mesas renderizadas -->
        <div v-for="mesa in mesasCanvas" :key="mesa.id"
             :class="[
               'absolute border-2 rounded-lg transition-all duration-200 cursor-pointer select-none',
               'flex items-center justify-center text-sm font-bold',
               getMesaClasses(mesa),
               mesa.id === mesaSeleccionada?.id ? 'ring-2 ring-purple-500 ring-offset-2' : '',
               mesasSeleccionadasParaUnir.find(m => m.id === mesa.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
             ]"
             :style="getMesaStyles(mesa)"
             @mousedown.stop="onMesaMouseDown($event, mesa)"
             @click.stop="onMesaClick(mesa)">
          
          <!-- Contenido de la mesa -->
          <div class="text-center">
            <div class="text-lg font-bold">{{ mesa.numero }}</div>
            <div class="text-xs opacity-75">{{ mesa.capacidad }}p</div>
            <div v-if="mesa.mesa_unida" class="text-xs bg-blue-100 text-blue-800 rounded px-1 mt-1">
              Unida
            </div>
          </div>

          <!-- Handles de redimensionamiento -->
          <div v-if="mesa.id === mesaSeleccionada?.id && puedeRedimensionar"
               class="absolute inset-0 pointer-events-none">
            <div v-for="handle in resizeHandles" :key="handle.position"
                 :class="[
                   'absolute w-3 h-3 bg-purple-500 border border-white rounded-full pointer-events-auto cursor-pointer',
                   handle.class
                 ]"
                 @mousedown.stop="onResizeStart($event, handle.position, mesa)">
            </div>
          </div>

          <!-- Indicador de conexión para mesas unidas -->
          <div v-if="mesa.mesas_conectadas && mesa.mesas_conectadas.length > 0"
               class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
            {{ mesa.mesas_conectadas.length + 1 }}
          </div>
        </div>

        <!-- Preview de nueva mesa mientras se crea -->
        <div v-if="modoEditor === 'crear' && creandoMesa && tipoMesaSeleccionado"
             :class="[
               'absolute border-2 border-dashed border-purple-400 bg-purple-50 rounded-lg',
               'flex items-center justify-center text-sm font-bold text-purple-700 pointer-events-none'
             ]"
             :style="getPreviewMesaStyles()">
          <div class="text-center">
            <div class="text-lg font-bold">{{ nuevaMesa.numero || '?' }}</div>
            <div class="text-xs">{{ nuevaMesa.capacidad }}p</div>
          </div>
        </div>

        <!-- Indicador de área de unión -->
        <div v-if="modoEditor === 'unir' && mesasSeleccionadasParaUnir.length > 0"
             class="absolute border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded-lg pointer-events-none"
             :style="getUnionAreaStyles()">
        </div>
      </div>

      <!-- Panel lateral de propiedades -->
      <div v-if="mesaSeleccionada" 
           class="absolute top-4 right-4 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
        <h3 class="font-semibold text-gray-900 mb-3">Propiedades de Mesa {{ mesaSeleccionada.numero }}</h3>
        
        <div class="space-y-3">
          <!-- Número de mesa -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input v-model="mesaSeleccionada.numero" type="text" 
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
          </div>

          <!-- Capacidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
            <select v-model="mesaSeleccionada.capacidad" 
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="2">2 personas</option>
              <option value="4">4 personas</option>
              <option value="6">6 personas</option>
              <option value="8">8 personas</option>
              <option value="10">10 personas</option>
              <option value="12">12 personas</option>
            </select>
          </div>

          <!-- Forma -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Forma</label>
            <select v-model="mesaSeleccionada.forma" 
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="cuadrada">🟦 Cuadrada</option>
              <option value="rectangular">📐 Rectangular</option>
              <option value="redonda">⭕ Redonda</option>
              <option value="barra">📏 Barra</option>
            </select>
          </div>

          <!-- Ubicación -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <select v-model="mesaSeleccionada.ubicacion" 
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="interior">🏠 Interior</option>
              <option value="terraza">🌞 Terraza</option>
              <option value="barra">🍺 Barra</option>
              <option value="vip">⭐ VIP</option>
              <option value="ventana">🪟 Ventana</option>
            </select>
          </div>

          <!-- Posición exacta -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">X</label>
              <input v-model.number="mesaSeleccionada.x" type="number" 
                     class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Y</label>
              <input v-model.number="mesaSeleccionada.y" type="number" 
                     class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
          </div>

          <!-- Tamaño -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ancho</label>
              <input v-model.number="mesaSeleccionada.ancho" type="number" min="60" max="200"
                     class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alto</label>
              <input v-model.number="mesaSeleccionada.alto" type="number" min="60" max="200"
                     class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
          </div>

          <!-- Información de mesas unidas -->
          <div v-if="mesaSeleccionada.mesa_unida || (mesaSeleccionada.mesas_conectadas && mesaSeleccionada.mesas_conectadas.length > 0)"
               class="bg-blue-50 rounded-lg p-3">
            <h4 class="text-sm font-medium text-blue-900 mb-2">🔗 Mesa Unida</h4>
            <div v-if="mesaSeleccionada.mesa_unida" class="text-sm text-blue-700 mb-1">
              Parte de grupo: {{ mesaSeleccionada.mesa_unida }}
            </div>
            <div v-if="mesaSeleccionada.mesas_conectadas && mesaSeleccionada.mesas_conectadas.length > 0">
              <div class="text-xs text-blue-600">Conectada con:</div>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="mesa_id in mesaSeleccionada.mesas_conectadas" :key="mesa_id"
                      class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Mesa {{ getMesaNumero(mesa_id) }}
                </span>
              </div>
            </div>
            <button @click="separarMesa(mesaSeleccionada)"
                    class="w-full mt-2 bg-red-100 text-red-700 py-1 px-3 rounded text-sm hover:bg-red-200 transition-colors">
              ✂️ Separar mesa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel inferior con estadísticas -->
    <div class="bg-white border-t border-gray-200 px-6 py-3">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-6">
          <span>📊 Total mesas: <strong>{{ mesasCanvas.length }}</strong></span>
          <span>👥 Capacidad total: <strong>{{ capacidadTotal }}</strong> personas</span>
          <span>🔗 Mesas unidas: <strong>{{ mesasUnidas }}</strong></span>
          <span>📏 Grid: {{ gridSize }}px</span>
        </div>
        <div class="flex items-center space-x-2">
          <span>Zoom:</span>
          <button @click="ajustarZoom(-0.1)" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200">-</button>
          <span class="font-mono">{{ Math.round(zoom * 100) }}%</span>
          <button @click="ajustarZoom(0.1)" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

// Props
interface Props {
  restauranteId: string
  mesasIniciales?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  mesasIniciales: () => []
})

// Emits
const emit = defineEmits<{
  cerrar: []
  guardar: [mesas: any[]]
}>()

// Estado del editor
const modoEditor = ref<'seleccionar' | 'crear' | 'editar' | 'unir' | 'separar'>('seleccionar')
const mesaSeleccionada = ref<any>(null)
const mesasSeleccionadasParaUnir = ref<any[]>([])
const tipoMesaSeleccionado = ref<any>(null)
const hayChangios = ref(false)

// Estado del canvas
const canvas = ref<HTMLElement>()
const zoom = ref(1)
const gridSize = ref(20)

// Estado de interacción
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const resizeHandle = ref<string>('')
const creandoMesa = ref(false)
const previewMesa = ref({ x: 0, y: 0, ancho: 80, alto: 80 })

// Nueva mesa
const nuevaMesa = ref({
  numero: '',
  capacidad: 4,
  forma: 'cuadrada',
  ubicacion: 'interior'
})

// Tipos de mesa disponibles
const tiposMesa = ref([
  { id: 'cuadrada', nombre: 'Cuadrada', icono: '🟦', ancho: 80, alto: 80 },
  { id: 'rectangular', nombre: 'Rectangular', icono: '📐', ancho: 120, alto: 80 },
  { id: 'redonda', nombre: 'Redonda', icono: '⭕', ancho: 90, alto: 90 },
  { id: 'barra', nombre: 'Barra', icono: '📏', ancho: 60, alto: 120 }
])

// Handles de redimensionamiento
const resizeHandles = ref([
  { position: 'nw', class: '-top-1.5 -left-1.5' },
  { position: 'ne', class: '-top-1.5 -right-1.5' },
  { position: 'sw', class: '-bottom-1.5 -left-1.5' },
  { position: 'se', class: '-bottom-1.5 -right-1.5' },
  { position: 'n', class: '-top-1.5 left-1/2 transform -translate-x-1/2' },
  { position: 's', class: '-bottom-1.5 left-1/2 transform -translate-x-1/2' },
  { position: 'w', class: 'top-1/2 -left-1.5 transform -translate-y-1/2' },
  { position: 'e', class: 'top-1/2 -right-1.5 transform -translate-y-1/2' }
])

// Mesas del canvas (estado interno)
const mesasCanvas = ref<any[]>([])

// Computed
const capacidadTotal = computed(() => {
  return mesasCanvas.value.reduce((total, mesa) => total + (mesa.capacidad || 4), 0)
})

const mesasUnidas = computed(() => {
  return mesasCanvas.value.filter(mesa => mesa.mesa_unida || (mesa.mesas_conectadas && mesa.mesas_conectadas.length > 0)).length
})

const puedeRedimensionar = computed(() => {
  return modoEditor.value === 'editar' || modoEditor.value === 'seleccionar'
})

// Métodos de UI
const getMesaClasses = (mesa: any) => {
  const baseClasses = 'bg-white hover:bg-gray-50'
  
  if (mesa.mesa_unida || (mesa.mesas_conectadas && mesa.mesas_conectadas.length > 0)) {
    return `${baseClasses} border-blue-300 bg-blue-50`
  }
  
  switch (mesa.forma) {
    case 'redonda':
      return `${baseClasses} border-green-300 rounded-full`
    case 'barra':
      return `${baseClasses} border-orange-300`
    case 'rectangular':
      return `${baseClasses} border-blue-300`
    default:
      return `${baseClasses} border-gray-300`
  }
}

const getMesaStyles = (mesa: any) => {
  return {
    left: `${mesa.x}px`,
    top: `${mesa.y}px`,
    width: `${mesa.ancho}px`,
    height: `${mesa.alto}px`,
    transform: `scale(${zoom.value})`,
    transformOrigin: 'top left'
  }
}

const getPreviewMesaStyles = () => {
  return {
    left: `${previewMesa.value.x}px`,
    top: `${previewMesa.value.y}px`,
    width: `${previewMesa.value.ancho}px`,
    height: `${previewMesa.value.alto}px`,
    transform: `scale(${zoom.value})`,
    transformOrigin: 'top left'
  }
}

const getUnionAreaStyles = () => {
  if (mesasSeleccionadasParaUnir.value.length === 0) return {}
  
  const mesas = mesasSeleccionadasParaUnir.value
  const minX = Math.min(...mesas.map(m => m.x))
  const minY = Math.min(...mesas.map(m => m.y))
  const maxX = Math.max(...mesas.map(m => m.x + m.ancho))
  const maxY = Math.max(...mesas.map(m => m.y + m.alto))
  
  return {
    left: `${minX - 10}px`,
    top: `${minY - 10}px`,
    width: `${maxX - minX + 20}px`,
    height: `${maxY - minY + 20}px`,
    transform: `scale(${zoom.value})`,
    transformOrigin: 'top left'
  }
}

// Métodos de interacción
const onCanvasClick = (event: MouseEvent) => {
  if (modoEditor.value === 'crear' && tipoMesaSeleccionado.value) {
    crearMesaEnPosicion(event)
  } else if (modoEditor.value === 'seleccionar') {
    mesaSeleccionada.value = null
  }
}

const onMesaClick = (mesa: any) => {
  if (modoEditor.value === 'unir') {
    toggleMesaParaUnir(mesa)
  } else {
    mesaSeleccionada.value = mesa
  }
}

const onMouseDown = (event: MouseEvent) => {
  if (modoEditor.value === 'crear' && tipoMesaSeleccionado.value) {
    creandoMesa.value = true
    actualizarPreviewMesa(event)
  }
}

const onMouseMove = (event: MouseEvent) => {
  if (creandoMesa.value && tipoMesaSeleccionado.value) {
    actualizarPreviewMesa(event)
  }
  
  if (isDragging.value && mesaSeleccionada.value) {
    const rect = canvas.value!.getBoundingClientRect()
    const x = (event.clientX - rect.left) / zoom.value
    const y = (event.clientY - rect.top) / zoom.value
    
    mesaSeleccionada.value.x = Math.round((x - dragStart.value.x) / gridSize.value) * gridSize.value
    mesaSeleccionada.value.y = Math.round((y - dragStart.value.y) / gridSize.value) * gridSize.value
    
    hayChangios.value = true
  }
  
  if (isResizing.value && mesaSeleccionada.value) {
    redimensionarMesa(event)
  }
}

const onMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
  creandoMesa.value = false
}

const onMesaMouseDown = (event: MouseEvent, mesa: any) => {
  if (modoEditor.value === 'seleccionar' || modoEditor.value === 'editar') {
    mesaSeleccionada.value = mesa
    
    const rect = canvas.value!.getBoundingClientRect()
    const x = (event.clientX - rect.left) / zoom.value
    const y = (event.clientY - rect.top) / zoom.value
    
    dragStart.value = {
      x: x - mesa.x,
      y: y - mesa.y
    }
    
    isDragging.value = true
  }
}

const onResizeStart = (event: MouseEvent, handle: string, mesa: any) => {
  event.stopPropagation()
  isResizing.value = true
  resizeHandle.value = handle
  mesaSeleccionada.value = mesa
}

// Métodos de creación y edición
const seleccionarTipoMesa = (tipo: any) => {
  tipoMesaSeleccionado.value = tipo
  modoEditor.value = 'crear'
  
  // Configurar preview
  previewMesa.value.ancho = tipo.ancho
  previewMesa.value.alto = tipo.alto
  nuevaMesa.value.forma = tipo.id
}

const crearMesaEnPosicion = (event: MouseEvent) => {
  if (!tipoMesaSeleccionado.value) return
  
  const rect = canvas.value!.getBoundingClientRect()
  const x = Math.round(((event.clientX - rect.left) / zoom.value) / gridSize.value) * gridSize.value
  const y = Math.round(((event.clientY - rect.top) / zoom.value) / gridSize.value) * gridSize.value
  
  const nuevaMesaObj = {
    id: `mesa_${Date.now()}`,
    numero: nuevaMesa.value.numero || `${mesasCanvas.value.length + 1}`,
    capacidad: nuevaMesa.value.capacidad,
    forma: tipoMesaSeleccionado.value.id,
    ubicacion: nuevaMesa.value.ubicacion,
    x,
    y,
    ancho: tipoMesaSeleccionado.value.ancho,
    alto: tipoMesaSeleccionado.value.alto,
    estado: 'libre',
    creado_en_editor: true
  }
  
  mesasCanvas.value.push(nuevaMesaObj)
  mesaSeleccionada.value = nuevaMesaObj
  hayChangios.value = true
  
  showToast(`Mesa ${nuevaMesaObj.numero} creada`, 'success')
  
  // Incrementar número para la siguiente mesa
  const numeroActual = parseInt(nuevaMesa.value.numero) || mesasCanvas.value.length
  nuevaMesa.value.numero = (numeroActual + 1).toString()
}

const actualizarPreviewMesa = (event: MouseEvent) => {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = Math.round(((event.clientX - rect.left) / zoom.value) / gridSize.value) * gridSize.value
  const y = Math.round(((event.clientY - rect.top) / zoom.value) / gridSize.value) * gridSize.value
  
  previewMesa.value.x = x
  previewMesa.value.y = y
}

const redimensionarMesa = (event: MouseEvent) => {
  if (!mesaSeleccionada.value || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / zoom.value
  const y = (event.clientY - rect.top) / zoom.value
  
  const mesa = mesaSeleccionada.value
  
  switch (resizeHandle.value) {
    case 'se':
      mesa.ancho = Math.max(60, Math.round((x - mesa.x) / gridSize.value) * gridSize.value)
      mesa.alto = Math.max(60, Math.round((y - mesa.y) / gridSize.value) * gridSize.value)
      break
    case 'sw':
      const newWidth = mesa.x + mesa.ancho - x
      if (newWidth >= 60) {
        mesa.ancho = Math.round(newWidth / gridSize.value) * gridSize.value
        mesa.x = Math.round(x / gridSize.value) * gridSize.value
      }
      mesa.alto = Math.max(60, Math.round((y - mesa.y) / gridSize.value) * gridSize.value)
      break
    case 'ne':
      mesa.ancho = Math.max(60, Math.round((x - mesa.x) / gridSize.value) * gridSize.value)
      const newHeight = mesa.y + mesa.alto - y
      if (newHeight >= 60) {
        mesa.alto = Math.round(newHeight / gridSize.value) * gridSize.value
        mesa.y = Math.round(y / gridSize.value) * gridSize.value
      }
      break
    case 'nw':
      const newW = mesa.x + mesa.ancho - x
      const newH = mesa.y + mesa.alto - y
      if (newW >= 60) {
        mesa.ancho = Math.round(newW / gridSize.value) * gridSize.value
        mesa.x = Math.round(x / gridSize.value) * gridSize.value
      }
      if (newH >= 60) {
        mesa.alto = Math.round(newH / gridSize.value) * gridSize.value
        mesa.y = Math.round(y / gridSize.value) * gridSize.value
      }
      break
    case 'e':
      mesa.ancho = Math.max(60, Math.round((x - mesa.x) / gridSize.value) * gridSize.value)
      break
    case 'w':
      const nW = mesa.x + mesa.ancho - x
      if (nW >= 60) {
        mesa.ancho = Math.round(nW / gridSize.value) * gridSize.value
        mesa.x = Math.round(x / gridSize.value) * gridSize.value
      }
      break
    case 's':
      mesa.alto = Math.max(60, Math.round((y - mesa.y) / gridSize.value) * gridSize.value)
      break
    case 'n':
      const nH = mesa.y + mesa.alto - y
      if (nH >= 60) {
        mesa.alto = Math.round(nH / gridSize.value) * gridSize.value
        mesa.y = Math.round(y / gridSize.value) * gridSize.value
      }
      break
  }
  
  hayChangios.value = true
}

const eliminarMesa = (mesa: any) => {
  if (confirm(`¿Estás seguro de eliminar la Mesa ${mesa.numero}?`)) {
    // Si está unida, separar primero
    if (mesa.mesas_conectadas && mesa.mesas_conectadas.length > 0) {
      separarMesa(mesa)
    }
    
    mesasCanvas.value = mesasCanvas.value.filter(m => m.id !== mesa.id)
    mesaSeleccionada.value = null
    hayChangios.value = true
    showToast(`Mesa ${mesa.numero} eliminada`, 'success')
  }
}

// Métodos de unión de mesas
const toggleMesaParaUnir = (mesa: any) => {
  const index = mesasSeleccionadasParaUnir.value.findIndex(m => m.id === mesa.id)
  
  if (index >= 0) {
    mesasSeleccionadasParaUnir.value.splice(index, 1)
  } else {
    if (mesasSeleccionadasParaUnir.value.length < 4) { // Máximo 4 mesas unidas
      mesasSeleccionadasParaUnir.value.push(mesa)
    } else {
      showToast('Máximo 4 mesas pueden unirse', 'warning')
    }
  }
}

const unirMesasSeleccionadas = () => {
  if (mesasSeleccionadasParaUnir.value.length < 2) {
    showToast('Selecciona al menos 2 mesas para unir', 'warning')
    return
  }
  
  const mesas = mesasSeleccionadasParaUnir.value
  const grupoId = `grupo_${Date.now()}`
  
  // Calcular capacidad total
  const capacidadTotal = mesas.reduce((total, mesa) => total + mesa.capacidad, 0)
  
  // Crear configuración de unión
  const idsConectadas = mesas.map(m => m.id)
  
  mesas.forEach(mesa => {
    mesa.mesa_unida = grupoId
    mesa.mesas_conectadas = idsConectadas.filter(id => id !== mesa.id)
    mesa.capacidad_original = mesa.capacidad
    mesa.capacidad_total_grupo = capacidadTotal
  })
  
  hayChangios.value = true
  mesasSeleccionadasParaUnir.value = []
  
  const numerosUnidas = mesas.map(m => m.numero).join(', ')
  showToast(`Mesas ${numerosUnidas} unidas (${capacidadTotal} personas)`, 'success')
}

const separarMesa = (mesa: any) => {
  if (!mesa.mesa_unida && (!mesa.mesas_conectadas || mesa.mesas_conectadas.length === 0)) {
    showToast('Esta mesa no está unida', 'warning')
    return
  }
  
  // Encontrar todas las mesas del grupo
  const mesasGrupo = mesa.mesa_unida 
    ? mesasCanvas.value.filter(m => m.mesa_unida === mesa.mesa_unida)
    : [mesa, ...mesasCanvas.value.filter(m => mesa.mesas_conectadas?.includes(m.id))]
  
  // Separar todas las mesas del grupo
  mesasGrupo.forEach(m => {
    if (m.capacidad_original) {
      m.capacidad = m.capacidad_original
      delete m.capacidad_original
    }
    delete m.mesa_unida
    delete m.mesas_conectadas
    delete m.capacidad_total_grupo
  })
  
  hayChangios.value = true
  mesaSeleccionada.value = null
  
  const numerosUnidas = mesasGrupo.map(m => m.numero).join(', ')
  showToast(`Mesas ${numerosUnidas} separadas`, 'success')
}

const cancelarUnion = () => {
  mesasSeleccionadasParaUnir.value = []
}

// Métodos utilitarios
const getMesaNumero = (mesaId: string) => {
  const mesa = mesasCanvas.value.find(m => m.id === mesaId)
  return mesa?.numero || '?'
}

const ajustarZoom = (delta: number) => {
  zoom.value = Math.max(0.5, Math.min(2, zoom.value + delta))
}

// Métodos principales
const guardarCambios = async () => {
  try {
    // Convertir coordenadas del canvas a datos de base de datos
    const mesasParaGuardar = mesasCanvas.value.map(mesa => ({
      id: mesa.creado_en_editor ? undefined : mesa.id,
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      forma: mesa.forma,
      ubicacion: mesa.ubicacion,
      posicion_x: mesa.x,
      posicion_y: mesa.y,
      ancho: mesa.ancho,
      alto: mesa.alto,
      mesa_unida: mesa.mesa_unida,
      mesas_conectadas: mesa.mesas_conectadas,
      capacidad_total_grupo: mesa.capacidad_total_grupo,
      restaurante_id: props.restauranteId
    }))
    
    emit('guardar', mesasParaGuardar)
    hayChangios.value = false
    showToast('Layout de mesas guardado correctamente', 'success')
    
  } catch (error) {
    console.error('Error guardando layout:', error)
    showToast('Error al guardar el layout', 'error')
  }
}

const resetearEditor = () => {
  if (confirm('¿Estás seguro de resetear todos los cambios?')) {
    cargarMesasIniciales()
    mesaSeleccionada.value = null
    mesasSeleccionadasParaUnir.value = []
    hayChangios.value = false
    showToast('Editor reseteado', 'success')
  }
}

const cerrarEditor = () => {
  if (hayChangios.value) {
    if (confirm('Tienes cambios sin guardar. ¿Estás seguro de cerrar?')) {
      emit('cerrar')
    }
  } else {
    emit('cerrar')
  }
}

const cargarMesasIniciales = () => {
  mesasCanvas.value = props.mesasIniciales.map(mesa => ({
    id: mesa.id,
    numero: mesa.numero,
    capacidad: mesa.capacidad || 4,
    forma: mesa.forma || 'cuadrada',
    ubicacion: mesa.ubicacion || 'interior',
    x: mesa.posicion_x || 100,
    y: mesa.posicion_y || 100,
    ancho: mesa.ancho || 80,
    alto: mesa.alto || 80,
    estado: mesa.estado || 'libre',
    mesa_unida: mesa.mesa_unida,
    mesas_conectadas: mesa.mesas_conectadas,
    capacidad_total_grupo: mesa.capacidad_total_grupo,
    capacidad_original: mesa.capacidad_original
  }))
}

// Eventos de teclado
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Delete' && mesaSeleccionada.value) {
    eliminarMesa(mesaSeleccionada.value)
  } else if (event.key === 'Escape') {
    mesaSeleccionada.value = null
    mesasSeleccionadasParaUnir.value = []
    modoEditor.value = 'seleccionar'
  } else if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    if (hayChangios.value) {
      guardarCambios()
    }
  }
}

// Lifecycle
onMounted(() => {
  cargarMesasIniciales()
  
  // Configurar número inicial para nuevas mesas
  const maxNumero = Math.max(...mesasCanvas.value.map(m => parseInt(m.numero) || 0), 0)
  nuevaMesa.value.numero = (maxNumero + 1).toString()
  
  // Event listeners
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.editor-mesas {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Cursores específicos para diferentes modos */
.cursor-crosshair {
  cursor: crosshair;
}

/* Animaciones suaves */
.transition-all {
  transition: all 0.2s ease;
}

/* Scroll personalizado para el canvas */
.overflow-hidden::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-hidden::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-hidden::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-hidden::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Estilos para handles de redimensionamiento */
.cursor-pointer:hover {
  transform: scale(1.2);
}

/* Efectos visuales para el grid */
.opacity-20 {
  opacity: 0.2;
}

/* Animaciones para las mesas */
@keyframes mesa-created {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.mesa-nueva {
  animation: mesa-created 0.3s ease-out;
}
</style>