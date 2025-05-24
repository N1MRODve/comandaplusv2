import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import PedidosView from '../views/PedidosView.vue'
import MenuDigitalView from '../views/MenuDigitalView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import AuthView from '../views/AuthView.vue'
import CreateProfileView from '../views/CreateProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresAuth: false }
    },
    {
      path: '/create-profile',
      name: 'create-profile',
      component: CreateProfileView,
      meta: { requiresAuth: true, requiresProfile: false }
    },
    {
      path: '/menu/:restaurante_id/:mesa?',
      name: 'menu-digital',
      component: MenuDigitalView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard/:restaurante_id?',
      name: 'dashboard',
      component: DashboardView,
      meta: { 
        requiresAuth: true, 
        requiresProfile: true, 
        roles: ['dueño', 'encargado', 'admin'],
        requiresDashboardAccess: true
      }
    },
    {
      path: '/pedidos/:restaurante_id?',
      name: 'pedidos',
      component: PedidosView,
      meta: { 
        requiresAuth: true, 
        requiresProfile: true, 
        roles: ['empleado', 'encargado', 'dueño', 'admin'],
        requiresRestaurantAccess: true
      }
    },
    {
      path: '/analytics/:restaurante_id?',
      name: 'analytics',
      component: AnalyticsView,
      meta: { 
        requiresAuth: true, 
        requiresProfile: true, 
        roles: ['encargado', 'dueño', 'admin'],
        requiresDashboardAccess: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ]
})

// Función auxiliar para esperar a que el store esté inicializado
async function waitForAuthInit(authStore: ReturnType<typeof useAuthStore>, maxAttempts = 10): Promise<void> {
  let attempts = 0
  
  while (!authStore.isInitialized && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }
  
  if (attempts >= maxAttempts) {
    console.warn('Auth store initialization timeout')
  }
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    // Obtener el store de autenticación
    const authStore = useAuthStore()
    
    // Esperar a que el store esté inicializado
    await waitForAuthInit(authStore)
    
    // Si aún está cargando datos iniciales, esperar un poco más
    if (authStore.loading) {
      let retries = 0
      while (authStore.loading && retries < 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        retries++
      }
    }

    // Verificar autenticación
    const requiresAuth = to.meta.requiresAuth
    const requiresProfile = to.meta.requiresProfile
    const allowedRoles = to.meta.roles as string[] | undefined
    const requiresDashboardAccess = to.meta.requiresDashboardAccess
    const requiresRestaurantAccess = to.meta.requiresRestaurantAccess

    console.log('Navigation guard:', {
      to: to.name,
      requiresAuth,
      isAuthenticated: authStore.isAuthenticated,
      hasProfile: authStore.hasProfile,
      userRole: authStore.userRole,
      allowedRoles
    })

    // Si la ruta requiere autenticación pero no está autenticado
    if (requiresAuth && !authStore.isAuthenticated) {
      console.log('Redirecting to auth - not authenticated')
      next({ name: 'auth', query: { redirect: to.fullPath } })
      return
    }

    // Si está autenticado pero va a auth, redirigir según corresponda
    if (authStore.isAuthenticated && to.name === 'auth') {
      console.log('Redirecting from auth - already authenticated')
      
      if (!authStore.hasProfile) {
        next({ name: 'create-profile' })
      } else if (authStore.canAccessDashboard) {
        next({ name: 'dashboard' })
      } else {
        next({ name: 'home' })
      }
      return
    }

    // Si la ruta requiere perfil pero no lo tiene
    if (requiresAuth && requiresProfile !== false && authStore.isAuthenticated && !authStore.hasProfile) {
      // Si ya está en create-profile, permitir acceso
      if (to.name === 'create-profile') {
        next()
        return
      }
      
      console.log('Redirecting to create-profile - no profile')
      next({ name: 'create-profile', query: { redirect: to.fullPath } })
      return
    }

    // Si tiene perfil pero va a create-profile, redirigir según rol
    if (authStore.hasProfile && to.name === 'create-profile') {
      console.log('Redirecting from create-profile - already has profile')
      
      if (authStore.canAccessDashboard) {
        next({ name: 'dashboard' })
      } else {
        next({ name: 'home' })
      }
      return
    }

    // Verificar roles si están definidos
    if (allowedRoles && authStore.isAuthenticated && authStore.hasProfile) {
      const userRole = authStore.userRole
      if (!allowedRoles.includes(userRole)) {
        console.log('Access denied - insufficient role:', { userRole, allowedRoles })
        
        // Redirigir según las capacidades del usuario
        if (authStore.canAccessDashboard) {
          next({ name: 'dashboard' })
        } else {
          next({ name: 'home' })
        }
        return
      }
    }

    // Verificar acceso específico al dashboard
    if (requiresDashboardAccess && authStore.hasProfile && !authStore.canAccessDashboard) {
      console.log('Access denied - no dashboard access')
      next({ name: 'home' })
      return
    }

    // Verificar acceso a restaurante específico
    if (requiresRestaurantAccess && authStore.hasProfile) {
      const restauranteId = to.params.restaurante_id as string
      
      // Si hay un restaurante específico en la URL, verificar acceso
      if (restauranteId) {
        const hasAccess = await authStore.checkRestaurantAccess(restauranteId)
        if (!hasAccess) {
          console.log('Access denied - no restaurant access:', restauranteId)
          next({ name: 'dashboard' })
          return
        }
        
        // Establecer como restaurante actual si tiene acceso
        authStore.setCurrentRestaurant(restauranteId)
      } else {
        // Si no hay restaurante en la URL pero se requiere acceso, usar el actual
        if (!authStore.currentRestaurant) {
          // Si no tiene restaurante actual y no hay restaurantes disponibles
          if (authStore.userRestaurants.length === 0) {
            console.log('No restaurants available')
            next({ name: 'home' })
            return
          }
          
          // Establecer el primer restaurante como actual
          authStore.setCurrentRestaurant(authStore.userRestaurants[0].id)
        }
        
        // Redirigir incluyendo el restaurante actual en la URL
        if (authStore.currentRestaurant && !to.params.restaurante_id) {
          next({
            name: to.name as string,
            params: { ...to.params, restaurante_id: authStore.currentRestaurant.id },
            query: to.query
          })
          return
        }
      }
    }

    // Manejar rutas de dashboard sin restaurante específico
    if ((to.name === 'dashboard' || to.name === 'analytics') && authStore.hasProfile) {
      const restauranteId = to.params.restaurante_id as string
      
      if (!restauranteId) {
        // Si no hay restaurante en la URL, usar el actual o el primero disponible
        if (!authStore.currentRestaurant && authStore.userRestaurants.length > 0) {
          authStore.setCurrentRestaurant(authStore.userRestaurants[0].id)
        }
        
        if (authStore.currentRestaurant) {
          next({
            name: to.name as string,
            params: { ...to.params, restaurante_id: authStore.currentRestaurant.id },
            query: to.query
          })
          return
        } else {
          // Si no tiene restaurantes, no puede acceder al dashboard
          console.log('No restaurants available for dashboard')
          next({ name: 'home' })
          return
        }
      } else {
        // Verificar que tiene acceso al restaurante específico
        const hasAccess = await authStore.checkRestaurantAccess(restauranteId)
        if (!hasAccess) {
          console.log('Access denied to specific restaurant:', restauranteId)
          next({ name: 'dashboard' }) // Ir al dashboard sin restaurante específico
          return
        }
        
        // Establecer como restaurante actual
        authStore.setCurrentRestaurant(restauranteId)
      }
    }

    // Si todo está bien, continuar
    console.log('Navigation allowed to:', to.name)
    next()
    
  } catch (error) {
    console.error('Error in navigation guard:', error)
    
    // En caso de error, redirigir a home
    if (to.name !== 'home') {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

export default router