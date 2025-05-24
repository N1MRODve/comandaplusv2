<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
    <!-- Modal -->
    <div class="bg-white rounded-t-xl max-w-md w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Tu pedido</h2>
          <p class="text-sm text-gray-600">
            {{ restaurant?.nombre }} - Mesa {{ mesa }}
          </p>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido del carrito -->
      <div class="flex-1 overflow-y-auto">
        <!-- Items del carrito -->
        <div v-if="!cartStore.isEmpty" class="p-4 space-y-4">
          <div 
            v-for="(item, index) in cartStore.items" 
            :key="`${item.id}-${index}`"
            class="flex items-start space-x-3 bg-gray-50 rounded-lg p-3"
          >
            <!-- Imagen -->
            <img 
              v-if="item.imagen" 
              :src="item.imagen" 
              :alt="item.nombre"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            >
            <div v-else class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-900 truncate">{{ item.nombre }}</h4>
              <p class="text-sm text-gray-600">€{{ item.precio.toFixed(2) }} c/u</p>
              
              <!-- Personalizaciones -->
              <div v-if="item.personalizaciones" class="mt-1">
                <p v-if="item.personalizaciones.variante" class="text-xs text-gray-500">
                  {{ item.personalizaciones.variante }}
                </p>
                <p v-if="item.personalizaciones.notas" class="text-xs text-gray-500">
                  Nota: {{ item.personalizaciones.notas }}
                </p>
              </div>

              <!-- Controles de cantidad -->
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="cartStore.updateItemQuantity(index, item.cantidad - 1)"
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.cantidad }}</span>
                  <button 
                    @click="cartStore.updateItemQuantity(index, item.cantidad + 1)"
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <!-- Subtotal y eliminar -->
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">€{{ item.subtotal.toFixed(2) }}</span>
                  <button 
                    @click="cartStore.removeItem(index)"
                    class="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Carrito vacío</h3>
          <p class="mt-1 text-sm text-gray-500">Añade algunos platos para comenzar</p>
        </div>

        <!-- Sección de propina -->
        <div v-if="!cartStore.isEmpty" class="px-4 pb-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Propina (opcional)</h4>
            <div class="grid grid-cols-4 gap-2 mb-3">
              <button 
                v-for="percentage in [10, 15, 20, 25]" 
                :key="percentage"
                @click="cartStore.calculatePropinaByPercentage(percentage)"
                :class="[
                  'py-2 px-3 rounded-lg text-sm font-medium border transition-colors',
                  Math.abs(cartStore.propina - (cartStore.subtotal * percentage / 100)) < 0.01
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ percentage }}%
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Personalizada:</span>
              <input 
                v-model.number="propinaCustom"
                @input="cartStore.updatePropina(propinaCustom || 0)"
                type="number" 
                step="0.5" 
                min="0" 
                placeholder="0.00"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
              <span class="text-sm text-gray-600">€</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con resumen y botones -->
      <div v-if="!cartStore.isEmpty" class="border-t bg-white p-4 space-y-4">
        <!-- Resumen de precios -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-medium">€{{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.descuentos > 0" class="flex justify-between text-sm">
            <span class="text-gray-600">Descuentos</span>
            <span class="font-medium text-green-600">-€{{ cartStore.descuentos.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.propina > 0" class="flex justify-between text-sm">
            <span class="text-gray-600">Propina</span>
            <span class="font-medium">€{{ cartStore.propina.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span>€{{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="space-y-2">
          <button 
            @click="realizarPedido"
            :disabled="processingOrder"
            class="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ processingOrder ? 'Procesando...' : `Pedir ahora • €${cartStore.total.toFixed(2)}` }}
          </button>
          
          <button 
            @click="cartStore.clearCart"
            class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from '@/composables/useToast'

interface Props {
  restaurant: any
  mesa: string | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()
const { crearPedidoMesa } = useSupabase()
const { showToast } = useToast()

// Estado local
const processingOrder = ref(false)
const propinaCustom = ref<number>(cartStore.propina)

// Métodos
const realizarPedido = async () => {
  try {
    processingOrder.value = true
    
    const validation = cartStore.validateCart()
    if (!validation.isValid) {
      showToast(validation.errors[0], 'error')
      return
    }

    const orderData = cartStore.getOrderData()
    
    const { data, error } = await crearPedidoMesa({
      restaurante_id: orderData.restaurante_id!,
      numero_mesa: orderData.numero_mesa!,
      items: orderData.items,
      notas: 'Pedido desde mesa via QR'
    })

    if (error) {
      throw new Error(error.message || 'Error al crear el pedido')
    }

    // Éxito
    showToast('¡Pedido realizado con éxito!', 'success')
    cartStore.clearCart()
    cartStore.clearLocalStorage()
    emit('close')
    
  } catch (error) {
    console.error('Error realizando pedido:', error)
    showToast(error instanceof Error ? error.message : 'Error al realizar el pedido', 'error')
  } finally {
    processingOrder.value = false
  }
}
</script>