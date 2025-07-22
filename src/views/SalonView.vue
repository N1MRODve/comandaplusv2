<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Gestión de Salón</h1>
                <p class="text-sm text-gray-600">
                  {{ authStore.currentRestaurant?.nombre || 'Cargando...' }}
                  <span
                    v-if="salonStore.isRealTimeConnected"
                    class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                    En vivo
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <select
              v-model="vistaActual"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="mapa">Vista Mapa</option>
              <option value="lista">Vista Lista</option>
              <option value="metricas">Métricas</option>
            </select>
            
            <div class="flex items-center space-x-2">
              <button
                @click="filtroRapido = ''"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  filtroRapido === '' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Todas
              </button>
              <button
                @click="filtroRapido = 'ocupada'"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  filtroRapido === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Ocupadas ({{ salonStore.mesasOcupadas }})
              </button>
              <button
                @click="filtroRapido = 'libre'"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  filtroRapido === 'libre' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Libres ({{ salonStore.mesasLibres }})
              </button>
              <button
                @click="filtroRapido = 'atencion'"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  filtroRapido === 'atencion' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Requiere atención ({{ mesasQueNecesitanAtencion.length }})
              </button>
            </div>
            
            <button
              @click="abrirEditorMesas"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              title="Editor de mesas"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editor de Mesas</span>
            </button>

            <button
              @click="actualizarDatos"
              :disabled="salonStore.loading"
              class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <svg
                v-if="salonStore.loading"
                class="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ salonStore.loading ? 'Actualizando...' : 'Actualizar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Ocupación</dt>
                <dd class="text-2xl font-bold text-gray-900">
                  {{ salonStore.mesasOcupadas }}/{{ salonStore.totalMesas }}
                </dd>
                <dd class="text-sm text-gray-600">
                  {{ salonStore.porcentajeOcupacion.toFixed(0) }}% ocupado
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pedidos activos</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ salonStore.pedidosActivos.length }}</dd>
                <dd class="text-sm text-gray-600">
                  {{ salonStore.itemsPendientesTotales }} items pendientes
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Tiempo promedio</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ salonStore.tiempoPromedio }}min</dd>
                <dd class="text-sm text-gray-600">Por mesa</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Ingresos hoy</dt>
                <dd class="text-2xl font-bold text-gray-900">€{{ salonStore.ingresosDelDia.toFixed(0) }}</dd>
                <dd class="text-sm text-gray-600">Del salón</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border">
        <div v-if="vistaActual === 'mapa'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Mapa del Salón</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Leyenda:</span>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Libre</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Ocupada</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Necesita atención</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Fuera de servicio</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div
              v-for="mesa in mesasFiltradas"
              :key="mesa.id"
              @click="seleccionarMesa(mesa)"
              :class="[
                'relative cursor-pointer rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg',
                getMesaClasses(mesa)
              ]"
            >
              <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="text-lg font-bold text-gray-900">{{ mesa.numero }}</div>
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    getMesaIndicatorClasses(mesa),
                    necesitaAtencionUrgente(mesa) ? 'animate-pulse' : ''
                  ]"></div>
                </div>

                <div class="text-xs text-gray-600 mb-3">
                  <div class="flex items-center justify-between">
                    <span>{{ mesa.capacidad }} personas</span>
                    <span v-if="mesa.ubicacion" class="text-gray-500">{{ mesa.ubicacion }}</span>
                  </div>
                </div>

                <div v-if="mesa.pedido_activo" class="space-y-2">
                  <div class="bg-gray-50 rounded-lg p-2">
                    <div class="text-xs font-medium text-gray-900">{{ mesa.pedido_activo.numero_pedido }}</div>
                    <div class="flex items-center justify-between mt-1">
                      <span :class="[
                        'text-xs font-medium',
                        mesa.pedido_activo.tiempo_transcurrido > 60 ? 'text-red-600' :
                        mesa.pedido_activo.tiempo_transcurrido > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      ]">
                        {{ mesa.pedido_activo.tiempo_transcurrido }}min
                      </span>
                      <span class="text-xs font-bold text-gray-900">€{{ mesa.pedido_activo.total.toFixed(2) }}</span>
                    </div>
                  </div>

                  <div class="flex items-center text-xs text-gray-600">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {{ mesa.pedido_activo.comensales }} comensales
                  </div>

                  <div class="flex items-center space-x-2 text-xs">
                    <div v-if="mesa.pedido_activo.items_pendientes > 0"
                         class="flex items-center text-orange-600">
                      <div class="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
                      {{ mesa.pedido_activo.items_pendientes }}
                    </div>
                    <div v-if="mesa.pedido_activo.items_preparacion > 0"
                         class="flex items-center text-blue-600">
                      <div class="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                      {{ mesa.pedido_activo.items_preparacion }}
                    </div>
                    <div v-if="mesa.pedido_activo.items_listos > 0"
                         class="flex items-center text-green-600">
                      <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      {{ mesa.pedido_activo.items_listos }}
                    </div>
                  </div>

                  <div v-if="mesa.pedido_activo.empleado_nombre" class="text-xs text-gray-600 truncate">
                    👤 {{ mesa.pedido_activo.empleado_nombre }}
                  </div>

                  <div class="mt-2">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      mesa.pedido_activo.estado === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                      mesa.pedido_activo.estado === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                      mesa.pedido_activo.estado === 'en_preparacion' ? 'bg-purple-100 text-purple-800' :
                      mesa.pedido_activo.estado === 'listo' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ formatearEstadoPedido(mesa.pedido_activo.estado) }}
                    </span>
                  </div>
                </div>

                <div v-else-if="mesa.estado === 'libre'" class="text-center py-4">
                  <div class="text-green-600 font-medium text-sm">Disponible</div>
                  <div v-if="mesa.ingresos_hoy && mesa.ingresos_hoy > 0" class="text-xs text-gray-500 mt-1">
                    Hoy: €{{ mesa.ingresos_hoy.toFixed(0) }} ({{ mesa.servicios_hoy }} servicios)
                  </div>
                </div>

                <div v-else-if="mesa.estado === 'reservada'" class="text-center py-2">
                  <div class="text-yellow-600 font-medium text-sm">Reservada</div>
                  <div v-if="mesa.nombre_reserva" class="text-xs text-gray-600 mt-1">{{ mesa.nombre_reserva }}</div>
                  <div v-if="mesa.hora_reserva" class="text-xs text-gray-600">{{ mesa.hora_reserva }}</div>
                </div>

                <div v-else-if="mesa.estado === 'fuera_servicio'" class="text-center py-2">
                  <div class="text-blue-600 font-medium text-sm">Fuera de servicio</div>
                  <div v-if="mesa.tiempo_limpieza" class="text-xs text-gray-600 mt-1">
                    Limpieza: {{ mesa.tiempo_limpieza }}min
                  </div>
                </div>

                <div v-if="necesitaAtencionUrgente(mesa)" class="absolute top-2 left-2">
                  <div class="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="mesasFiltradas.length === 0" class="text-center py-12">
            <div class="text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              No hay mesas que coincidan con el filtro seleccionado
            </div>
          </div>
        </div>

        <div v-else-if="vistaActual === 'lista'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Mesas</h2>
          </div>

          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido Activo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comensales</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camarero</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="mesa in mesasFiltradas"
                  :key="mesa.id"
                  :class="[
                    'hover:bg-gray-50 transition-colors',
                    necesitaAtencionUrgente(mesa) ? 'bg-red-50' : ''
                  ]"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div :class="[
                        'w-3 h-3 rounded-full mr-3',
                        getMesaIndicatorClasses(mesa)
                      ]"></div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">Mesa {{ mesa.numero }}</div>
                        <div class="text-sm text-gray-500">{{ mesa.capacidad }} personas</div>
                        <div v-if="mesa.ubicacion" class="text-xs text-gray-400">{{ mesa.ubicacion }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      mesa.estado === 'libre' ? 'bg-green-100 text-green-800' :
                      mesa.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
                      mesa.estado === 'reservada' ? 'bg-yellow-100 text-yellow-800' :
                      mesa.estado === 'fuera_servicio' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ formatearEstado(mesa.estado) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div v-if="mesa.pedido_activo">
                      <div class="font-medium">{{ mesa.pedido_activo.numero_pedido }}</div>
                      <div class="text-xs text-gray-500">
                        <span :class="[
                          mesa.pedido_activo.estado === 'pendiente' ? 'text-orange-600' :
                          mesa.pedido_activo.estado === 'confirmado' ? 'text-blue-600' :
                          mesa.pedido_activo.estado === 'en_preparacion' ? 'text-purple-600' :
                          mesa.pedido_activo.estado === 'listo' ? 'text-green-600' :
                          'text-gray-600'
                        ]">
                          {{ formatearEstadoPedido(mesa.pedido_activo.estado) }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2 mt-1 text-xs">
                        <span v-if="mesa.pedido_activo.items_pendientes > 0" class="text-orange-600">
                          🟡{{ mesa.pedido_activo.items_pendientes }}
                        </span>
                        <span v-if="mesa.pedido_activo.items_preparacion > 0" class="text-blue-600">
                          🔵{{ mesa.pedido_activo.items_preparacion }}
                        </span>
                        <span v-if="mesa.pedido_activo.items_listos > 0" class="text-green-600">
                          🟢{{ mesa.pedido_activo.items_listos }}
                        </span>
                      </div>
                    </div>
                    <div v-else class="text-gray-400">-</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div v-if="mesa.pedido_activo">
                      {{ mesa.pedido_activo.comensales }}/{{ mesa.capacidad }}
                    </div>
                    <div v-else class="text-gray-400">-</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div v-if="mesa.pedido_activo">
                      <span :class="[
                        'font-medium',
                        mesa.pedido_activo.tiempo_transcurrido > 60 ? 'text-red-600' :
                        mesa.pedido_activo.tiempo_transcurrido > 30 ? 'text-yellow-600' :
                        'text-green-600'
                      ]">
                        {{ mesa.pedido_activo.tiempo_transcurrido }}min
                      </span>
                    </div>
                    <div v-else-if="mesa.tiempo_limpieza" class="text-blue-600">
                      {{ mesa.tiempo_limpieza }}min limpieza
                    </div>
                    <div v-else class="text-gray-400">-</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div v-if="mesa.pedido_activo?.empleado_nombre">
                      {{ mesa.pedido_activo.empleado_nombre }}
                    </div>
                    <div v-else class="text-gray-400">-</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div v-if="mesa.pedido_activo">
                      <span class="font-bold">€{{ mesa.pedido_activo.total.toFixed(2) }}</span>
                    </div>
                    <div v-else-if="mesa.ingresos_hoy && mesa.ingresos_hoy > 0" class="text-gray-500">
                      €{{ mesa.ingresos_hoy.toFixed(0) }} hoy
                    </div>
                    <div v-else class="text-gray-400">-</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      @click="cambiarEstadoMesa(mesa, 'libre')"
                      v-if="mesa.estado !== 'libre'"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Marcar como libre"
                    >
                      Liberar
                    </button>
                    <button
                      @click="cambiarEstadoMesa(mesa, 'ocupada')"
                      v-if="mesa.estado === 'libre'"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Marcar como ocupada"
                    >
                      Ocupar
                    </button>
                    <button
                      @click="verDetallesMesa(mesa)"
                      class="text-purple-600 hover:text-purple-900 transition-colors"
                      title="Ver detalles"
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else-if="vistaActual === 'metricas'" class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Métricas Detalladas</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Ocupación por Horas</h3>
              <div class="space-y-3">
                <div v-for="hora in salonStore.ocupacionPorHoras" :key="hora.hora" class="flex items-center">
                  <div class="w-16 text-sm text-gray-600">{{ hora.hora }}:00</div>
                  <div class="flex-1 mx-4">
                    <div class="bg-gray-200 rounded-full h-4 relative">
                      <div
                        class="bg-purple-500 h-4 rounded-full transition-all duration-500"
                        :style="{ width: `${hora.porcentaje}%` }"
                      ></div>
                    </div>
                  </div>
                  <div class="w-12 text-sm text-gray-900 font-medium">{{ hora.porcentaje }}%</div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Mesas Más Rentables (Hoy)</h3>
              <div class="space-y-3">
                <div v-for="(mesa, index) in salonStore.mesasMasRentables" :key="mesa.numero" class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-bold text-purple-600">{{ index + 1 }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">Mesa {{ mesa.numero }}</div>
                    <div class="text-xs text-gray-600">{{ mesa.servicios }} servicios</div>
                  </div>
                  <div class="text-sm font-bold text-gray-900">€{{ mesa.ingresos.toFixed(0) }}</div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Estado Actual</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Mesas libres</span>
                  <span class="text-sm font-medium text-green-600">{{ salonStore.mesasLibres }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Mesas ocupadas</span>
                  <span class="text-sm font-medium text-red-600">{{ salonStore.mesasOcupadas }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Mesas reservadas</span>
                  <span class="text-sm font-medium text-yellow-600">{{ salonStore.mesasReservadas }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Fuera de servicio</span>
                  <span class="text-sm font-medium text-blue-600">{{ salonStore.mesasEnLimpieza }}</span>
                </div>
                <hr class="my-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-900">Capacidad utilizada</span>
                  <span class="text-sm font-bold text-purple-600">{{ salonStore.capacidadUtilizada.toFixed(0) }}%</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Alertas y Atención</h3>
              <div class="space-y-3">
                <div v-if="mesasQueNecesitanAtencion.length === 0" class="text-center text-gray-500 py-4">
                  ✅ Todo en orden
                </div>
                <div v-else>
                  <div v-for="mesa in mesasQueNecesitanAtencion" :key="mesa.id" class="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-red-400">
                    <div>
                      <div class="text-sm font-medium text-gray-900">Mesa {{ mesa.numero }}</div>
                      <div class="text-xs text-red-600">{{ getAlertaDescripcion(mesa) }}</div>
                    </div>
                    <button
                      @click="verDetallesMesa(mesa)"
                      class="text-purple-600 hover:text-purple-900 text-xs font-medium"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mesaSeleccionada" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-screen overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Mesa {{ mesaSeleccionada.numero }}</h3>
          <button @click="mesaSeleccionada = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <div v-if="mesaSeleccionada.pedido_activo" class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Pedido Activo</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Número:</span>
                <span class="font-medium ml-2">{{ mesaSeleccionada.pedido_activo.numero_pedido }}</span>
              </div>
              <div>
                <span class="text-gray-600">Estado:</span>
                <span :class="[
                  'ml-2 px-2 py-1 text-xs font-medium rounded-full',
                  mesaSeleccionada.pedido_activo.estado === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                  mesaSeleccionada.pedido_activo.estado === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                  mesaSeleccionada.pedido_activo.estado === 'en_preparacion' ? 'bg-purple-100 text-purple-800' :
                  mesaSeleccionada.pedido_activo.estado === 'listo' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ formatearEstadoPedido(mesaSeleccionada.pedido_activo.estado) }}
                </span>
              </div>
              <div>
                <span class="text-gray-600">Comensales:</span>
                <span class="font-medium ml-2">{{ mesaSeleccionada.pedido_activo.comensales }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tiempo:</span>
                <span :class="[
                  'font-medium ml-2',
                  mesaSeleccionada.pedido_activo.tiempo_transcurrido > 60 ? 'text-red-600' :
                  mesaSeleccionada.pedido_activo.tiempo_transcurrido > 30 ? 'text-yellow-600' :
                  'text-green-600'
                ]">
                  {{ mesaSeleccionada.pedido_activo.tiempo_transcurrido }}min
                </span>
              </div>
              <div>
                <span class="text-gray-600">Total:</span>
                <span class="font-bold ml-2">€{{ mesaSeleccionada.pedido_activo.total.toFixed(2) }}</span>
              </div>
              <div v-if="mesaSeleccionada.pedido_activo.empleado_nombre">
                <span class="text-gray-600">Camarero:</span>
                <span class="font-medium ml-2">{{ mesaSeleccionada.pedido_activo.empleado_nombre }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Items del pedido:</span>
                <div class="flex items-center space-x-4">
                  <span v-if="mesaSeleccionada.pedido_activo.items_pendientes > 0" class="text-orange-600">
                    🟡 {{ mesaSeleccionada.pedido_activo.items_pendientes }} pendientes
                  </span>
                  <span v-if="mesaSeleccionada.pedido_activo.items_preparacion > 0" class="text-blue-600">
                    🔵 {{ mesaSeleccionada.pedido_activo.items_preparacion }} en preparación
                  </span>
                  <span v-if="mesaSeleccionada.pedido_activo.items_listos > 0" class="text-green-600">
                    🟢 {{ mesaSeleccionada.pedido_activo.items_listos }} listos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado de la mesa</label>
              <select
                v-model="mesaSeleccionada.estado"
                @change="actualizarEstadoMesa"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="libre">Libre</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
                <option value="fuera_servicio">Fuera de servicio</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
              <div class="text-lg font-medium text-gray-900 py-2">{{ mesaSeleccionada.capacidad }} personas</div>
            </div>
          </div>

          <div v-if="mesaSeleccionada.ingresos_hoy || mesaSeleccionada.servicios_hoy" class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Rendimiento de hoy</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Ingresos:</span>
                <span class="font-bold ml-2">€{{ (mesaSeleccionada.ingresos_hoy || 0).toFixed(2) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Servicios:</span>
                <span class="font-medium ml-2">{{ mesaSeleccionada.servicios_hoy || 0 }}</span>
              </div>
            </div>
          </div>

          <div v-if="mesaSeleccionada.historial_reciente && mesaSeleccionada.historial_reciente.length > 0">
            <h4 class="font-medium text-gray-900 mb-3">Historial reciente</h4>
            <div class="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div v-for="evento in mesaSeleccionada.historial_reciente" :key="evento.id" class="text-xs text-gray-600 mb-2 last:mb-0">
                <span class="font-medium">{{ formatearFecha(evento.fecha) }}</span> - {{ evento.descripcion }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            v-if="mesaSeleccionada.estado === 'ocupada'"
            @click="cambiarEstadoMesa(mesaSeleccionada, 'libre')"
            class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Liberar mesa
          </button>
          <button
            v-if="mesaSeleccionada.pedido_activo && mesaSeleccionada.pedido_activo.items_listos > 0"
            @click="marcarPedidoListo(mesaSeleccionada.pedido_activo)"
            class="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Marcar como servido
          </button>
          <button
            @click="mesaSeleccionada = null"
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <div v-if="mostrarEditor" class="fixed inset-0 bg-white z-[100]"> <EditorMesas
        v-if="currentRestaurantId"
        :restaurante-id="currentRestaurantId"
        :mesas-iniciales="JSON.parse(JSON.stringify(salonStore.mesas))" @cerrar="cerrarEditor"
        @guardar="guardarLayoutMesas"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSalonStore } from '@/stores/salon'
import { useToast } from '@/composables/useToast'
import EditorMesas from '@/components/EditorMesas.vue' // IMPORTACIÓN DEL EDITOR

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const salonStore = useSalonStore()
const { showToast } = useToast()

// Estado local
const vistaActual = ref('mapa')
const filtroRapido = ref('')
const mesaSeleccionada = ref<any>(null)
const mostrarEditor = ref(false) // VARIABLE PARA MOSTRAR/OCULTAR EDITOR

// Computed
const currentRestaurantId = computed(() => {
  return route.params.restaurante_id as string || authStore.currentRestaurant?.id
})

const mesasFiltradas = computed(() => {
  let mesas = salonStore.mesas
  
  if (filtroRapido.value) {
    if (filtroRapido.value === 'atencion') {
      mesas = mesasQueNecesitanAtencion.value
    } else {
      mesas = mesas.filter(mesa => mesa.estado === filtroRapido.value)
    }
  }
  
  return mesas
})

const mesasQueNecesitanAtencion = computed(() => {
  return salonStore.mesas.filter(mesa => necesitaAtencionUrgente(mesa))
})

// Métodos de UI
const getMesaClasses = (mesa: any) => {
  const baseClasses = 'p-4' // Ya está en la tarjeta, no es necesario aquí pero mantenemos por si acaso
  
  if (necesitaAtencionUrgente(mesa)) {
    return `bg-red-50 border-red-300 hover:bg-red-100`
  }
  
  switch (mesa.estado) {
    case 'libre':
      return `bg-green-50 border-green-200 hover:bg-green-100`
    case 'ocupada':
      return `bg-red-50 border-red-200 hover:bg-red-100`
    case 'reservada':
      return `bg-yellow-50 border-yellow-200 hover:bg-yellow-100`
    case 'fuera_servicio':
      return `bg-blue-50 border-blue-200 hover:bg-blue-100`
    default:
      return `bg-gray-50 border-gray-200 hover:bg-gray-100`
  }
}

const getMesaIndicatorClasses = (mesa: any) => {
  if (necesitaAtencionUrgente(mesa)) {
    return 'bg-red-500'
  }
  
  switch (mesa.estado) {
    case 'libre': return 'bg-green-500'
    case 'ocupada': return 'bg-red-500'
    case 'reservada': return 'bg-yellow-500'
    case 'fuera_servicio': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}

const necesitaAtencionUrgente = (mesa: any) => {
  if (!mesa.pedido_activo) return false
  
  return (
    mesa.pedido_activo.tiempo_transcurrido > 60 || 
    mesa.pedido_activo.items_listos > 0 || 
    mesa.pedido_activo.estado === 'listo'
  )
}

const getAlertaDescripcion = (mesa: any) => {
  if (!mesa.pedido_activo) return ''
  
  if (mesa.pedido_activo.estado === 'listo') {
    return 'Pedido listo para servir'
  }
  if (mesa.pedido_activo.items_listos > 0) {
    return `${mesa.pedido_activo.items_listos} items listos para servir`
  }
  if (mesa.pedido_activo.tiempo_transcurrido > 60) {
    return `Mesa ocupada ${mesa.pedido_activo.tiempo_transcurrido}min`
  }
  
  return 'Requiere atención'
}

const formatearEstado = (estado: string) => {
  const estados: Record<string, string> = {
    libre: 'Libre',
    ocupada: 'Ocupada',
    reservada: 'Reservada',
    fuera_servicio: 'Fuera de servicio'
  }
  return estados[estado] || estado
}

const formatearEstadoPedido = (estado: string) => {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En preparación',
    listo: 'Listo',
    entregado: 'Entregado'
  }
  return estados[estado] || estado
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Métodos principales
const actualizarDatos = async () => {
  if (!currentRestaurantId.value) return
  
  try {
    await salonStore.cargarDatosSalon(currentRestaurantId.value)
    showToast('Datos actualizados correctamente', 'success')
  } catch (error) {
    console.error('Error actualizando datos:', error)
    showToast('Error al actualizar los datos', 'error')
  }
}

const seleccionarMesa = (mesa: any) => {
  mesaSeleccionada.value = { ...mesa } // Crear una copia para evitar modificar el store directamente en el modal
}

const verDetallesMesa = (mesa: any) => {
  mesaSeleccionada.value = { ...mesa }
}

const cambiarEstadoMesa = async (mesa: any, nuevoEstado: string) => {
  try {
    await salonStore.cambiarEstadoMesa(mesa.id, nuevoEstado)
    showToast(`Mesa ${mesa.numero} marcada como ${formatearEstado(nuevoEstado)}`, 'success')
    if (mesaSeleccionada.value && mesaSeleccionada.value.id === mesa.id) {
        mesaSeleccionada.value.estado = nuevoEstado; // Actualizar estado en el modal si está abierto
        if (nuevoEstado !== 'ocupada') {
          mesaSeleccionada.value.pedido_activo = undefined;
        }
    }
  } catch (error) {
    console.error('Error cambiando estado:', error)
    showToast('Error al cambiar el estado de la mesa', 'error')
  }
}

const actualizarEstadoMesa = async () => { // Se llama desde el select del modal
  if (!mesaSeleccionada.value) return;
  try {
    await salonStore.cambiarEstadoMesa(mesaSeleccionada.value.id, mesaSeleccionada.value.estado)
    showToast(`Mesa ${mesaSeleccionada.value.numero} actualizada a ${formatearEstado(mesaSeleccionada.value.estado)}`, 'success')
    // Limpiar campos según el nuevo estado
    if (mesaSeleccionada.value.estado !== 'ocupada') {
      mesaSeleccionada.value.pedido_activo = undefined
    }
    if (mesaSeleccionada.value.estado !== 'reservada') {
      mesaSeleccionada.value.nombre_reserva = ''
      mesaSeleccionada.value.hora_reserva = ''
    }
  } catch (error) {
    console.error('Error actualizando estado de mesa desde modal:', error);
    showToast('Error al actualizar el estado de la mesa', 'error');
    // Revertir el cambio en el select si falla
    await actualizarDatos(); // Recargar para asegurar consistencia
  }
}


const marcarPedidoListo = async (pedido: any) => {
  try {
    // Aquí implementarías la lógica para marcar el pedido como servido/entregado en el store/backend
    // Ejemplo: await salonStore.marcarPedidoComoEntregado(pedido.id)
    showToast('Pedido marcado como servido (simulado)', 'success')
    if (mesaSeleccionada.value) {
        mesaSeleccionada.value = null // Cerrar modal
    }
    await actualizarDatos()
  } catch (error) {
    console.error('Error marcando pedido como servido:', error)
    showToast('Error al marcar el pedido como servido', 'error')
  }
}

// MÉTODOS PARA EL EDITOR DE MESAS
const abrirEditorMesas = () => {
  mostrarEditor.value = true
}

const cerrarEditor = () => {
  mostrarEditor.value = false
}

const guardarLayoutMesas = async (mesasActualizadas: any[]) => {
  try {
    // Aquí se conectará con la función de Supabase a través del store
    // Ejemplo: await salonStore.guardarLayout(currentRestaurantId.value, mesasActualizadas)
    console.log('Guardando layout de mesas (simulado):', mesasActualizadas)
    
    // Por ahora, simular guardado y actualizar localmente
    // En una implementación real, la función de Supabase devolvería las mesas guardadas
    // y actualizaríamos el store con esa respuesta.
    // salonStore.mesas = mesasActualizadas; // Esto sería si la simulación afectara al store directamente

    showToast('Layout de mesas guardado correctamente (simulado)', 'success')
    mostrarEditor.value = false
    
    // Recargar datos del salón para ver los cambios (importante después de guardar en DB)
    await actualizarDatos() 
  } catch (error) {
    console.error('Error guardando layout:', error)
    showToast('Error al guardar el layout de mesas', 'error')
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🏪 SalonView montado')
  
  try {
    authStore.requireDashboardAccess()
  } catch (error) {
    console.error('Sin acceso al salón:', error)
    await router.push({ name: 'home' })
    return
  }

  if (currentRestaurantId.value) {
    await actualizarDatos()
    salonStore.enableRealTime(currentRestaurantId.value)
  } else {
    console.warn('No se pudo obtener el ID del restaurante para cargar datos del salón.')
    showToast('No se pudo identificar el restaurante.', 'error')
  }
})

onUnmounted(() => {
  console.log('🧹 SalonView desmontado - limpiando...')
  salonStore.cleanup()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Scroll personalizado */
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