import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
  categoria?: string
  personalizaciones?: {
    variante?: string
    modificaciones?: string[]
    notas?: string
  }
  subtotal: number
}

export interface CartState {
  restauranteId: string | null
  mesa: string | null
  items: CartItem[]
  descuentos: number
  propina: number
}

export const useCartStore = defineStore('cart', () => {
  // Estado
  const restauranteId = ref<string | null>(null)
  const mesa = ref<string | null>(null)
  const items = ref<CartItem[]>([])
  const descuentos = ref(0)
  const propina = ref(0)

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.cantidad, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + item.subtotal, 0)
  })

  const total = computed(() => {
    return subtotal.value - descuentos.value + propina.value
  })

  const isEmpty = computed(() => items.value.length === 0)

  const itemsByCategory = computed(() => {
    const grouped: Record<string, CartItem[]> = {}
    
    items.value.forEach(item => {
      const category = item.categoria || 'Sin categoría'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
    })
    
    return grouped
  })

  // Actions
  const initializeCart = (newRestauranteId: string, newMesa?: string) => {
    // Si es un restaurante diferente, limpiar carrito
    if (restauranteId.value && restauranteId.value !== newRestauranteId) {
      clearCart()
    }
    
    restauranteId.value = newRestauranteId
    mesa.value = newMesa || null
  }

  const addItem = (
    product: {
      id: string
      nombre: string
      precio: number
      imagen?: string
      categoria?: string
      personalizaciones?: any
    },
    cantidad: number = 1
  ) => {
    // Buscar si ya existe el mismo producto con las mismas personalizaciones
    const existingItemIndex = items.value.findIndex(item => 
      item.id === product.id && 
      JSON.stringify(item.personalizaciones) === JSON.stringify(product.personalizaciones)
    )

    if (existingItemIndex > -1) {
      // Si existe, aumentar cantidad
      const existingItem = items.value[existingItemIndex]
      existingItem.cantidad += cantidad
      existingItem.subtotal = existingItem.cantidad * existingItem.precio
    } else {
      // Si no existe, agregar nuevo item
      const newItem: CartItem = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad,
        imagen: product.imagen,
        categoria: product.categoria,
        personalizaciones: product.personalizaciones,
        subtotal: product.precio * cantidad
      }
      
      items.value.push(newItem)
    }
  }

  const updateItemQuantity = (itemIndex: number, newQuantity: number) => {
    if (itemIndex < 0 || itemIndex >= items.value.length) return
    
    if (newQuantity <= 0) {
      removeItem(itemIndex)
    } else {
      const item = items.value[itemIndex]
      item.cantidad = newQuantity
      item.subtotal = item.precio * newQuantity
    }
  }

  const removeItem = (itemIndex: number) => {
    if (itemIndex >= 0 && itemIndex < items.value.length) {
      items.value.splice(itemIndex, 1)
    }
  }

  const removeItemById = (itemId: string, personalizaciones?: any) => {
    const itemIndex = items.value.findIndex(item => 
      item.id === itemId && 
      JSON.stringify(item.personalizaciones) === JSON.stringify(personalizaciones)
    )
    
    if (itemIndex > -1) {
      removeItem(itemIndex)
    }
  }

  const clearCart = () => {
    items.value = []
    descuentos.value = 0
    propina.value = 0
  }

  const updateDescuentos = (newDescuentos: number) => {
    descuentos.value = Math.max(0, newDescuentos)
  }

  const updatePropina = (newPropina: number) => {
    propina.value = Math.max(0, newPropina)
  }

  const calculatePropinaByPercentage = (percentage: number) => {
    const calculatedPropina = (subtotal.value * percentage) / 100
    updatePropina(calculatedPropina)
    return calculatedPropina
  }

  // Preparar datos para enviar al pedido
  const getOrderData = () => {
    return {
      restaurante_id: restauranteId.value,
      numero_mesa: mesa.value,
      items: items.value.map(item => ({
        plato_id: item.id,
        nombre_plato: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        personalizaciones: item.personalizaciones,
        subtotal: item.subtotal
      })),
      subtotal: subtotal.value,
      descuentos: descuentos.value,
      propina: propina.value,
      total: total.value
    }
  }

  // Validar carrito antes de hacer pedido
  const validateCart = () => {
    const errors: string[] = []
    
    if (!restauranteId.value) {
      errors.push('Restaurante no seleccionado')
    }
    
    if (!mesa.value) {
      errors.push('Mesa no especificada')
    }
    
    if (items.value.length === 0) {
      errors.push('El carrito está vacío')
    }
    
    if (total.value <= 0) {
      errors.push('El total debe ser mayor a 0')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Obtener resumen del carrito
  const getCartSummary = () => {
    return {
      totalItems: totalItems.value,
      subtotal: subtotal.value,
      descuentos: descuentos.value,
      propina: propina.value,
      total: total.value,
      restauranteId: restauranteId.value,
      mesa: mesa.value,
      itemsCount: items.value.length
    }
  }

  // Duplicar item (útil para "pedir otra ronda")
  const duplicateItem = (itemIndex: number) => {
    if (itemIndex >= 0 && itemIndex < items.value.length) {
      const item = items.value[itemIndex]
      addItem({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        imagen: item.imagen,
        categoria: item.categoria,
        personalizaciones: item.personalizaciones
      }, item.cantidad)
    }
  }

  // Aplicar descuento por código promocional
  const applyPromoCode = (promoCode: string) => {
    // Aquí puedes implementar la lógica de códigos promocionales
    // Por ahora, algunos códigos de ejemplo
    const promoCodes: Record<string, { type: 'percentage' | 'fixed', value: number, description: string }> = {
      'BIENVENIDO10': { type: 'percentage', value: 10, description: '10% de descuento' },
      'PRIMERA5': { type: 'fixed', value: 5, description: '5€ de descuento' },
      'ESTUDIANTE': { type: 'percentage', value: 15, description: '15% descuento estudiantes' }
    }

    const promo = promoCodes[promoCode.toUpperCase()]
    if (promo) {
      if (promo.type === 'percentage') {
        const discount = (subtotal.value * promo.value) / 100
        updateDescuentos(discount)
      } else {
        updateDescuentos(promo.value)
      }
      return { success: true, description: promo.description }
    }
    
    return { success: false, description: 'Código promocional no válido' }
  }

  // Guardar carrito en localStorage (opcional)
  const saveToLocalStorage = () => {
    try {
      const cartData = {
        restauranteId: restauranteId.value,
        mesa: mesa.value,
        items: items.value,
        descuentos: descuentos.value,
        propina: propina.value,
        timestamp: Date.now()
      }
      localStorage.setItem('comandaplus_cart', JSON.stringify(cartData))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Cargar carrito desde localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('comandaplus_cart')
      if (savedCart) {
        const cartData = JSON.parse(savedCart)
        
        // Verificar si el carrito no es muy antiguo (ej: más de 24 horas)
        const maxAge = 24 * 60 * 60 * 1000 // 24 horas en ms
        if (Date.now() - cartData.timestamp < maxAge) {
          restauranteId.value = cartData.restauranteId
          mesa.value = cartData.mesa
          items.value = cartData.items || []
          descuentos.value = cartData.descuentos || 0
          propina.value = cartData.propina || 0
          return true
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
    return false
  }

  // Limpiar localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('comandaplus_cart')
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error)
    }
  }

  return {
    // State
    restauranteId,
    mesa,
    items,
    descuentos,
    propina,
    
    // Getters
    totalItems,
    subtotal,
    total,
    isEmpty,
    itemsByCategory,
    
    // Actions
    initializeCart,
    addItem,
    updateItemQuantity,
    removeItem,
    removeItemById,
    clearCart,
    updateDescuentos,
    updatePropina,
    calculatePropinaByPercentage,
    getOrderData,
    validateCart,
    getCartSummary,
    duplicateItem,
    applyPromoCode,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
  }
})