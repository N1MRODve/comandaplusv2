import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import PedidosView from '../views/PedidosView.vue'
import MenuView from '../views/MenuView.vue'
import MenuDigitalView from '../views/MenuDigitalView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SalonView from '../views/SalonView.vue'
import AuthView from '../views/AuthView.vue'
import CreateProfileView from '../views/CreateProfileView.vue'
import PerfilView from '../views/PerfilView.vue'

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
      path: '/perfil/:restaurante_id?',
      name: 'perfil',
      component: PerfilView,
      meta: { 
        requiresAuth: true, 
        requiresProfile: true, 
        roles: ['empleado', 'encargado', 'dueño', 'admin'],
        requiresRestaurantAccess: true
      }
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
      path: '/salon/:restaurante_id?',
      name: 'salon',
      component: SalonView,
      meta: { 
        requiresAuth: true, 
        requiresProfile: true, 
        roles: ['dueño', 'encargado', 'admin'],
        requiresRestaurantAccess: true 
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
      path: '/menu-gestion/:restaurante_id?',
      name: 'menu-gestion',
      component: MenuView,
      meta: { 
        requiresAuth: true, 
        requiresProfile: true, 
        roles: ['encargado', 'dueño', 'admin'],
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

async function waitForProfileLoad(authStore: ReturnType<typeof useAuthStore>, maxAttempts = 30): Promise<void> {
  let attempts = 0
  console.log('NavGuard: Starting to wait for profile load...', { isAuth: authStore.isAuthenticated, hasProfile: authStore.hasProfile, loading: authStore.loading })
  
  while (authStore.isAuthenticated && !authStore.hasProfile && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 150))
    attempts++
    console.log(`NavGuard: Waiting for profile... attempt ${attempts}/${maxAttempts}`, { hasProfile: authStore.hasProfile, loading: authStore.loading })
  }
  
  console.log('NavGuard: Profile wait finished.', { attempts, hasProfile: authStore.hasProfile, maxAttempts })
  
  if (attempts >= maxAttempts && authStore.isAuthenticated && !authStore.hasProfile) {
    console.warn('NavGuard: Profile load timeout - user is authenticated but no profile found')
  }
}

router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore();
    await waitForAuthInit(authStore);

    // Esperar a que termine la carga general
    if (authStore.loading) {
      let retries = 0;
      while (authStore.loading && retries < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
    }

    // Si está autenticado, esperar a que cargue el perfil
    if (authStore.isAuthenticated) {
      await waitForProfileLoad(authStore);
    }

    const { requiresAuth, requiresProfile, roles, requiresDashboardAccess, requiresRestaurantAccess } = to.meta;

    console.log('NavGuard:', { 
      to: to.name, 
      from: from.name, 
      params: to.params, 
      auth: authStore.isAuthenticated, 
      profile: authStore.hasProfile, 
      role: authStore.userRole, 
      currentRestId: authStore.currentRestaurant?.id,
      userRestaurants: authStore.userRestaurants.length 
    });

    // 1. Si requiere autenticación y no está autenticado
    if (requiresAuth && !authStore.isAuthenticated) {
      console.log('NavGuard: Redirecting to auth - not authenticated');
      next({ name: 'auth', query: { redirect: to.fullPath } });
      return;
    }

    // 2. Si está autenticado y va a /auth, redirigir según su estado
    if (authStore.isAuthenticated && to.name === 'auth') {
      console.log('NavGuard: Redirecting from auth - already authenticated');
      
      if (!authStore.hasProfile) {
        console.log('NavGuard: No profile found, redirecting to create-profile');
        next({ name: 'create-profile' });
      } else if (authStore.canAccessDashboard && authStore.userRestaurants.length > 0) {
        // Tiene perfil, puede acceder al dashboard Y tiene restaurantes
        const targetRestaurantId = authStore.currentRestaurant?.id || authStore.userRestaurants[0]?.id;
        console.log('NavGuard: Has profile and restaurants, redirecting to dashboard with ID:', targetRestaurantId);
        next({ name: 'dashboard', params: { restaurante_id: targetRestaurantId }, replace: true });
      } else {
        // Tiene perfil pero no tiene restaurantes, ir a home
        console.log('NavGuard: Has profile but no restaurants, redirecting to home');
        next({ name: 'home' });
      }
      return;
    }

    // 3. Si requiere perfil y no lo tiene
    if (requiresAuth && requiresProfile !== false && authStore.isAuthenticated && !authStore.hasProfile) {
      if (to.name === 'create-profile') {
        next();
        return;
      }
      console.log('NavGuard: Redirecting to create-profile - no profile');
      next({ name: 'create-profile', query: { redirect: to.fullPath } });
      return;
    }

    // 4. Si tiene perfil pero está en create-profile, redirigir
    if (authStore.hasProfile && to.name === 'create-profile') {
      console.log('NavGuard: Redirecting from create-profile - already has profile');
      if (authStore.canAccessDashboard && authStore.userRestaurants.length > 0) {
        const targetRestaurantId = authStore.currentRestaurant?.id || authStore.userRestaurants[0]?.id;
        console.log('NavGuard: Redirecting to dashboard with restaurant ID:', targetRestaurantId);
        next({ name: 'dashboard', params: { restaurante_id: targetRestaurantId }, replace: true });
      } else {
        console.log('NavGuard: No restaurants available, redirecting to home');
        next({ name: 'home' });
      }
      return;
    }

    // 5. Verificar roles si es requerido
    if (roles && authStore.isAuthenticated && authStore.hasProfile) {
      const userRole = authStore.userRole;
      if (!(roles as string[]).includes(userRole)) {
        console.log('NavGuard: Access denied - insufficient role:', { userRole, allowedRoles: roles });
        if (authStore.canAccessDashboard && authStore.userRestaurants.length > 0) {
          const targetRestaurantId = authStore.currentRestaurant?.id || authStore.userRestaurants[0]?.id;
          next({ name: 'dashboard', params: { restaurante_id: targetRestaurantId }, replace: true });
        } else {
          next({ name: 'home' });
        }
        return;
      }
    }

    // 6. Verificar acceso al dashboard
    if (requiresDashboardAccess && authStore.hasProfile && !authStore.canAccessDashboard) {
      console.log('NavGuard: Access denied - no dashboard access');
      next({ name: 'home' });
      return;
    }
    
    // 7. Manejo de rutas que necesitan restaurant_id
    const routesNeedingRestaurantId = ['dashboard', 'pedidos', 'analytics', 'menu-gestion', 'salon', 'perfil'];
    if (routesNeedingRestaurantId.includes(to.name as string) && authStore.hasProfile) {
      
      // Si no tiene restaurantes, enviar a home
      if (authStore.userRestaurants.length === 0) {
        console.log(`NavGuard: No restaurants available for route: ${to.name as string}`);
        next({ name: 'home' });
        return;
      }

      let restauranteIdFromParams = to.params.restaurante_id as string | undefined;

      if (restauranteIdFromParams) {
        // Verificar acceso al restaurante específico
        const hasAccess = await authStore.checkRestaurantAccess(restauranteIdFromParams);
        if (!hasAccess) {
          console.log(`NavGuard: Access denied to restaurant ${restauranteIdFromParams}.`);
          const fallbackRestaurantId = authStore.userRestaurants[0]?.id;
          if (fallbackRestaurantId) {
            authStore.setCurrentRestaurant(fallbackRestaurantId);
            console.log(`NavGuard: Redirecting to dashboard with fallback restaurant ID: ${fallbackRestaurantId}`);
            next({ name: 'dashboard', params: { restaurante_id: fallbackRestaurantId }, replace: true });
          } else {
            console.log('NavGuard: No fallback restaurant available.');
            next({ name: 'home' });
          }
          return;
        }
        if (authStore.currentRestaurant?.id !== restauranteIdFromParams) {
            authStore.setCurrentRestaurant(restauranteIdFromParams);
        }
      } else {
        // No restaurant_id en URL, usar el actual o el primero disponible
        let currentRestIdToUse = authStore.currentRestaurant?.id;
        if (!currentRestIdToUse && authStore.userRestaurants.length > 0 && authStore.userRestaurants[0].id) {
          currentRestIdToUse = authStore.userRestaurants[0].id;
          authStore.setCurrentRestaurant(currentRestIdToUse);
        }

        if (currentRestIdToUse) {
          console.log(`NavGuard: No ID in URL for ${to.name as string}, redirecting with current restaurant ID: ${currentRestIdToUse}`);
          next({ 
            name: to.name as string, 
            params: { ...to.params, restaurante_id: currentRestIdToUse }, 
            query: to.query, 
            replace: true 
          });
          return;
        } else {
          console.log(`NavGuard: No restaurant ID available for route: ${to.name as string}.`);
          next({ name: 'home' }); 
          return;
        }
      }
    }

    console.log('NavGuard: Navigation allowed to:', to.name, to.fullPath);
    next();
    
  } catch (error) {
    console.error('Error in navigation guard:', error);
    if (to.name !== 'home') {
      next({ name: 'home' });
    } else {
      next(); // Avoid loop if already on home and error occurs
    }
  }
});

export default router;