<template>
  <span :class="getBadgeClasses()">
    <component :is="getIconComponent()" v-if="showIcon" class="w-3 h-3 mr-1" />
    {{ getEstadoTexto() }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  HandRaisedIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  estado: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'md'
})

const estadosConfig = {
  'pendiente': {
    text: 'Pendiente',
    classes: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  'confirmado': {
    text: 'Confirmado',
    classes: 'bg-orange-100 text-orange-800',
    icon: CheckCircleIcon
  },
  'en_preparacion': {
    text: 'En preparación',
    classes: 'bg-blue-100 text-blue-800',
    icon: PlayIcon
  },
  'listo': {
    text: 'Listo',
    classes: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  'entregado': {
    text: 'Entregado',
    classes: 'bg-gray-100 text-gray-800',
    icon: HandRaisedIcon
  },
  'pagado': {
    text: 'Pagado',
    classes: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircleIcon
  },
  'cancelado': {
    text: 'Cancelado',
    classes: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
}

const getSizeClasses = () => {
  const sizeClasses = {
    'sm': 'px-2 py-0.5 text-xs',
    'md': 'px-2.5 py-0.5 text-sm',
    'lg': 'px-3 py-1 text-base'
  }
  return sizeClasses[props.size]
}

const getBadgeClasses = () => {
  const config = estadosConfig[props.estado as keyof typeof estadosConfig]
  const baseClasses = 'inline-flex items-center rounded-full font-medium'
  const sizeClasses = getSizeClasses()
  const colorClasses = config?.classes || 'bg-gray-100 text-gray-800'
  
  return `${baseClasses} ${sizeClasses} ${colorClasses}`
}

const getEstadoTexto = () => {
  const config = estadosConfig[props.estado as keyof typeof estadosConfig]
  return config?.text || props.estado
}

const getIconComponent = () => {
  const config = estadosConfig[props.estado as keyof typeof estadosConfig]
  return config?.icon || ClockIcon
}
</script>