<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-600 mt-2">
          Gestiona tu información personal y la configuración de tu restaurante
        </p>
      </div>

      <!-- Alertas -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="ml-3 text-sm text-green-800">{{ successMessage }}</p>
        </div>
      </div>

      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 10.586l1.293-1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="ml-3 text-sm text-red-800">{{ errorMessage }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Información Personal -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Información Personal</h2>
            </div>
            
            <form @submit.prevent="updatePersonalInfo" class="p-6 space-y-6">
              <!-- Avatar -->
              <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <img 
                    v-if="personalForm.url_avatar" 
                    :src="personalForm.url_avatar" 
                    :alt="personalForm.nombre_completo"
                    class="w-24 h-24 rounded-full object-cover"
                  />
                  <span v-else class="text-2xl font-bold text-orange-600">
                    {{ getInitials(personalForm.nombre_completo) }}
                  </span>
                </div>
                <button 
                  type="button"
                  class="text-sm text-orange-600 hover:text-orange-500"
                  @click="uploadAvatar"
                >
                  Cambiar foto
                </button>
                <input 
                  ref="avatarInput"
                  type="file" 
                  accept="image/*" 
                  class="hidden"
                  @change="handleAvatarChange"
                />
              </div>

              <!-- Rol (solo lectura) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rol en el sistema
                </label>
                <div class="flex items-center p-3 bg-gray-50 rounded-md">
                  <div class="w-6 h-6 rounded-full mr-3" :class="getRoleBadgeClass(authStore.userRole)"></div>
                  <span class="font-medium text-gray-900 capitalize">{{ authStore.userRole }}</span>
                </div>
              </div>

              <!-- Nombre completo -->
              <div>
                <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  v-model="personalForm.nombre_completo"
                  type="text"
                  required
                  class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <!-- Email (solo lectura) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  :value="personalForm.email"
                  type="email"
                  disabled
                  class="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  El email no se puede modificar
                </p>
              </div>

              <!-- Teléfono -->
              <div>
                <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  v-model="personalForm.telefono"
                  type="tel"
                  class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+34 612 345 678"
                />
              </div>

              <!-- Botón guardar personal -->
              <button
                type="submit"
                :disabled="loadingPersonal"
                class="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <svg v-if="loadingPersonal" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loadingPersonal ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Información del Restaurante -->
        <div class="lg:col-span-2">
          <div v-if="authStore.isDueño || authStore.isEncargado" class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Información del Restaurante</h2>
              <p class="text-sm text-gray-600 mt-1">{{ currentRestaurant?.nombre }}</p>
            </div>

            <form @submit.prevent="updateRestaurantInfo" class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Logo del restaurante -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Logo del restaurante
                  </label>
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        v-if="restaurantForm.url_logo" 
                        :src="restaurantForm.url_logo" 
                        :alt="restaurantForm.nombre"
                        class="w-full h-full object-cover"
                      />
                      <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <button 
                      type="button"
                      class="text-sm text-orange-600 hover:text-orange-500"
                      @click="uploadLogo"
                    >
                      Cambiar logo
                    </button>
                    <input 
                      ref="logoInput"
                      type="file" 
                      accept="image/*" 
                      class="hidden"
                      @change="handleLogoChange"
                    />
                  </div>
                </div>

                <!-- Nombre del restaurante -->
                <div>
                  <label for="nombre_restaurante" class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del restaurante *
                  </label>
                  <input
                    id="nombre_restaurante"
                    v-model="restaurantForm.nombre"
                    type="text"
                    required
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <!-- Tipo de establecimiento -->
                <div>
                  <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de establecimiento
                  </label>
                  <select
                    id="tipo"
                    v-model="restaurantForm.tipo_establecimiento"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="restaurante">Restaurante</option>
                    <option value="café">Café</option>
                    <option value="bar">Bar</option>
                    <option value="pub">Pub</option>
                    <option value="cafetería">Cafetería</option>
                    <option value="gastrobar">Gastrobar</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <!-- Descripción -->
                <div class="md:col-span-2">
                  <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    v-model="restaurantForm.descripcion"
                    rows="3"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe tu restaurante..."
                  ></textarea>
                </div>

                <!-- Dirección -->
                <div>
                  <label for="direccion" class="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    id="direccion"
                    v-model="restaurantForm.direccion"
                    type="text"
                    required
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <!-- Ciudad -->
                <div>
                  <label for="ciudad" class="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    id="ciudad"
                    v-model="restaurantForm.ciudad"
                    type="text"
                    required
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <!-- Teléfono del restaurante -->
                <div>
                  <label for="telefono_restaurante" class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono del restaurante
                  </label>
                  <input
                    id="telefono_restaurante"
                    v-model="restaurantForm.telefono"
                    type="tel"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <!-- Email del restaurante -->
                <div>
                  <label for="email_restaurante" class="block text-sm font-medium text-gray-700 mb-2">
                    Email del restaurante
                  </label>
                  <input
                    id="email_restaurante"
                    v-model="restaurantForm.email"
                    type="email"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <!-- Capacidad máxima -->
                <div>
                  <label for="capacidad" class="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad máxima
                  </label>
                  <input
                    id="capacidad"
                    v-model.number="restaurantForm.capacidad_maxima"
                    type="number"
                    min="1"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <!-- Número de mesas -->
                <div>
                  <label for="mesas" class="block text-sm font-medium text-gray-700 mb-2">
                    Número de mesas
                  </label>
                  <input
                    id="mesas"
                    v-model.number="restaurantForm.numero_mesas"
                    type="number"
                    min="1"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <!-- Horarios de apertura -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Horarios de apertura</h3>
                <div class="space-y-6">
                  <div v-for="dia in diasSemana" :key="dia.key" class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          :id="`${dia.key}-activo`"
                          v-model="horarios[dia.key].activo"
                          class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label :for="`${dia.key}-activo`" class="text-sm font-medium text-gray-900">
                          {{ dia.nombre }}
                        </label>
                      </div>
                      <button
                        v-if="horarios[dia.key].activo"
                        type="button"
                        @click="agregarHorario(dia.key)"
                        class="text-sm text-orange-600 hover:text-orange-500"
                      >
                        + Agregar horario
                      </button>
                    </div>

                    <div v-if="horarios[dia.key].activo" class="space-y-2">
                      <div 
                        v-for="(periodo, index) in horarios[dia.key].periodos" 
                        :key="index"
                        class="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
                      >
                        <input
                          v-model="periodo.apertura"
                          type="time"
                          class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                        <span class="text-gray-500">-</span>
                        <input
                          v-model="periodo.cierre"
                          type="time"
                          class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          v-model="periodo.nombre"
                          type="text"
                          placeholder="Ej: Comida, Cena, Tapas..."
                          class="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button
                          v-if="horarios[dia.key].periodos.length > 1"
                          type="button"
                          @click="eliminarHorario(dia.key, index)"
                          class="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div v-if="!horarios[dia.key].activo" class="text-sm text-gray-500 italic">
                      Cerrado
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón guardar restaurante -->
              <button
                type="submit"
                :disabled="loadingRestaurant"
                class="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <svg v-if="loadingRestaurant" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loadingRestaurant ? 'Guardando...' : 'Guardar cambios del restaurante' }}
              </button>
            </form>
          </div>

          <!-- Vista para empleados -->
          <div v-else class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Información del Restaurante</h2>
            </div>
            <div class="p-6">
              <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Solo lectura</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Como empleado, solo puedes ver la información del restaurante.
                  Contacta al propietario para realizar cambios.
                </p>
              </div>
              
              <!-- Información de solo lectura -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <p class="mt-1 text-sm text-gray-900">{{ currentRestaurant?.nombre }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tipo</label>
                  <p class="mt-1 text-sm text-gray-900 capitalize">{{ currentRestaurant?.tipo_establecimiento }}</p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Dirección</label>
                  <p class="mt-1 text-sm text-gray-900">{{ currentRestaurant?.direccion }}, {{ currentRestaurant?.ciudad }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuraciones adicionales -->
      <div class="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Configuraciones</h2>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <!-- Notificaciones -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-4">Notificaciones</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-700">Pedidos nuevos</p>
                    <p class="text-sm text-gray-500">Recibir notificaciones cuando lleguen nuevos pedidos</p>
                  </div>
                  <input
                    v-model="configuraciones.notificaciones.pedidos_nuevos"
                    type="checkbox"
                    class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-700">Estado de pedidos</p>
                    <p class="text-sm text-gray-500">Notificaciones cuando cambie el estado de los pedidos</p>
                  </div>
                  <input
                    v-model="configuraciones.notificaciones.estado_pedidos"
                    type="checkbox"
                    class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-700">Alertas de inventario</p>
                    <p class="text-sm text-gray-500">Avisos cuando los productos estén agotados</p>
                  </div>
                  <input
                    v-model="configuraciones.notificaciones.inventario"
                    type="checkbox"
                    class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <!-- Tiempo real -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-4">Actualizaciones en tiempo real</h3>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700">Sincronización automática</p>
                  <p class="text-sm text-gray-500">Mantener los datos actualizados automáticamente</p>
                </div>
                <input
                  v-model="configuraciones.tiempo_real.auto_sync"
                  type="checkbox"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <!-- Botón guardar configuraciones -->
            <button
              @click="updateConfigurations"
              :disabled="loadingConfig"
              class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              <svg v-if="loadingConfig" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loadingConfig ? 'Guardando...' : 'Guardar configuraciones' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase, handleSupabaseError } from '@/lib/supabase'

const route = useRoute()
const authStore = useAuthStore()

// Estados de carga
const loadingPersonal = ref(false)
const loadingRestaurant = ref(false)
const loadingConfig = ref(false)

// Mensajes
const successMessage = ref('')
const errorMessage = ref('')

// Referencias a inputs de archivos
const avatarInput = ref<HTMLInputElement>()
const logoInput = ref<HTMLInputElement>()

// Datos reactivos
const currentRestaurant = computed(() => authStore.currentRestaurant)

// Formulario personal
const personalForm = reactive({
  nombre_completo: '',
  email: '',
  telefono: '',
  url_avatar: ''
})

// Formulario restaurante
const restaurantForm = reactive({
  nombre: '',
  tipo_establecimiento: 'restaurante',
  descripcion: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  email: '',
  url_logo: '',
  capacidad_maxima: 50,
  numero_mesas: 10
})

// Horarios con múltiples períodos por día
const diasSemana = [
  { key: 'lunes', nombre: 'Lunes' },
  { key: 'martes', nombre: 'Martes' },
  { key: 'miercoles', nombre: 'Miércoles' },
  { key: 'jueves', nombre: 'Jueves' },
  { key: 'viernes', nombre: 'Viernes' },
  { key: 'sabado', nombre: 'Sábado' },
  { key: 'domingo', nombre: 'Domingo' }
]

const horarios = reactive({
  lunes: { 
    activo: true, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' },
      { apertura: '20:00', cierre: '23:30', nombre: 'Cena' }
    ]
  },
  martes: { 
    activo: true, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' },
      { apertura: '20:00', cierre: '23:30', nombre: 'Cena' }
    ]
  },
  miercoles: { 
    activo: true, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' },
      { apertura: '20:00', cierre: '23:30', nombre: 'Cena' }
    ]
  },
  jueves: { 
    activo: true, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' },
      { apertura: '20:00', cierre: '23:30', nombre: 'Cena' }
    ]
  },
  viernes: { 
    activo: true, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' },
      { apertura: '20:00', cierre: '24:00', nombre: 'Cena' }
    ]
  },
  sabado: { 
    activo: true, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' },
      { apertura: '20:00', cierre: '24:00', nombre: 'Cena' }
    ]
  },
  domingo: { 
    activo: false, 
    periodos: [
      { apertura: '12:00', cierre: '16:00', nombre: 'Comida' }
    ]
  }
})

// Configuraciones
const configuraciones = reactive({
  notificaciones: {
    pedidos_nuevos: true,
    estado_pedidos: true,
    inventario: true
  },
  tiempo_real: {
    auto_sync: true
  }
})

// Funciones utilitarias
const showMessage = (message: string, type: 'success' | 'error') => {
  if (type === 'success') {
    successMessage.value = message
    errorMessage.value = ''
  } else {
    errorMessage.value = message
    successMessage.value = ''
  }
  
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-purple-500',
    dueño: 'bg-orange-500',
    encargado: 'bg-blue-500',
    empleado: 'bg-green-500',
    cliente: 'bg-gray-500'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-500'
}

// Funciones para gestión de horarios
const agregarHorario = (dia: string) => {
  horarios[dia].periodos.push({
    apertura: '09:00',
    cierre: '18:00',
    nombre: 'Nuevo horario'
  })
}

const eliminarHorario = (dia: string, index: number) => {
  if (horarios[dia].periodos.length > 1) {
    horarios[dia].periodos.splice(index, 1)
  }
}

// Funciones de carga de datos
const loadPersonalData = () => {
  if (authStore.profile) {
    personalForm.nombre_completo = authStore.profile.nombre_completo
    personalForm.email = authStore.profile.email
    personalForm.telefono = authStore.profile.telefono || ''
    personalForm.url_avatar = authStore.profile.url_avatar || ''
  }
}

const loadRestaurantData = () => {
  if (currentRestaurant.value) {
    const restaurant = currentRestaurant.value
    restaurantForm.nombre = restaurant.nombre
    restaurantForm.tipo_establecimiento = restaurant.tipo_establecimiento || 'restaurante'
    restaurantForm.descripcion = restaurant.descripcion || ''
    restaurantForm.direccion = restaurant.direccion
    restaurantForm.ciudad = restaurant.ciudad
    restaurantForm.telefono = restaurant.telefono || ''
    restaurantForm.email = restaurant.email || ''
    restaurantForm.url_logo = restaurant.url_logo || ''
    restaurantForm.capacidad_maxima = restaurant.capacidad_maxima || 50
    restaurantForm.numero_mesas = restaurant.numero_mesas || 10

    // Cargar horarios si existen
    if (restaurant.horario_apertura && typeof restaurant.horario_apertura === 'object') {
      Object.keys(horarios).forEach(dia => {
        if (restaurant.horario_apertura[dia]) {
          // Si existe el formato nuevo (con períodos)
          if (restaurant.horario_apertura[dia].periodos) {
            horarios[dia] = { ...horarios[dia], ...restaurant.horario_apertura[dia] }
          } else {
            // Convertir formato antiguo al nuevo
            const horarioAntiguo = restaurant.horario_apertura[dia]
            if (horarioAntiguo.activo) {
              horarios[dia] = {
                activo: true,
                periodos: [{
                  apertura: horarioAntiguo.apertura || '09:00',
                  cierre: horarioAntiguo.cierre || '22:00',
                  nombre: 'Principal'
                }]
              }
            }
          }
        }
      })
    }
  }
}

// Funciones de actualización
const updatePersonalInfo = async () => {
  try {
    loadingPersonal.value = true
    
    const updates = {
      nombre_completo: personalForm.nombre_completo.trim(),
      telefono: personalForm.telefono.trim() || undefined,
      url_avatar: personalForm.url_avatar || undefined
    }

    await authStore.updateProfile(updates)
    showMessage('Información personal actualizada correctamente', 'success')
  } catch (error) {
    console.error('Error updating personal info:', error)
    showMessage('Error al actualizar la información personal', 'error')
  } finally {
    loadingPersonal.value = false
  }
}

const updateRestaurantInfo = async () => {
  if (!currentRestaurant.value) return

  try {
    loadingRestaurant.value = true

    const updates = {
      nombre: restaurantForm.nombre.trim(),
      tipo_establecimiento: restaurantForm.tipo_establecimiento,
      descripcion: restaurantForm.descripcion.trim() || undefined,
      direccion: restaurantForm.direccion.trim(),
      ciudad: restaurantForm.ciudad.trim(),
      telefono: restaurantForm.telefono.trim() || undefined,
      email: restaurantForm.email.trim() || undefined,
      url_logo: restaurantForm.url_logo || undefined,
      capacidad_maxima: restaurantForm.capacidad_maxima,
      numero_mesas: restaurantForm.numero_mesas,
      horario_apertura: { ...horarios }
    }

    const { error } = await supabase
      .from('restaurantes')
      .update(updates)
      .eq('id', currentRestaurant.value.id)

    if (error) throw error

    showMessage('Información del restaurante actualizada correctamente', 'success')
    
    // Recargar datos del restaurante en el store
    if (authStore.profile) {
      await authStore.loadUserRestaurants(authStore.profile.id)
    }
  } catch (error) {
    console.error('Error updating restaurant info:', error)
    const errorInfo = handleSupabaseError(error)
    showMessage(`Error al actualizar el restaurante: ${errorInfo.message}`, 'error')
  } finally {
    loadingRestaurant.value = false
  }
}

const updateConfigurations = async () => {
  try {
    loadingConfig.value = true
    
    // Aquí puedes guardar las configuraciones en localStorage o en la base de datos
    localStorage.setItem('comandaplus_config', JSON.stringify(configuraciones))
    
    showMessage('Configuraciones guardadas correctamente', 'success')
  } catch (error) {
    console.error('Error updating configurations:', error)
    showMessage('Error al guardar las configuraciones', 'error')
  } finally {
    loadingConfig.value = false
  }
}

// Funciones de upload de archivos
const uploadAvatar = () => {
  avatarInput.value?.click()
}

const uploadLogo = () => {
  logoInput.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Aquí implementarías la subida del archivo
    // Por ahora, simulamos con una URL
    personalForm.url_avatar = URL.createObjectURL(file)
    showMessage('Avatar subido correctamente. Haz clic en "Guardar cambios" para aplicar.', 'success')
  }
}

const handleLogoChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Aquí implementarías la subida del archivo
    // Por ahora, simulamos con una URL
    restaurantForm.url_logo = URL.createObjectURL(file)
    showMessage('Logo subido correctamente. Haz clic en "Guardar cambios del restaurante" para aplicar.', 'success')
  }
}

// Cargar configuraciones desde localStorage
const loadConfigurations = () => {
  const saved = localStorage.getItem('comandaplus_config')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(configuraciones, parsed)
    } catch (error) {
      console.error('Error parsing saved configurations:', error)
    }
  }
}

// Inicialización
onMounted(() => {
  loadPersonalData()
  loadRestaurantData()
  loadConfigurations()
})
</script>