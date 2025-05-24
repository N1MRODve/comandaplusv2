import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css' // Importar estilos de Tailwind

// Función para manejar errores de forma más detallada
function handleAppError(err: unknown, vm: any, info: string) {
  console.group('🚨 Error Global Capturado')
  
  // Log del error principal
  console.error('Error:', err)
  console.error('Info del componente:', info)
  
  // Detalles adicionales del error
  if (err instanceof Error) {
    console.error('Nombre del error:', err.name)
    console.error('Mensaje:', err.message)
    console.error('Stack trace:', err.stack)
    
    // Errores específicos que podemos identificar
    if (err.message.includes('readonly')) {
      console.error('🔍 Error de readonly detectado - probablemente falta importar readonly de Vue')
    }
    
    if (err.message.includes('Supabase')) {
      console.error('🔍 Error de Supabase detectado')
    }
    
    if (err.message.includes('router')) {
      console.error('🔍 Error de router detectado')
    }
  }
  
  // Información del componente Vue si está disponible
  if (vm) {
    console.error('Componente Vue:', vm)
    console.error('Nombre del componente:', vm.$options.name || 'Anónimo')
    console.error('Props del componente:', vm.$props)
    console.error('Ruta actual:', vm.$route?.path)
  }
  
  // Información del entorno
  console.error('Entorno:', import.meta.env.MODE)
  console.error('URL actual:', window.location.href)
  console.error('User Agent:', navigator.userAgent)
  console.error('Timestamp:', new Date().toISOString())
  
  console.groupEnd()
  
  // En desarrollo, también mostrar una notificación visual
  if (import.meta.env.DEV) {
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fee2e2;
      border: 2px solid #dc2626;
      color: #991b1b;
      padding: 16px;
      border-radius: 8px;
      max-width: 400px;
      z-index: 9999;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    `
    
    const errorMessage = err instanceof Error ? err.message : String(err)
    errorDiv.innerHTML = `
      <strong>🚨 Error en ComandaPlus</strong><br>
      <code>${errorMessage}</code><br>
      <small>Componente: ${info}</small>
    `
    
    document.body.appendChild(errorDiv)
    
    // Remover la notificación después de 10 segundos
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv)
      }
    }, 10000)
  }
  
  // Aquí puedes enviar errores a un servicio de logging como Sentry
  // Sentry.captureException(err, {
  //   tags: {
  //     component: vm?.$options.name || 'unknown',
  //     info: info
  //   }
  // })
}

// Crear la aplicación
const app = createApp(App)

// Configurar Pinia (state management)
const pinia = createPinia()
app.use(pinia)

// Configurar router
app.use(router)

// Configuraciones globales de la app
app.config.globalProperties.$appName = 'ComandaPlus'
app.config.globalProperties.$version = '1.0.0'

// Error handler global mejorado
app.config.errorHandler = handleAppError

// Manejar errores no capturados por Vue
window.addEventListener('error', (event) => {
  console.group('🚨 Error JavaScript No Capturado')
  console.error('Error:', event.error)
  console.error('Mensaje:', event.message)
  console.error('Archivo:', event.filename)
  console.error('Línea:', event.lineno)
  console.error('Columna:', event.colno)
  console.groupEnd()
})

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  console.group('🚨 Promise Rechazada No Manejada')
  console.error('Razón:', event.reason)
  console.error('Promise:', event.promise)
  console.groupEnd()
  
  // Prevenir que aparezca en la consola del navegador
  event.preventDefault()
})

// Performance monitoring
if (import.meta.env.DEV) {
  app.config.performance = true
}

// Función para inicializar la aplicación de forma segura
async function initializeApp() {
  try {
    console.log('🚀 Inicializando ComandaPlus...')
    
    // Verificar que los stores estén disponibles
    const { useAuthStore } = await import('./stores/auth')
    const authStore = useAuthStore()
    
    console.log('✅ Store de autenticación inicializado')
    
    // Verificar conexión con Supabase
    const { supabase } = await import('./lib/supabase')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('⚠️ Error al obtener sesión de Supabase:', error.message)
    } else {
      console.log('✅ Conexión con Supabase establecida')
    }
    
    // Montar la aplicación
    app.mount('#app')
    console.log('✅ Aplicación montada correctamente')
    
  } catch (error) {
    console.error('💥 Error fatal al inicializar la aplicación:', error)
    
    // Mostrar página de error básica
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 20px;
      ">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: 300;">
          ⚠️ Error de Inicialización
        </h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
          ComandaPlus no pudo iniciarse correctamente
        </p>
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.9rem;
          max-width: 600px;
          margin-bottom: 2rem;
        ">
          ${error instanceof Error ? error.message : String(error)}
        </div>
        <button onclick="window.location.reload()" style="
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'"
           onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          🔄 Reintentar
        </button>
      </div>
    `
  }
}

// Service Worker registration (para PWA en el futuro)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration)
      })
      .catch((registrationError) => {
        console.error('❌ Error al registrar Service Worker:', registrationError)
      })
  })
}

// Configuraciones adicionales para desarrollo
if (import.meta.env.DEV) {
  // Herramientas de desarrollo
  window.__VUE_APP__ = app
  window.__PINIA__ = pinia
  
  // Logs de debugging
  console.log('🔧 ComandaPlus iniciado en modo desarrollo')
  console.log('📱 Aplicación:', app)
  console.log('🛣️ Router:', router)
  console.log('🗃️ Pinia:', pinia)
  
  // Información del entorno
  console.log('🌍 Variables de entorno:', {
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  })
}

// Inicializar la aplicación
initializeApp()

export { app, pinia }