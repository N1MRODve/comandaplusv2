<template>
  <div v-if="abierto" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" @click="$emit('cerrar')">
    <div class="bg-white rounded-lg p-8 text-center" @click.stop>
      <h2 class="text-2xl font-bold mb-2">Mesa {{ mesa.numero }}</h2>
      <p class="mb-6 text-gray-600">Escanea este código para ver el menú y pedir.</p>

      <div class="p-4 bg-white border-4 border-gray-800 inline-block">
        <QrcodeVue :value="urlMesa" :size="200" level="H" />
      </div>

      <p class="mt-4 text-xs text-gray-500 break-all">{{ urlMesa }}</p>

      <button @click="$emit('cerrar')" class="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg">
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';

const props = defineProps<{
  mesa: any;
  abierto: boolean;
}>();

defineEmits(['cerrar']);

// Construimos la URL que irá dentro del código QR
const urlMesa = computed(() => {
  // Obtenemos la base de la URL actual y la limpiamos
  const baseUrl = window.location.origin;
  const restauranteId = props.mesa.restaurante_id;
  const mesaId = props.mesa.id; // ¡Usamos el ID único de la mesa!

  return `${baseUrl}/menu/${restauranteId}/${mesaId}`;
});
</script>
