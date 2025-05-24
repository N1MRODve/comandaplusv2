<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Analytics & Gestión</h1>
        <div class="flex space-x-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="px-4 py-2 rounded-md text-sm font-medium"
            :class="currentTab === tab.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <!-- Métricas Principales -->
        <section v-if="currentTab === 'metrics'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="metric in mainMetrics"
              :key="metric.name"
              class="bg-white rounded-lg shadow p-6"
            >
              <div class="flex items-center justify-between">
                <component :is="metric.icon" class="h-8 w-8 text-orange-500" />
                <span 
                  :class="metric.trend > 0 ? 'text-green-500' : 'text-red-500'"
                  class="text-sm font-medium"
                >
                  {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
                </span>
              </div>
              <p class="mt-4 text-2xl font-semibold text-gray-900">
                {{ metric.value }}
              </p>
              <p class="text-sm text-gray-500">{{ metric.name }}</p>
            </div>
          </div>

          <!-- Gráficos -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Ventas por Hora</h3>
              <div class="h-64">
                <!-- Aquí irá el gráfico de ventas -->
              </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Platos Más Vendidos</h3>
              <div class="space-y-4">
                <div
                  v-for="item in topItems"
                  :key="item.id"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-lg bg-gray-100"></div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                      <p class="text-sm text-gray-500">{{ item.category }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ item.sales }}</p>
                    <p class="text-sm text-gray-500">ventas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Gestión de Menú -->
        <section v-if="currentTab === 'menu'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Gestión del Menú</h2>
            <button
              @click="openNewItemModal"
              class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Nuevo Plato
            </button>
          </div>

          <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plato
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in menuItems" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-lg bg-gray-100"></div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                        <p class="text-sm text-gray-500">{{ item.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.category }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatPrice(item.price) }}€
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ item.available ? 'Disponible' : 'No disponible' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="editItem(item)"
                      class="text-orange-600 hover:text-orange-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      @click="deleteItem(item)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Control de Empleados -->
        <section v-if="currentTab === 'employees'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Gestión de Empleados</h2>
            <button
              @click="openNewEmployeeModal"
              class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Nuevo Empleado
            </button>
          </div>

          <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="employee in employees" :key="employee.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gray-100"></div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">{{ employee.name }}</p>
                        <p class="text-sm text-gray-500">{{ employee.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ employee.position }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ employee.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(employee.startDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="editEmployee(employee)"
                      class="text-orange-600 hover:text-orange-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      @click="toggleEmployeeStatus(employee)"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      {{ employee.active ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Configuraciones -->
        <section v-if="currentTab === 'settings'" class="space-y-6">
          <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">Información del Restaurante</h3>
              <form @submit.prevent="saveRestaurantInfo" class="mt-6 space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Nombre del Restaurante
                    </label>
                    <input
                      v-model="settings.restaurantName"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <input
                      v-model="settings.phone"
                      type="tel"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Dirección
                    </label>
                    <input
                      v-model="settings.address"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>

            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">Horario de Apertura</h3>
              <div class="mt-6 space-y-4">
                <div
                  v-for="day in weekDays"
                  :key="day.id"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm font-medium text-gray-700">{{ day.name }}</span>
                  <div class="flex items-center space-x-4">
                    <input
                      v-model="settings.hours[day.id].open"
                      type="time"
                      class="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                    <span class="text-gray-500">-</span>
                    <input
                      v-model="settings.hours[day.id].close"
                      type="time"
                      class="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Modales -->
    <AppModal
      :is-open="showItemModal"
      :title="editingItem ? 'Editar Plato' : 'Nuevo Plato'"
      @close="closeItemModal"
    >
      <!-- Contenido del modal para platos -->
    </AppModal>

    <AppModal
      :is-open="showEmployeeModal"
      :title="editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'"
      @close="closeEmployeeModal"
    >
      <!-- Contenido del modal para empleados -->
    </AppModal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, Users, ShoppingBag, Clock } from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppModal from '@/components/ui/AppModal.vue'

const currentTab = ref('metrics')
const showItemModal = ref(false)
const showEmployeeModal = ref(false)
const editingItem = ref(null)
const editingEmployee = ref(null)

const tabs = [
  { id: 'metrics', name: 'Métricas' },
  { id: 'menu', name: 'Menú' },
  { id: 'employees', name: 'Empleados' },
  { id: 'settings', name: 'Configuración' }
]

const mainMetrics = [
  { name: 'Ventas Hoy', value: '1,234€', trend: 12.5, icon: TrendingUp },
  { name: 'Pedidos', value: '48', trend: 8.2, icon: ShoppingBag },
  { name: 'Clientes', value: '156', trend: -2.4, icon: Users },
  { name: 'Tiempo Medio', value: '24m', trend: 5.1, icon: Clock }
]

const topItems = [
  { id: 1, name: 'Hamburguesa Especial', category: 'Hamburguesas', sales: 124 },
  { id: 2, name: 'Pizza Margherita', category: 'Pizzas', sales: 98 },
  { id: 3, name: 'Ensalada César', category: 'Ensaladas', sales: 76 }
]

const menuItems = [
  {
    id: 1,
    name: 'Hamburguesa Especial',
    description: 'Con queso cheddar y bacon',
    category: 'Hamburguesas',
    price: 12.99,
    available: true
  },
  // Más items...
]

const employees = [
  {
    id: 1,
    name: 'Ana García',
    email: 'ana@example.com',
    position: 'Camarera',
    active: true,
    startDate: '2024-01-15'
  },
  // Más empleados...
]

const weekDays = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' }
]

const settings = ref({
  restaurantName: '',
  phone: '',
  address: '',
  hours: weekDays.reduce((acc, day) => ({
    ...acc,
    [day.id]: { open: '09:00', close: '22:00' }
  }), {})
})

const formatPrice = (price: number) => {
  return price.toFixed(2)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const openNewItemModal = () => {
  editingItem.value = null
  showItemModal.value = true
}

const openNewEmployeeModal = () => {
  editingEmployee.value = null
  showEmployeeModal.value = true
}

const closeItemModal = () => {
  showItemModal.value = false
  editingItem.value = null
}

const closeEmployeeModal = () => {
  showEmployeeModal.value = false
  editingEmployee.value = null
}

const editItem = (item: any) => {
  editingItem.value = item
  showItemModal.value = true
}

const deleteItem = async (item: any) => {
  // Implementar lógica de eliminación
}

const editEmployee = (employee: any) => {
  editingEmployee.value = employee
  showEmployeeModal.value = true
}

const toggleEmployeeStatus = async (employee: any) => {
  // Implementar lógica de cambio de estado
}

const saveRestaurantInfo = async () => {
  // Implementar lógica de guardado
}

onMounted(async () => {
  // Cargar datos iniciales
})
</script>
```