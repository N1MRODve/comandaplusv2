<template>
  <div class="space-y-3">
    <!-- Tags existentes -->
    <div v-if="modelValue.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="(tag, index) in modelValue"
        :key="index"
        class="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium group hover:bg-amber-200 transition-colors"
      >
        {{ tag }}
        <button
          @click="removeTag(index)"
          class="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
          type="button"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </span>
    </div>

    <!-- Input para nuevos tags -->
    <div class="relative">
      <input
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        class="form-input pr-12"
        @keydown.enter.prevent="addTag"
        @keydown.comma.prevent="addTag"
        @input="onInput"
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
      >
      
      <!-- Botón para agregar -->
      <button
        v-if="inputValue.trim()"
        @click="addTag"
        type="button"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-amber-600 hover:text-amber-800 transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
      </button>

      <!-- Sugerencias -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-48 overflow-y-auto"
      >
        <button
          v-for="suggestion in filteredSuggestions.slice(0, 8)"
          :key="suggestion"
          @mousedown.prevent="selectSuggestion(suggestion)"
          type="button"
          class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Ayuda -->
    <p class="text-xs text-slate-500">
      Escribe y presiona Enter o usa coma para agregar {{ inputValue.includes(',') ? 'múltiples elementos' : 'un elemento' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string[]
  placeholder?: string
  suggestions?: string[]
  maxTags?: number
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Escribe un elemento y presiona Enter',
  suggestions: () => [],
  maxTags: 20
})

const emit = defineEmits<Emits>()

// Estado local
const inputValue = ref('')
const showSuggestions = ref(false)

// Computed
const filteredSuggestions = computed(() => {
  if (!inputValue.value.trim() || !props.suggestions.length) return []
  
  const search = inputValue.value.toLowerCase().trim()
  return props.suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(search) &&
    !props.modelValue.includes(suggestion)
  )
})

// Métodos
const addTag = () => {
  const value = inputValue.value.trim()
  
  if (!value) return
  
  // Manejar múltiples elementos separados por coma
  const newTags = value.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag && !props.modelValue.includes(tag))
  
  if (newTags.length === 0) {
    inputValue.value = ''
    return
  }
  
  // Verificar límite máximo
  const totalTags = props.modelValue.length + newTags.length
  if (totalTags > props.maxTags) {
    alert(`Máximo ${props.maxTags} elementos permitidos`)
    return
  }
  
  const updatedTags = [...props.modelValue, ...newTags]
  emit('update:modelValue', updatedTags)
  inputValue.value = ''
  showSuggestions.value = false
}

const removeTag = (index: number) => {
  const updatedTags = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', updatedTags)
}

const selectSuggestion = (suggestion: string) => {
  inputValue.value = suggestion
  addTag()
}

const onInput = () => {
  showSuggestions.value = true
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

// Watchers
watch(() => props.modelValue, () => {
  // Opcional: lógica adicional cuando cambia el modelo
}, { deep: true })
</script>

<style scoped>
/* Animaciones para las sugerencias */
.suggestions-enter-active,
.suggestions-leave-active {
  transition: all 0.2s ease;
}

.suggestions-enter-from,
.suggestions-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar personalizado para sugerencias */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}
</style>