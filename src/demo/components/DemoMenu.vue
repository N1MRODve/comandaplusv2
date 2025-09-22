<template>
  <div class="space-y-6">
    <!-- Controles del menú -->
    <div class="demo-card p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Gestión de Menú</h2>
          <p class="text-sm text-gray-600">
            {{ demoStore.categorias.length }} categorías · {{ demoStore.platos.length }} platos
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Botones de acción -->
          <button
            @click="abrirModalCategoria()"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nueva Categoría</span>
          </button>
          
          <button
            v-if="demoStore.categorias.length > 0"
            @click="abrirModalPlato()"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nuevo Plato</span>
          </button>

          <!-- Toggle vista empleado -->
          <button
            @click="vistaEmpleado = !vistaEmpleado"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              vistaEmpleado 
                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ vistaEmpleado ? '👨‍💼 Vista Gestión' : '👨‍🍳 Vista Empleado' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Vista de Empleado (Simplificada) -->
    <div v-if="vistaEmpleado" class="space-y-6">
      <!-- Búsqueda rápida -->
      <div class="demo-card p-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar platos..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="filtroDisponibilidad = 'todos'"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                filtroDisponibilidad === 'todos' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Todos
            </button>
            <button
              @click="filtroDisponibilidad = 'disponible'"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                filtroDisponibilidad === 'disponible' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Disponibles
            </button>
            <button
              @click="filtroDisponibilidad = 'no_disponible'"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                filtroDisponibilidad === 'no_disponible' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Agotados
            </button>
          </div>
        </div>
      </div>

      <!-- Lista simplificada para empleados -->
      <div class="space-y-6">
        <div
          v-for="categoria in categoriasFiltradas"
          :key="categoria.id"
          class="demo-card"
        >
          <div class="px-6 py-4 border-b border-gray-200/50">
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: categoria.color_tema }"
              ></div>
              <h3 class="text-xl font-bold text-gray-900">{{ categoria.nombre }}</h3>
              <span class="demo-badge bg-gray-100 text-gray-800">
                {{ obtenerPlatosDeCategoria(categoria.id).length }} platos
              </span>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="plato in obtenerPlatosDeCategoria(categoria.id)"
                :key="plato.id"
                :class="[
                  'p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                  plato.esta_disponible 
                    ? 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-lg' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                ]"
                @click="toggleDisponibilidad(plato)"
              >
                <div class="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    v-if="plato.url_imagen"
                    :src="plato.url_imagen"
                    :alt="plato.nombre"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-gray-400 text-sm">Sin imagen</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-start justify-between">
                    <h4 class="font-semibold text-gray-900 text-sm leading-tight">
                      {{ plato.nombre }}
                    </h4>
                    <div class="text-right">
                      <span class="text-lg font-bold text-gray-900">
                        €{{ formatCurrency(plato.precio) }}
                      </span>
                      <span v-if="plato.precio_oferta" class="text-sm text-gray-500 line-through ml-1">
                        €{{ formatCurrency(plato.precio_oferta) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button
                        @click.stop="toggleDisponibilidad(plato)"
                        :class="[
                          'px-3 py-1 rounded-full text-xs font-medium transition-all duration-300',
                          plato.esta_disponible
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        ]"
                      >
                        {{ plato.esta_disponible ? '✅ Disponible' : '❌ Agotado' }}
                      </button>
                      
                      <span v-if="plato.es_recomendado" class="demo-badge bg-yellow-100 text-yellow-800 text-xs">
                        ⭐ Top
                      </span>
                      
                      <span v-if="plato.es_nuevo" class="demo-badge bg-blue-100 text-blue-800 text-xs">
                        🆕 Nuevo
                      </span>
                    </div>

                    <div class="flex items-center space-x-1 text-xs text-gray-500">
                      <span v-if="plato.es_vegano" title="Vegano">🌱</span>
                      <span v-if="plato.es_vegetariano && !plato.es_vegano" title="Vegetariano">🥬</span>
                      <span v-if="plato.es_sin_gluten" title="Sin gluten">🌾</span>
                    </div>
                  </div>

                  <div class="text-xs text-gray-500">
                    ⏱️ {{ plato.tiempo_preparacion }} min
                  </div>

                  <div v-if="plato.stock_limitado" class="text-xs text-amber-600">
                    📦 Stock: {{ plato.cantidad_stock }} unidades
                  </div>
                </div>
              </div>
            </div>

            <div v-if="obtenerPlatosDeCategoria(categoria.id).length === 0" class="text-center py-8">
              <p class="text-gray-500">No hay platos en esta categoría</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista de Gestión (Completa) -->
    <div v-else class="space-y-8">
      <!-- Empty state -->
      <div v-if="demoStore.categorias.length === 0" class="demo-card p-12 text-center">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">¡Comienza creando tu menú!</h3>
        <p class="text-gray-600 mb-6">
          Crea categorías para organizar tus platos y empieza a construir tu carta digital.
        </p>
        <button @click="abrirModalCategoria()" class="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium">
          Crear primera categoría
        </button>
      </div>

      <!-- Grid de categorías -->
      <div v-else class="space-y-8">
        <div
          v-for="categoria in demoStore.categorias"
          :key="categoria.id"
          class="demo-card"
        >
          <!-- Header de categoría -->
          <div class="px-6 py-4 border-b border-gray-200/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div 
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: categoria.color_tema }"
                ></div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ categoria.nombre }}</h2>
                  <p v-if="categoria.descripcion" class="text-gray-600 text-sm mt-1">
                    {{ categoria.descripcion }}
                  </p>
                </div>
                <span class="demo-badge bg-gray-100 text-gray-800">
                  {{ categoria.platos.length }} platos
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="abrirModalPlato(categoria)"
                  class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Añadir plato</span>
                </button>
                <button
                  @click="abrirModalCategoria(categoria)"
                  class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  @click="eliminarCategoria(categoria)"
                  class="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Grid de platos de la categoría -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="plato in categoria.platos"
                :key="plato.id"
                :class="[
                  'demo-card group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]',
                  !plato.esta_disponible && 'opacity-60 grayscale'
                ]"
                @click="abrirModalPlato(categoria, plato)"
              >
                <!-- Imagen del plato -->
                <div class="relative aspect-video overflow-hidden rounded-t-2xl">
                  <img
                    v-if="plato.url_imagen"
                    :src="plato.url_imagen"
                    :alt="plato.nombre"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-gray-100  to-gray-200 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span class="text-2xl">🍽️</span>
                      </div>
                      <p class="text-sm text-gray-500 font-medium">Sin imagen</p>
                    </div>
                  </div>

                  <!-- Badges de estado -->
                  <div class="absolute top-3 left-3 flex flex-col space-y-2">
                    <span v-if="plato.es_nuevo" class="demo-badge bg-blue-500 text-white shadow-lg">
                      ✨ Nuevo
                    </span>
                    <span v-if="plato.es_recomendado" class="demo-badge bg-amber-500 text-white shadow-lg">
                      ⭐ Popular
                    </span>
                    <span v-if="plato.precio_oferta" class="demo-badge bg-red-500 text-white shadow-lg">
                      🔥 Oferta
                    </span>
                  </div>

                  <!-- Estado de disponibilidad -->
                  <div class="absolute top-3 right-3">
                    <button
                      @click.stop="toggleDisponibilidad(plato)"
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md transition-all duration-300',
                        plato.esta_disponible
                          ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                          : 'bg-red-500/90 text-white hover:bg-red-600'
                      ]"
                    >
                      {{ plato.esta_disponible ? '✓ Disponible' : '✗ Agotado' }}
                    </button>
                  </div>
                </div>

                <!-- Contenido de la tarjeta -->
                <div class="p-6">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1 mr-3">
                      <h3 class="font-bold text-gray-900 text-lg leading-tight group-hover:text-amber-700 transition-colors">
                        {{ plato.nombre }}
                      </h3>
                      <p v-if="plato.descripcion" class="text-gray-600 text-sm mt-1 line-clamp-2">
                        {{ plato.descripcion }}
                      </p>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <div v-if="plato.precio_oferta" class="space-y-1">
                        <span class="text-2xl font-black text-red-600">
                          €{{ formatCurrency(plato.precio_oferta) }}
                        </span>
                        <div class="text-sm text-gray-500 line-through">
                          €{{ formatCurrency(plato.precio) }}
                        </div>
                      </div>
                      <span v-else class="text-2xl font-black text-gray-900">
                        €{{ formatCurrency(plato.precio) }}
                      </span>
                    </div>
                  </div>

                  <!-- Características del plato -->
                  <div class="flex items-center space-x-4 mb-4 text-sm">
                    <div class="flex items-center text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ plato.tiempo_preparacion }} min
                    </div>
                    <div v-if="plato.calorias" class="flex items-center text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      {{ plato.calorias }} kcal
                    </div>
                  </div>

                  <!-- Badges de dieta -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span v-if="plato.es_vegano" class="demo-badge bg-green-100 text-green-800">
                      🌱 Vegano
                    </span>
                    <span v-if="plato.es_vegetariano && !plato.es_vegano" class="demo-badge bg-blue-100 text-blue-800">
                      🥬 Vegetariano
                    </span>
                    <span v-if="plato.es_sin_gluten" class="demo-badge bg-yellow-100 text-yellow-800">
                      🌾 Sin gluten
                    </span>
                  </div>

                  <!-- Stock limitado -->
                  <div v-if="plato.stock_limitado" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-amber-800">Stock limitado</span>
                      <span class="text-sm font-bold text-amber-900">{{ plato.cantidad_stock }} unidades</span>
                    </div>
                    <div class="w-full bg-amber-200 rounded-full h-2 mt-2">
                      <div 
                        class="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${Math.min((plato.cantidad_stock / 10) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Acciones del pie -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex space-x-2">
                      <button
                        @click.stop="abrirModalPlato(categoria, plato)"
                        class="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        title="Editar plato"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        @click.stop="duplicarPlato(plato)"
                        class="bg-amber-100 text-amber-700 px-3 py-2 rounded-lg hover:bg-amber-200 transition-colors text-sm"
                        title="Duplicar plato"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    <div class="flex space-x-2">
                      <button
                        @click.stop="toggleDisponibilidad(plato)"
                        :class="[
                          'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                          plato.esta_disponible 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        ]"
                      >
                        {{ plato.esta_disponible ? 'Disponible' : 'Agotado' }}
                      </button>
                      <button
                        @click.stop="eliminarPlato(plato)"
                        class="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        title="Eliminar plato"
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
            
            <!-- Empty state para categoría sin platos -->
            <div v-if="categoria.platos.length === 0" class="text-center py-12">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p class="text-gray-500 mb-4">Esta categoría no tiene platos aún</p>
              <button
                @click="abrirModalPlato(categoria)"
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Añadir primer plato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales simplificados -->
    <div v-if="modalCategoriaAbierto" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ categoriaSeleccionada ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h3>
          <button @click="cerrarModalCategoria" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="guardarCategoria" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input
              v-model="formCategoria.nombre"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Entrantes, Platos principales..."
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              v-model="formCategoria.descripcion"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe esta categoría..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                v-model="formCategoria.color_tema"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Icono</label>
              <select
                v-model="formCategoria.icono"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin icono</option>
                <option value="🍽️">🍽️ Platos</option>
                <option value="🥗">🥗 Ensaladas</option>
                <option value="🍕">🍕 Pizzas</option>
                <option value="🍔">🍔 Hamburguesas</option>
                <option value="🍝">🍝 Pastas</option>
                <option value="🥩">🥩 Carnes</option>
                <option value="🐟">🐟 Pescados</option>
                <option value="🍰">🍰 Postres</option>
                <option value="🍹">🍹 Bebidas</option>
                <option value="☕">☕ Cafés</option>
              </select>
            </div>
          </div>
          
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="cerrarModalCategoria"
              class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {{ categoriaSeleccionada ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de plato simplificado -->
    <div v-if="modalPlatoAbierto" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ platoSeleccionado ? 'Editar Plato' : 'Nuevo Plato' }}
          </h3>
          <button @click="cerrarModalPlato" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="guardarPlato" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input
                v-model="formPlato.nombre"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nombre del plato"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
              <select
                v-model="formPlato.categoria_id"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecciona una categoría</option>
                <option v-for="cat in demoStore.categorias" :key="cat.id" :value="cat.id">
                  {{ cat.icono }} {{ cat.nombre }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              v-model="formPlato.descripcion"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Describe el plato..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                <input
                  v-model.number="formPlato.precio"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="12.50"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo (min)</label>
              <input
                v-model.number="formPlato.tiempo_preparacion"
                type="number"
                min="1"
                max="120"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="15"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Calorías</label>
              <input
                v-model.number="formPlato.calorias"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="350"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
            <input
              v-model="formPlato.url_imagen"
              type="url"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            >
          </div>
          
          <!-- Características dietéticas -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Características</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  v-model="formPlato.es_vegano"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                >
                <span class="text-sm font-medium text-gray-700">🌱 Vegano</span>
              </label>

              <label class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  v-model="formPlato.es_vegetariano"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                >
                <span class="text-sm font-medium text-gray-700">🥬 Vegetariano</span>
              </label>

              <label class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  v-model="formPlato.es_sin_gluten"
                  type="checkbox"
                  class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                >
                <span class="text-sm font-medium text-gray-700">🌾 Sin gluten</span>
              </label>

              <label class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  v-model="formPlato.es_recomendado"
                  type="checkbox"
                  class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                >
                <span class="text-sm font-medium text-gray-700">⭐ Recomendado</span>
              </label>

              <label class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  v-model="formPlato.es_nuevo"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                >
                <span class="text-sm font-medium text-gray-700">✨ Nuevo</span>
              </label>
            </div>
          </div>
          
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="cerrarModalPlato"
              class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              {{ platoSeleccionado ? 'Actualizar' : 'Crear' }} Plato
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDemoStore } from '@/demo/stores/useDemoStore'

const demoStore = useDemoStore()

// Estado local
const vistaEmpleado = ref(false)
const filtroRapido = ref('')
const busqueda = ref('')
const filtroDisponibilidad = ref('todos')

// Modales
const modalCategoriaAbierto = ref(false)
const modalPlatoAbierto = ref(false)
const categoriaSeleccionada = ref<any>(null)
const platoSeleccionado = ref<any>(null)

// Formularios
const formCategoria = ref({
  nombre: '',
  descripcion: '',
  color_tema: '#6B7280',
  icono: ''
})

const formPlato = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  categoria_id: '',
  tiempo_preparacion: 15,
  calorias: undefined as number | undefined,
  url_imagen: '',
  es_vegano: false,
  es_vegetariano: false,
  es_sin_gluten: false,
  es_recomendado: false,
  es_nuevo: false
})

// Computed
const categoriasFiltradas = computed(() => {
  return demoStore.categorias.filter(categoria => {
    const platosCategoria = obtenerPlatosDeCategoria(categoria.id)
    return platosCategoria.length > 0
  })
})

const platosFiltrados = computed(() => {
  let platos = [...demoStore.platos]

  // Filtro por búsqueda
  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase()
    platos = platos.filter(plato => 
      plato.nombre.toLowerCase().includes(termino) ||
      plato.descripcion?.toLowerCase().includes(termino) ||
      plato.ingredientes.some(ing => ing.toLowerCase().includes(termino))
    )
  }

  // Filtro por disponibilidad
  switch (filtroDisponibilidad.value) {
    case 'disponible':
      platos = platos.filter(p => p.esta_disponible)
      break
    case 'no_disponible':
      platos = platos.filter(p => !p.esta_disponible)
      break
  }

  return platos
})

// Métodos
const obtenerPlatosDeCategoria = (categoriaId: string) => {
  if (vistaEmpleado.value) {
    return platosFiltrados.value
      .filter(plato => plato.categoria_id === categoriaId)
      .sort((a, b) => a.orden_en_categoria - b.orden_en_categoria)
  }
  
  const categoria = demoStore.categorias.find(c => c.id === categoriaId)
  return categoria?.platos || []
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const toggleDisponibilidad = (plato: any) => {
  demoStore.actualizarDisponibilidadPlato(plato.id, !plato.esta_disponible)
  const estado = plato.esta_disponible ? 'disponible' : 'agotado'
  mostrarNotificacion(`${plato.nombre} marcado como ${estado}`, 'success')
}

// Gestión de categorías
const abrirModalCategoria = (categoria?: any) => {
  categoriaSeleccionada.value = categoria || null
  if (categoria) {
    formCategoria.value = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      color_tema: categoria.color_tema,
      icono: categoria.icono || ''
    }
  } else {
    formCategoria.value = {
      nombre: '',
      descripcion: '',
      color_tema: '#6B7280',
      icono: ''
    }
  }
  modalCategoriaAbierto.value = true
}

const cerrarModalCategoria = () => {
  categoriaSeleccionada.value = null
  modalCategoriaAbierto.value = false
}

const guardarCategoria = () => {
  if (!formCategoria.value.nombre.trim()) return
  
  if (categoriaSeleccionada.value) {
    // Actualizar categoría existente (simulado)
    mostrarNotificacion(`Categoría "${formCategoria.value.nombre}" actualizada`, 'success')
  } else {
    // Crear nueva categoría
    demoStore.crearCategoria(formCategoria.value)
    mostrarNotificacion(`Categoría "${formCategoria.value.nombre}" creada`, 'success')
  }
  
  cerrarModalCategoria()
}

const eliminarCategoria = (categoria: any) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"? También se eliminarán todos sus platos.`)) {
    // Simular eliminación
    const index = demoStore.categorias.findIndex(c => c.id === categoria.id)
    if (index !== -1) {
      demoStore.categorias.splice(index, 1)
      mostrarNotificacion(`Categoría "${categoria.nombre}" eliminada`, 'success')
    }
  }
}

// Gestión de platos
const abrirModalPlato = (categoria?: any, plato?: any) => {
  categoriaSeleccionada.value = categoria || null
  platoSeleccionado.value = plato || null
  
  if (plato) {
    formPlato.value = {
      nombre: plato.nombre,
      descripcion: plato.descripcion || '',
      precio: plato.precio,
      categoria_id: plato.categoria_id,
      tiempo_preparacion: plato.tiempo_preparacion,
      calorias: plato.calorias,
      url_imagen: plato.url_imagen || '',
      es_vegano: plato.es_vegano,
      es_vegetariano: plato.es_vegetariano,
      es_sin_gluten: plato.es_sin_gluten,
      es_recomendado: plato.es_recomendado,
      es_nuevo: plato.es_nuevo
    }
  } else {
    formPlato.value = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria_id: categoria?.id || '',
      tiempo_preparacion: 15,
      calorias: undefined,
      url_imagen: '',
      es_vegano: false,
      es_vegetariano: false,
      es_sin_gluten: false,
      es_recomendado: false,
      es_nuevo: false
    }
  }
  
  modalPlatoAbierto.value = true
}

const cerrarModalPlato = () => {
  categoriaSeleccionada.value = null
  platoSeleccionado.value = null
  modalPlatoAbierto.value = false
}

const guardarPlato = () => {
  if (!formPlato.value.nombre.trim() || !formPlato.value.categoria_id || formPlato.value.precio <= 0) {
    mostrarNotificacion('Por favor completa todos los campos requeridos', 'error')
    return
  }
  
  if (platoSeleccionado.value) {
    // Actualizar plato existente
    demoStore.actualizarPlato(platoSeleccionado.value.id, formPlato.value)
    mostrarNotificacion(`Plato "${formPlato.value.nombre}" actualizado`, 'success')
  } else {
    // Crear nuevo plato
    demoStore.crearPlato(formPlato.value)
    mostrarNotificacion(`Plato "${formPlato.value.nombre}" creado`, 'success')
  }
  
  cerrarModalPlato()
}

const eliminarPlato = (plato: any) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${plato.nombre}"?`)) {
    demoStore.eliminarPlato(plato.id)
    mostrarNotificacion(`Plato "${plato.nombre}" eliminado`, 'success')
  }
}

const duplicarPlato = (plato: any) => {
  const platoDuplicado = {
    ...plato,
    nombre: `${plato.nombre} (copia)`,
    es_nuevo: true
  }
  
  demoStore.crearPlato(platoDuplicado)
  mostrarNotificacion(`Plato "${plato.nombre}" duplicado`, 'success')
}

const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'warning' | 'error') => {
  const colores = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 ${colores[tipo]} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`
  notification.textContent = mensaje
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 2000)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grayscale {
  filter: grayscale(100%);
}
</style>