<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
    <div class="bg-white rounded-t-xl max-w-md w-full max-h-[95vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0H17M13 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            Tu pedido
          </h2>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span>{{ restaurant?.nombre }}</span>
            <span>•</span>
            <button @click="mostrarGestionMesas = true" class="text-orange-600 font-medium hover:text-orange-700">
              Mesa {{ mesaActual }}
              <svg class="w-3 h-3 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="border-b bg-gray-50">
        <div class="flex">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="tabActiva = tab.id"
            :class="[
              'flex-1 px-4 py-3 text-sm font-medium transition-all duration-200',
              tabActiva === tab.id 
                ? 'text-orange-600 border-b-2 border-orange-500 bg-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
            </svg>
            {{ tab.label }}
            <span v-if="tab.badge" class="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
              {{ tab.badge }}
            </span>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="tabActiva === 'individual'" class="h-full">
          <div v-if="!cartStore.isEmpty" class="p-4 space-y-4">
            <div 
              v-for="(item, index) in cartStore.items" 
              :key="`${item.id}-${index}`"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div class="flex space-x-3">
                <img 
                  v-if="item.imagen" 
                  :src="item.imagen" 
                  :alt="item.nombre"
                  class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                >
                <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span class="text-2xl">🍽️</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-medium text-gray-900">{{ item.nombre }}</h4>
                    <button 
                      @click="cartStore.removeItem(index)"
                      class="text-red-500 hover:text-red-700 p-1 -mt-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">€{{ item.precio.toFixed(2) }} c/u</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                      <button 
                        @click="cartStore.updateItemQuantity(index, item.cantidad - 1)"
                        class="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                      </button>
                      <span class="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{{ item.cantidad }}</span>
                      <button 
                        @click="cartStore.updateItemQuantity(index, item.cantidad + 1)"
                        class="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                    <div class="text-right">
                      <span class="font-bold text-lg text-gray-900">€{{ item.subtotal.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3>
            <p class="text-gray-500 mb-4">Añade algunos platos para comenzar tu pedido</p>
          </div>
        </div>
        </div>

      <div v-if="!cartStore.isEmpty" class="border-t bg-white p-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-medium">€{{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="propinaTotal > 0" class="flex justify-between text-sm">
            <span class="text-gray-600">Propina</span>
            <span class="font-medium">€{{ propinaTotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-xl font-bold border-t pt-2">
            <span>Total</span>
            <span>€{{ totalFinal.toFixed(2) }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <button 
            @click="realizarPedido"
            :disabled="processingOrder"
            class="w-full bg-orange-500 text-white py-4 px-4 rounded-xl font-semibold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{{ processingOrder ? 'Procesando...' : `Pedir ahora • €${totalFinal.toFixed(2)}` }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from '@/composables/useToast'

// --- DEFINICIONES ---
const props = defineProps<{
  restaurant: any
  mesa: string | null
}>()
const emit = defineEmits(['close'])

// --- STORES Y COMPOSABLES ---
const cartStore = useCartStore()
const { crearPedidoMesa } = useSupabase()
const { showToast } = useToast()

// --- ESTADO LOCAL ---
const tabActiva = ref('individual')
const processingOrder = ref(false)
const mostrarGestionMesas = ref(false)
const mesaActual = ref(props.mesa || '1')
const propinaSeleccionada = ref<number | null>(null)
const propinaCustom = ref(0)
const comensales = ref([
  { id: 1, nombre: 'Yo', inicial: 'Y', items: [], total: 0 }
])

// --- DATOS COMPUTADOS ---
const tabs = computed(() => [
  { 
    id: 'individual', 
    label: 'Mi pedido', 
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    badge: cartStore.totalItems > 0 ? cartStore.totalItems : null
  },
  { 
    id: 'compartida', 
    label: 'Compartir', 
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    badge: comensales.value.length > 1 ? comensales.value.length : null
  },
  { 
    id: 'pago', 
    label: 'Pagar', 
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    badge: null
  }
])

const propinaTotal = computed(() => {
  if (propinaSeleccionada.value) {
    return cartStore.subtotal * (propinaSeleccionada.value / 100)
  }
  return propinaCustom.value || 0
})

const totalFinal = computed(() => cartStore.subtotal + propinaTotal.value)

const calcularTotalComensal = (comensal: any) => {
    let total = comensal.total;
    if (comensales.value.length > 1) { // Simplificado para el ejemplo
        total += propinaTotal.value / comensales.value.length;
    }
    return total;
}

// --- FUNCIÓN DE PEDIDO (CORREGIDA Y FINAL) ---
const realizarPedido = async () => {
  if (processingOrder.value) return; // Evita envíos duplicados

  try {
    processingOrder.value = true;
    
    // 1. Validar que el carrito no esté vacío.
    const validation = cartStore.validateCart();
    if (!validation.isValid) {
      showToast(validation.errors[0], 'error');
      return; // Detiene la ejecución si hay un error.
    }

    // 2. Preparar el objeto de datos con los NOMBRES CORRECTOS para la función SQL.
    const orderData = {
      restaurante_id: props.restaurant?.id,
      numero_mesa: mesaActual.value,
      items: cartStore.items.map(item => ({ // Mapeamos para enviar solo lo necesario
        plato_id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        personalizaciones: item.personalizaciones || null
      })),
      subtotal: cartStore.subtotal,
      propina: propinaTotal.value,
      total: totalFinal.value,
      desglose: {
        comensales: comensales.value.map(c => ({
            nombre: c.nombre,
            total_pagado: calcularTotalComensal(c)
        }))
      },
      notas_cocina: "" // Campo para futuras notas de cocina
    };

    // 3. Llamar a la función RPC de Supabase.
    // 'crearPedidoMesa' es la función que importamos de nuestro composable 'useSupabase'.
    const { error } = await crearPedidoMesa(orderData);

    if (error) {
      // Si Supabase devuelve un error, lo lanzamos para que sea capturado.
      throw new Error(error.message || 'Error al conectar con la base de datos');
    }

    // 4. Éxito: notificar al usuario, limpiar y cerrar.
    showToast('¡Pedido realizado con éxito! 🎉', 'success');
    
    cartStore.clearCart();
    cartStore.clearLocalStorage();
    emit('close');
    
  } catch (error) {
    console.error('Error detallado al realizar el pedido:', error);
    showToast(error instanceof Error ? error.message : 'No se pudo realizar el pedido', 'error');
  } finally {
    // 5. Pase lo que pase, aseguramos que el botón se reactive.
    processingOrder.value = false;
  }
}
</script>

<style scoped>
/* Switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #f97316;
}
input:checked + .slider:before {
  transform: translateX(20px);
}
/* Animaciones */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
/* Estilos de scroll */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
