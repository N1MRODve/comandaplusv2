<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <div class="flex items-center justify-center mb-8">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl">
              <span class="text-white font-bold text-2xl">C+</span>
            </div>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            ComandaPlus
            <span class="block text-2xl md:text-3xl font-medium text-orange-100 mt-2">
              Demo Interactiva
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl text-orange-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Experimenta todas las funcionalidades de nuestra plataforma de gestión para restaurantes
            <span class="block text-lg mt-2 text-orange-200">
              Sin registro • Sin configuración • 100% funcional
            </span>
          </p>

          <!-- Características destacadas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Gestión de Pedidos</h3>
              <p class="text-orange-100 text-sm">Control total en tiempo real</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Control de Salón</h3>
              <p class="text-orange-100 text-sm">Mesas y ocupación visual</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Analytics Avanzados</h3>
              <p class="text-orange-100 text-sm">Reportes y métricas detalladas</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              <!-- Demo Restaurante -->
              <router-link 
                :to="{ name: 'demo' }"
                class="bg-white/95 backdrop-blur-md text-orange-600 p-8 rounded-2xl font-bold text-lg hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 border border-white/20"
              >
                <div class="text-center">
                  <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Demo Restaurante</h3>
                  <p class="text-sm text-gray-600 mb-4">Gestión completa para restaurantes y comedores</p>
                  <div class="text-xs text-orange-600 font-medium">
                    🍽️ Menú completo • 📊 Analytics • 🏪 Gestión de salón
                  </div>
                </div>
              </router-link>

              <!-- Demo Bar -->
              <router-link 
                :to="{ name: 'demo-bar' }"
                class="bg-white/95 backdrop-blur-md text-purple-600 p-8 rounded-2xl font-bold text-lg hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 border border-white/20"
              >
                <div class="text-center">
                  <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Demo Bar & Pub</h3>
                  <p class="text-sm text-gray-600 mb-4">Especializado en bares, pubs y coctelerías</p>
                  <div class="text-xs text-purple-600 font-medium">
                    🍸 Cócteles • 🍺 Cervezas • 🫒 Tapas • 🌙 Horario nocturno
                  </div>
                </div>
              </router-link>
            </div>
            
            <router-link 
              to="/auth"
              class="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 backdrop-blur-md mt-4"
            >
              Crear Cuenta Gratis
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Features Preview -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Qué puedes probar en la demo?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Una experiencia completa con datos reales simulados para que veas el potencial de ComandaPlus
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Dashboard Interactivo -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Dashboard en Tiempo Real</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                KPIs actualizados automáticamente
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Pedidos activos en tiempo real
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Productos más vendidos
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Gráficos de ventas interactivos
              </li>
            </ul>
          </div>

          <!-- Gestión de Pedidos -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Gestión de Pedidos</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Cambiar estados de pedidos
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Vista de cocina y barra
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Gestión de items individuales
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Alertas de tiempo crítico
              </li>
            </ul>
          </div>

          <!-- Control de Salón -->
          <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200 hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Control de Salón</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Mapa visual del restaurante
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Estados de mesas en tiempo real
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Métricas de ocupación
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Gestión de reservas
              </li>
            </ul>
          </div>

          <!-- Gestión de Menú -->
          <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200 hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Gestión de Menú</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <div class="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                Crear y editar platos
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                Gestión de disponibilidad
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                Categorías personalizables
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                Vista de empleados
              </li>
            </ul>
          </div>

          <!-- Analytics -->
          <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200 hover:shadow-xl transition-all duration-300">
            <div class="w-16 h-16 bg-rose-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Analytics Avanzados</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <div class="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Reportes de ventas detallados
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Productos más populares
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Análisis por horarios
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Exportación de datos
              </li>
            </ul>
          </div>

          <!-- Menú Digital -->
          <div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div class="w-16 h-16 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Menú Digital QR</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <div class="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Experiencia del cliente
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Pedidos sin contacto
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Carrito inteligente
              </li>
              <li class="flex items-center">
                <div class="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Personalización de pedidos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Stats -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Datos de la Demo
          </h2>
          <p class="text-lg text-gray-600">
            Experimenta con datos realistas de un restaurante en funcionamiento
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">6</div>
            <div class="text-sm text-gray-600">Pedidos Activos</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">15</div>
            <div class="text-sm text-gray-600">Mesas Configuradas</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">16</div>
            <div class="text-sm text-gray-600">Platos en Menú</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">4</div>
            <div class="text-sm text-gray-600">Categorías</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Cómo usar la demo
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="text-center">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-orange-600 font-bold text-lg">1</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Explora libremente</h3>
            <p class="text-gray-600 text-sm">
              Navega por todas las secciones y experimenta con las funcionalidades
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-orange-600 font-bold text-lg">2</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Interactúa con todo</h3>
            <p class="text-gray-600 text-sm">
              Cambia estados, crea platos, gestiona mesas - todo es funcional
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-orange-600 font-bold text-lg">3</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Resetea cuando quieras</h3>
            <p class="text-gray-600 text-sm">
              Usa el botón "Resetear Demo" para volver al estado inicial
            </p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <h3 class="text-xl font-bold mb-4">¿Listo para empezar?</h3>
          <p class="text-orange-100 mb-6">
            La demo incluye datos realistas de un restaurante en funcionamiento. 
            Todos los cambios que hagas se guardan temporalmente y se resetean al recargar la página.
          </p>
          <router-link 
            :to="{ name: 'demo' }"
            class="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Comenzar Demo Interactiva
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente es la página de bienvenida a la demo
// No necesita lógica compleja, solo presentación
</script>

<style scoped>
/* Animaciones específicas para la landing */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Efectos de hover mejorados */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Gradientes personalizados */
.bg-gradient-demo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>