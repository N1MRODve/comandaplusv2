<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-orange-500 to-orange-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            ComandaPlus
          </h1>
          <p class="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
            La plataforma digital que revoluciona la gestión de bares, restaurantes y cafeterías
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/auth"
              class="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Comenzar ahora
            </router-link>
            <button 
              @click="scrollToFeatures"
              class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Ver características
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas en una sola plataforma
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Digitaliza tu restaurante y mejora la experiencia de tus clientes con nuestras herramientas avanzadas
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Menú Digital -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Menú Digital</h3>
            <p class="text-gray-600">
              Clientes acceden al menú escaneando un QR. Fotos, precios, alérgenos y pedidos desde el móvil.
            </p>
          </div>

          <!-- Gestión de Pedidos -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión en Tiempo Real</h3>
            <p class="text-gray-600">
              Pedidos actualizados al instante. Control total desde cocina hasta entrega con notificaciones automáticas.
            </p>
          </div>

          <!-- Analytics -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Analytics y Reportes</h3>
            <p class="text-gray-600">
              Métricas detalladas de ventas, platos populares y rendimiento del negocio para tomar mejores decisiones.
            </p>
          </div>

          <!-- Control de Personal -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Control de Personal</h3>
            <p class="text-gray-600">
              Gestión de turnos, fichaje digital y control horario automático para optimizar la productividad.
            </p>
          </div>

          <!-- Pagos Integrados -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Pagos Sin Contacto</h3>
            <p class="text-gray-600">
              Clientes pagan directamente desde su móvil. Integración con Stripe, Bizum y principales métodos de pago.
            </p>
          </div>

          <!-- Multirestaurante -->
          <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Múltiples Locales</h3>
            <p class="text-gray-600">
              Gestiona varios restaurantes desde una sola cuenta. Control centralizado con datos individualizados.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Aumenta tus ventas hasta un 30%
            </h2>
            <ul class="space-y-4">
              <li class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-lg text-gray-900 font-medium">Reduce errores en pedidos</p>
                  <p class="text-gray-600">Elimina malentendidos entre clientes y personal</p>
                </div>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-lg text-gray-900 font-medium">Mejora la rotación de mesas</p>
                  <p class="text-gray-600">Pedidos más rápidos = más clientes atendidos</p>
                </div>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-lg text-gray-900 font-medium">Optimiza el personal</p>
                  <p class="text-gray-600">Libera tiempo para enfocarse en la calidad del servicio</p>
                </div>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-lg text-gray-900 font-medium">Datos para crecer</p>
                  <p class="text-gray-600">Analytics detallados para tomar mejores decisiones</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="bg-white rounded-lg shadow-xl p-6">
              <div class="text-center">
                <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">ROI Inmediato</h3>
                <p class="text-gray-600 mb-4">Recupera la inversión en menos de 2 meses</p>
                <div class="bg-green-100 rounded-lg p-4">
                  <p class="text-lg font-semibold text-green-800">+30% ventas</p>
                  <p class="text-sm text-green-600">Promedio de nuestros clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p class="text-xl text-gray-600">
            Más de 500 restaurantes confían en ComandaPlus
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 rounded-lg p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span class="font-bold text-orange-600">MR</span>
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">María Rodríguez</h4>
                <p class="text-sm text-gray-600">Propietaria, Tapas El Rincón</p>
              </div>
            </div>
            <p class="text-gray-700 italic">
              "ComandaPlus revolucionó nuestro restaurante. Los clientes están encantados con el menú digital y nosotros hemos reducido errores en un 90%."
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="font-bold text-blue-600">JL</span>
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">José Luis García</h4>
                <p class="text-sm text-gray-600">Chef, Bistró Moderno</p>
              </div>
            </div>
            <p class="text-gray-700 italic">
              "La gestión de pedidos en tiempo real es increíble. Ahora podemos atender más mesas sin perder calidad en el servicio."
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span class="font-bold text-green-600">AM</span>
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">Ana Martínez</h4>
                <p class="text-sm text-gray-600">Gerente, Café Central</p>
              </div>
            </div>
            <p class="text-gray-700 italic">
              "Los analytics nos ayudan a entender mejor a nuestros clientes. Hemos optimizado nuestro menú y aumentado las ventas un 25%."
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-20 bg-orange-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para digitalizar tu restaurante?
        </h2>
        <p class="text-xl text-orange-100 mb-8">
          Únete a los cientos de restaurantes que ya están aumentando sus ventas con ComandaPlus
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/auth"
            class="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Empezar gratis
          </router-link>
          <button 
            @click="scrollToTop"
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
          >
            Solicitar demo
          </button>
        </div>
        <p class="text-orange-200 text-sm mt-4">
          Sin permanencia • Setup gratuito • Soporte 24/7
        </p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">ComandaPlus</h3>
            <p class="text-gray-400 text-sm">
              La plataforma digital que revoluciona la gestión de restaurantes.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Producto</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Características</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Precios</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Integraciones</a></li>
              <li><a href="#" class="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Soporte</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Centro de ayuda</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Estado del servicio</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Documentación</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" class="hover:text-white transition-colors">RGPD</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400 text-sm">
            © 2025 ComandaPlus. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Métodos para scroll suave
const scrollToFeatures = () => {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>