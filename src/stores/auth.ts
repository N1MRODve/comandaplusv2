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
  role: 'propietario' | 'encargado' | 'empleado'
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

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => profile.value?.rol || 'cliente')
  const hasProfile = computed(() => !!profile.value)
  const isDueño = computed(() => profile.value?.rol === 'dueño')
  const isEncargado = computed(() => profile.value?.rol === 'encargado')
  const isEmpleado = computed(() => profile.value?.rol === 'empleado')
  const isAdmin = computed(() => profile.value?.rol === 'admin')
  const canManageRestaurant = computed(() => isDueño.value || isAdmin.value)
  const canAccessDashboard = computed(() => 
    isDueño.value || isEncargado.value || isAdmin.value
  )

  // Current restaurant computed properties
  const isCurrentRestaurantOwner = computed(() => 
    currentRestaurant.value?.role === 'propietario'
  )
  const currentRestaurantPermissions = computed(() => {
    if (!currentRestaurant.value) return {}
    
    const basePermissions = {
      viewDashboard: true,
      viewOrders: true,
      manageOrders: true,
      viewAnalytics: false,
      manageMenu: false,
      manageEmployees: false,
      manageSettings: false,
      viewFinances: false
    }

    if (currentRestaurant.value.role === 'propietario') {
      return {
        ...basePermissions,
        viewAnalytics: true,
        manageMenu: true,
        manageEmployees: true,
        manageSettings: true,
        viewFinances: true
      }
    }

    if (currentRestaurant.value.role === 'encargado') {
      return {
        ...basePermissions,
        viewAnalytics: true,
        manageMenu: true,
        manageEmployees: false,
        viewFinances: true
      }
    }

    return basePermissions
  })

  // Watcher para cambios en el usuario autenticado
  watch(user, async (newUser) => {
    if (newUser) {
      await loadUserProfile(newUser.id)
      await loadUserRestaurants()
    } else {
      profile.value = null
      userRestaurants.value = []
      currentRestaurant.value = null
    }
  })

  async function initialize() {
    if (isInitialized.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null

      if (user.value) {
        await loadUserProfile(user.value.id)
        await loadUserRestaurants()
      }

      // Configurar listener para cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          user.value = session.user
          await loadUserProfile(session.user.id)
          await loadUserRestaurants()
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          profile.value = null
          userRestaurants.value = []
          currentRestaurant.value = null
        }
      })

      isInitialized.value = true
    } catch (err) {
      console.error('Error initializing auth:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
    } finally {
      loading.value = false
    }
  }

  async function loadUser() {
    try {
      loading.value = true
      error.value = null
      
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser

      if (currentUser) {
        await loadUserProfile(currentUser.id)
        await loadUserRestaurants()
      } else {
        profile.value = null
        userRestaurants.value = []
        currentRestaurant.value = null
      }
    } catch (err) {
      console.error('Error loading user:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
    } finally {
      loading.value = false
    }
  }

  async function loadUserProfile(authUserId: string) {
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        throw profileError
      }

      profile.value = userProfile
      
      if (!userProfile) {
        console.log('No se encontró perfil para el usuario:', authUserId)
      }

    } catch (err) {
      console.error('Error loading user profile:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      profile.value = null
    }
  }

  async function loadUserRestaurants() {
    if (!profile.value) {
      userRestaurants.value = []
      return
    }

    try {
      const restaurants: RestauranteWithRole[] = []

      // Restaurantes como propietario
      const { data: ownedRestaurants, error: ownedError } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('propietario_id', profile.value.id)
        .eq('esta_activo', true)
        .order('nombre', { ascending: true })

      if (ownedError) throw ownedError

      if (ownedRestaurants) {
        restaurants.push(...ownedRestaurants.map(r => ({ 
          ...r, 
          role: 'propietario' as const 
        })))
      }

      // Restaurantes como empleado - SIN ORDER problemático
      const { data: employeeRestaurants, error: employeeError } = await supabase
        .from('empleados')
        .select(`
          posicion,
          restaurantes!inner (*)
        `)
        .eq('perfil_id', profile.value.id)
        .eq('esta_activo', true)
        .eq('restaurantes.esta_activo', true)

      if (employeeError) throw employeeError

      if (employeeRestaurants) {
        restaurants.push(...employeeRestaurants.map(e => ({ 
          ...e.restaurantes, 
          role: e.posicion === 'encargado' || e.posicion === 'encargada' ? 'encargado' as const : 'empleado' as const,
          posicion: e.posicion
        })))
      }

      // Ordenar en JavaScript en lugar de SQL para evitar problemas
      restaurants.sort((a, b) => a.nombre.localeCompare(b.nombre))

      userRestaurants.value = restaurants

      // Si no hay restaurante actual seleccionado, seleccionar el primero
      if (!currentRestaurant.value && restaurants.length > 0) {
        setCurrentRestaurant(restaurants[0].id)
      }

    } catch (err) {
      console.error('Error loading user restaurants:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      userRestaurants.value = []
    }
  }

  function setCurrentRestaurant(restaurantId: string) {
    const restaurant = userRestaurants.value.find(r => r.id === restaurantId)
    if (restaurant) {
      currentRestaurant.value = restaurant
      // Guardar en localStorage para persistencia
      localStorage.setItem('currentRestaurantId', restaurantId)
    }
  }

  function loadCurrentRestaurantFromStorage() {
    const savedRestaurantId = localStorage.getItem('currentRestaurantId')
    if (savedRestaurantId && userRestaurants.value.length > 0) {
      const restaurant = userRestaurants.value.find(r => r.id === savedRestaurantId)
      if (restaurant) {
        currentRestaurant.value = restaurant
      }
    }
  }

  async function createProfile(profileData: {
    nombre_completo: string
    telefono?: string
    rol?: 'cliente' | 'empleado' | 'dueño'
  }) {
    if (!user.value) {
      throw new Error('No hay usuario autenticado')
    }

    try {
      loading.value = true
      error.value = null

      const newProfileData = {
        auth_user_id: user.value.id,
        email: user.value.email!,
        nombre_completo: profileData.nombre_completo,
        telefono: profileData.telefono || null,
        rol: profileData.rol || 'cliente',
        esta_activo: true
      }

      const { data: newProfile, error: createError } = await supabase
        .from('perfiles')
        .insert(newProfileData)
        .select()
        .single()

      if (createError) {
        console.error('Error creating profile:', createError)
        throw createError
      }

      profile.value = newProfile
      console.log('Perfil creado exitosamente:', newProfile)
      
      // Cargar restaurantes después de crear el perfil
      await loadUserRestaurants()
      
      return newProfile
    } catch (err) {
      console.error('Error creating profile:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!profile.value) {
      throw new Error('No hay perfil para actualizar')
    }

    try {
      loading.value = true
      error.value = null

      const { data: updatedProfile, error: updateError } = await supabase
        .from('perfiles')
        .update(updates)
        .eq('id', profile.value.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      profile.value = updatedProfile
      return updatedProfile
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (signInError) {
        throw signInError
      }

      user.value = data.user
      
      if (data.user) {
        await loadUserProfile(data.user.id)
        await loadUserRestaurants()
      }

      return { user: data.user, profile: profile.value }
    } catch (err) {
      console.error('Error signing in:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, additionalData?: { 
    full_name?: string 
    phone?: string 
  }) {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: additionalData
        }
      })

      if (signUpError) {
        throw signUpError
      }

      user.value = data.user
      
      return data
    } catch (err) {
      console.error('Error signing up:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        throw signOutError
      }

      user.value = null
      profile.value = null
      userRestaurants.value = []
      currentRestaurant.value = null
      
      // Limpiar localStorage
      localStorage.removeItem('currentRestaurantId')
    } catch (err) {
      console.error('Error signing out:', err)
      const errorInfo = handleSupabaseError(err)
      error.value = errorInfo.message
    } finally {
      loading.value = false
    }
  }

  async function checkRestaurantAccess(restaurantId: string): Promise<boolean> {
    if (!profile.value) return false

    try {
      // Verificar si es propietario
      const { data: restaurant } = await supabase
        .from('restaurantes')
        .select('propietario_id')
        .eq('id', restaurantId)
        .eq('propietario_id', profile.value.id)
        .maybeSingle()

      if (restaurant) return true

      // Verificar si es empleado activo
      const { data: employee } = await supabase
        .from('empleados')
        .select('id, posicion')
        .eq('restaurante_id', restaurantId)
        .eq('perfil_id', profile.value.id)
        .eq('esta_activo', true)
        .maybeSingle()

      return !!employee
    } catch (err) {
      console.error('Error checking restaurant access:', err)
      return false
    }
  }

  function requireDashboardAccess() {
    if (!canAccessDashboard.value) {
      throw new Error('No tienes permisos para acceder al dashboard')
    }
  }

  function requireRestaurantOwnership() {
    if (!isCurrentRestaurantOwner.value) {
      throw new Error('Solo el propietario puede realizar esta acción')
    }
  }

  function clearError() {
    error.value = null
  }

  // Auto-inicializar cuando se crea el store
  initialize()

  return {
    // State
    user: readonly(user),
    profile: readonly(profile),
    userRestaurants: readonly(userRestaurants),
    currentRestaurant: readonly(currentRestaurant),
    loading: readonly(loading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    
    // Getters
    isAuthenticated,
    userRole,
    hasProfile,
    isDueño,
    isEncargado,
    isEmpleado,
    isAdmin,
    canManageRestaurant,
    canAccessDashboard,
    isCurrentRestaurantOwner,
    currentRestaurantPermissions,
    
    // Actions
    initialize,
    loadUser,
    loadUserProfile,
    loadUserRestaurants,
    setCurrentRestaurant,
    loadCurrentRestaurantFromStorage,
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
