import { defineStore } from 'pinia'
import { ref, computed, watch, readonly } from 'vue'
import { supabase, handleSupabaseError } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string 
  auth_user_id: string 
  nombre_completo: string
  email: string
  telefono?: string
  url_avatar?: string
  rol: 'admin' | 'dueño' | 'encargado' | 'empleado' | 'cliente'
  esta_activo: boolean
  creado_el: string
  actualizado_el: string
}

export interface RestauranteWithRole {
  id: string
  nombre: string
  tipo_establecimiento: string 
  descripcion?: string
  direccion: string
  ciudad: string
  telefono?: string
  email?: string
  url_logo?: string
  url_imagen_portada?: string
  propietario_id: string 
  capacidad_maxima: number
  numero_mesas: number
  horario_apertura?: any
  esta_activo: boolean
  fecha_apertura?: string
  redes_sociales?: any
  creado_el: string
  actualizado_el: string
  role: 'dueño' | 'encargado' | 'empleado'
  posicion?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const userRestaurants = ref<RestauranteWithRole[]>([])
  const currentRestaurant = ref<RestauranteWithRole | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)
  const storageKey = 'comandaplus'

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => profile.value?.rol || 'cliente')
  const hasProfile = computed(() => !!profile.value)
  const isDueño = computed(() => profile.value?.rol === 'dueño')
  const isEncargado = computed(() => profile.value?.rol === 'encargado')
  const isEmpleado = computed(() => profile.value?.rol === 'empleado')
  const isAdmin = computed(() => profile.value?.rol === 'admin')
  const canAccessDashboard = computed(() => 
    isDueño.value || isEncargado.value || isAdmin.value || isEmpleado.value
  )
  // CORREGIDO: Usar profile.value.id en lugar de profile.value.auth_user_id
  const isCurrentRestaurantOwner = computed(() => 
    currentRestaurant.value?.propietario_id === profile.value?.id
  )
  const currentRestaurantRole = computed(() => currentRestaurant.value?.role)
  
  const currentRestaurantPermissions = computed(() => {
    if (!currentRestaurant.value) return {}
    
    const role = currentRestaurant.value.role
    return {
      canManageMenu: role === 'dueño' || role === 'encargado',
      canManageEmployees: role === 'dueño',
      canViewAnalytics: role === 'dueño' || role === 'encargado',
      canManageOrders: true,
      canViewReports: role === 'dueño' || role === 'encargado'
    }
  })

  watch(user, async (newUser, oldUser) => {
    console.log('AuthStore: User watcher triggered. New user:', newUser?.email);
    if (newUser) {
      await loadUserProfile(newUser.id)
      if (profile.value) {
        await loadUserRestaurants(profile.value.id) 
        loadCurrentRestaurantFromStorage();
      } else {
        userRestaurants.value = [];
        setCurrentRestaurant(null);
      }
    } else {
      profile.value = null
      userRestaurants.value = []
      setCurrentRestaurant(null)
    }
  })

  async function initialize() {
    if (isInitialized.value) return
    console.log('AuthStore: Initializing...');
    try {
      loading.value = true
      error.value = null
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      console.log('AuthStore: Initial session user:', session?.user?.email);
      user.value = session?.user || null; 

      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('AuthStore: onAuthStateChange event:', event, 'Session user:', newSession?.user?.email);
        const authUser = newSession?.user || null;
        if (user.value?.id !== authUser?.id || (user.value && !authUser) || (!user.value && authUser)) {
            user.value = authUser; // Esto dispara el watcher
        }
      })
      isInitialized.value = true
      console.log('AuthStore: Initialized successfully.');
    } catch (err: any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message;
    } finally {
      loading.value = false
    }
  }
  
  async function loadUser() {
    console.log('AuthStore: loadUser function CALLED');
    try {
      loading.value = true; 
      error.value = null;
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('AuthStore: supabase.auth.getUser() response:', currentUser?.email);
      user.value = currentUser; // Esto dispara el watcher
      if (!currentUser) {
         profile.value = null; 
         userRestaurants.value = []; 
         setCurrentRestaurant(null);
      }
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message;
    } finally {
      loading.value = false;
    }
  }

  async function loadUserProfile(authUserId: string) {
    console.log(`AuthStore: loadUserProfile for auth_user_id: ${authUserId}`);
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('perfiles').select('*').eq('auth_user_id', authUserId).single();
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      profile.value = userProfile || null;
      console.log('AuthStore: Profile loaded:', profile.value);
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message; 
      profile.value = null;
      console.error('AuthStore: Error loading profile:', errorInfo.message);
    }
  }

  async function loadUserRestaurants(perfilIdDeTablaPerfiles: string) {
    console.log(`AuthStore: loadUserRestaurants for perfil_id (PK de perfiles): ${perfilIdDeTablaPerfiles}`);
    if (!profile.value || !profile.value.id) {
      console.warn('AuthStore: Cannot load restaurants, profile or profile.id is missing.');
      userRestaurants.value = []; 
      setCurrentRestaurant(null); 
      return;
    }
    try {
      loading.value = true;
      const loadedRestaurants: RestauranteWithRole[] = [];
      
      // CORREGIDO: Usar profile.value.id en lugar de profile.value.auth_user_id
      console.log(`AuthStore: Fetching owned restaurants for perfil_id (FK de restaurantes.propietario_id): ${profile.value.id}`);
      const { data: owned, error: ownedError } = await supabase
        .from('restaurantes').select('*').eq('propietario_id', profile.value.id).eq('esta_activo', true);
      if (ownedError) { 
        console.error('AuthStore: Error fetching owned restaurants:', ownedError); 
        throw ownedError; 
      }
      if (owned) {
        loadedRestaurants.push(...owned.map(r => ({ ...r, role: 'dueño' as const })));
      }
      console.log('AuthStore: Owned restaurants fetched:', owned);

      console.log(`AuthStore: Fetching assigned restaurants for perfil_id (FK de empleados.perfil_id): ${perfilIdDeTablaPerfiles}`);
      const { data: assigned, error: assignedError } = await supabase
        .from('empleados').select('posicion, restaurantes!inner (*)').eq('perfil_id', perfilIdDeTablaPerfiles)
        .eq('esta_activo', true).eq('restaurantes.esta_activo', true);
      if (assignedError) { 
        console.error('AuthStore: Error fetching assigned restaurants:', assignedError); 
        throw assignedError; 
      }
      if (assigned) {
        assigned.forEach(a => {
          const restaurantData = a.restaurantes as any;
          if (restaurantData && !loadedRestaurants.some(lr => lr.id === restaurantData.id)) {
            loadedRestaurants.push({ 
              ...restaurantData, 
              role: (a.posicion === 'encargado' || a.posicion === 'encargada' ? 'encargado' : 'empleado') as 'encargado' | 'empleado',
              posicion: a.posicion 
            });
          }
        });
      }
      console.log('AuthStore: Assigned restaurants fetched:', assigned);
      
      loadedRestaurants.sort((a, b) => a.nombre.localeCompare(b.nombre));
      userRestaurants.value = loadedRestaurants;
      console.log('AuthStore: All user restaurants loaded:', userRestaurants.value.map(r => ({id: r.id, name: r.nombre, role: r.role })));

      const savedRestaurantId = localStorage.getItem(storageKey + '_currentRestaurantId');
      if (savedRestaurantId && loadedRestaurants.some(r => r.id === savedRestaurantId)) {
        setCurrentRestaurant(savedRestaurantId);
      } else if (loadedRestaurants.length > 0 && loadedRestaurants[0].id) {
        setCurrentRestaurant(loadedRestaurants[0].id);
      } else {
        setCurrentRestaurant(null);
      }

    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message; 
      userRestaurants.value = []; 
      setCurrentRestaurant(null);
      console.error('AuthStore: Error in loadUserRestaurants:', errorInfo.message);
    } finally {
      loading.value = false;
    }
  }

  function setCurrentRestaurant(restaurantId: string | null) {
    if (restaurantId === null) {
      currentRestaurant.value = null;
      localStorage.removeItem(storageKey + '_currentRestaurantId');
      console.log('AuthStore: Current restaurant CLEARED');
      return;
    }
    const restaurant = userRestaurants.value.find(r => r.id === restaurantId);
    if (restaurant) {
      currentRestaurant.value = restaurant;
      localStorage.setItem(storageKey + '_currentRestaurantId', restaurantId);
      console.log('AuthStore: Current restaurant SET to:', restaurant.nombre, `(ID: ${restaurant.id})`);
    } else {
      console.warn(`AuthStore: setCurrentRestaurant - Restaurant with ID ${restaurantId} NOT FOUND in userRestaurants. Current restaurant not changed or cleared if previous was different.`);
      if (currentRestaurant.value?.id !== restaurantId) {
          currentRestaurant.value = null;
          localStorage.removeItem(storageKey + '_currentRestaurantId');
          console.log('AuthStore: Current restaurant cleared because new invalid ID was provided or old one is no longer valid.');
      }
    }
  }

  function loadCurrentRestaurantFromStorage() {
    const savedRestaurantId = localStorage.getItem(storageKey + '_currentRestaurantId');
    console.log('AuthStore: loadCurrentRestaurantFromStorage - Attempting with Saved ID:', savedRestaurantId);
    if (savedRestaurantId) {
        const foundInList = userRestaurants.value.find(r => r.id === savedRestaurantId);
        if (foundInList) {
            setCurrentRestaurant(savedRestaurantId);
        } else {
            console.warn('AuthStore: Saved restaurant ID from localStorage not found in current userRestaurants list.');
            if (userRestaurants.value.length > 0 && userRestaurants.value[0].id) {
                console.log('AuthStore: Setting to first available restaurant instead.');
                setCurrentRestaurant(userRestaurants.value[0].id);
            } else {
                console.log('AuthStore: No restaurants available to set.');
                setCurrentRestaurant(null);
            }
        }
    } else if (userRestaurants.value.length > 0 && userRestaurants.value[0].id) {
        console.log('AuthStore: No saved restaurant ID, setting to first available restaurant.');
        setCurrentRestaurant(userRestaurants.value[0].id);
    } else {
        console.log('AuthStore: No saved restaurant ID and no restaurants in list. Clearing current restaurant.');
        setCurrentRestaurant(null);
    }
  }
  
  async function createProfile(profileData: { nombre_completo: string; telefono?: string; rol?: UserProfile['rol']; }) {
    if (!user.value) throw new Error('No hay usuario autenticado');
    try {
      loading.value = true; 
      error.value = null;
      const newProfileData = {
        auth_user_id: user.value.id, 
        email: user.value.email!,
        nombre_completo: profileData.nombre_completo, 
        telefono: profileData.telefono || undefined,
        rol: profileData.rol || 'cliente', 
        esta_activo: true
      };
      const { data: newProfile, error: createError } = await supabase
        .from('perfiles').insert(newProfileData).select().single();
      if (createError) throw createError;
      profile.value = newProfile;
      if (newProfile) await loadUserRestaurants(newProfile.id);
      return newProfile;
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message; 
      throw err;
    } finally { 
      loading.value = false; 
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!profile.value) throw new Error('No hay perfil para actualizar');
    try {
      loading.value = true; 
      error.value = null;
      const { data: updatedProfile, error: updateError } = await supabase
        .from('perfiles').update(updates).eq('id', profile.value.id).select().single();
      if (updateError) throw updateError;
      profile.value = updatedProfile;
      return updatedProfile;
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message; 
      throw err;
    } finally { 
      loading.value = false; 
    }
  }

  async function signIn(email: string, password: string) {
    try {
      loading.value = true; 
      error.value = null;
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      return { user: data.user, session: data.session };
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message; 
      throw err;
    } finally { 
      loading.value = false; 
    }
  }

  async function signUp(email: string, password: string, additionalData?: { full_name?: string; phone?: string }) {
    try {
      loading.value = true; 
      error.value = null;
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: additionalData } 
      });
      if (signUpError) throw signUpError;
      return data;
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message; 
      throw err;
    } finally { 
      loading.value = false; 
    }
  }

  async function signOut() {
    try {
      loading.value = true; 
      error.value = null;
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err:any) {
      const errorInfo = handleSupabaseError(err); 
      error.value = errorInfo.message;
    } finally { 
      loading.value = false; 
    }
  }

  async function checkRestaurantAccess(restaurantId: string): Promise<boolean> {
    if (!profile.value || !profile.value.id) {
      console.warn('AuthStore: checkRestaurantAccess - No profile or profile.id.');
      return false;
    }
    console.log(`AuthStore: checkRestaurantAccess for profile.id ${profile.value.id} (auth_user_id: ${profile.value.auth_user_id}) to restaurant ${restaurantId}`);
    try {
      // CORREGIDO: Usar profile.value.id en lugar de profile.value.auth_user_id
      const { data: ownerRestaurant, error: ownerError } = await supabase
        .from('restaurantes').select('id', { count: 'exact' })
        .eq('id', restaurantId).eq('propietario_id', profile.value.id)
        .maybeSingle();
      if (ownerError) console.error('AuthStore: Error checking owner access:', ownerError.message);
      if (ownerRestaurant) { 
        console.log('AuthStore: Access GRANTED (owner) for restaurant', restaurantId); 
        return true; 
      }

      const { data: employee, error: employeeError } = await supabase
        .from('empleados').select('id', { count: 'exact' })
        .eq('restaurante_id', restaurantId).eq('perfil_id', profile.value.id)
        .eq('esta_activo', true).maybeSingle();
      if (employeeError) console.error('AuthStore: Error checking employee access:', employeeError.message);
      if (employee) { 
        console.log('AuthStore: Access GRANTED (employee) for restaurant', restaurantId); 
        return true; 
      }
      
      console.warn(`AuthStore: Access DENIED for restaurant ${restaurantId}`);
      return false;
    } catch (err) {
      console.error('AuthStore: Unexpected error in checkRestaurantAccess:', err);
      return false;
    }
  }

  function requireDashboardAccess() { 
    if (!canAccessDashboard.value) throw new Error('No tienes permisos para acceder al dashboard'); 
  }
  
  function requireRestaurantOwnership() { 
    if (!isCurrentRestaurantOwner.value) throw new Error('Solo el propietario puede realizar esta acción');
  }
  
  function clearError() { 
    error.value = null; 
  }

  // Inicializar automáticamente
  initialize();

  return {
    // Estados
    user: readonly(user), 
    profile: readonly(profile), 
    userRestaurants: readonly(userRestaurants),
    currentRestaurant: readonly(currentRestaurant),
    loadUserRestaurants,
    loading: readonly(loading), 
    error: readonly(error),
    isInitialized: readonly(isInitialized), 
    
    // Computed
    isAuthenticated, 
    userRole, 
    hasProfile, 
    isDueño,
    isEncargado, 
    isEmpleado, 
    isAdmin, 
    canAccessDashboard,
    isCurrentRestaurantOwner, 
    currentRestaurantRole, 
    currentRestaurantPermissions,
    
    // Métodos
    initialize, 
    loadUser, 
    setCurrentRestaurant, 
    createProfile, 
    updateProfile, 
    signIn,
    signUp, 
    signOut, 
    checkRestaurantAccess, 
    requireDashboardAccess, 
    requireRestaurantOwnership,
    clearError
  }
})