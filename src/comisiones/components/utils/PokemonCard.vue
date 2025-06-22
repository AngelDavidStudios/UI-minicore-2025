<script setup lang="ts">
import { computed, withDefaults } from 'vue';

interface Stat {
  label: string;
  value: string | number;
}

interface Props {
  title: string;
  subtitle?: string;
  type?: 'blue' | 'mint' | 'yellow' | 'pink' | 'purple' | 'orange';
  iconText?: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'error' | 'info';
  stats?: Stat[];
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'blue',
  iconText: '🎯',
  clickable: true
});

defineEmits<{
  click: [event: Event];
}>();

const cardClasses = computed(() => {
  const baseClasses = 'relative p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white border-opacity-30 overflow-hidden';

  const typeClasses = {
    blue: 'bg-gradient-to-br from-pokemon-blue to-blue-600 hover:from-blue-600 hover:to-pokemon-blue',
    mint: 'bg-gradient-to-br from-pokemon-mint to-emerald-600 hover:from-emerald-600 hover:to-pokemon-mint',
    yellow: 'bg-gradient-to-br from-pokemon-yellow to-amber-600 hover:from-amber-600 hover:to-pokemon-yellow',
    pink: 'bg-gradient-to-br from-pokemon-pink to-pink-600 hover:from-pink-600 hover:to-pokemon-pink',
    purple: 'bg-gradient-to-br from-pokemon-purple to-purple-600 hover:from-purple-600 hover:to-pokemon-purple',
    orange: 'bg-gradient-to-br from-pokemon-orange to-orange-600 hover:from-orange-600 hover:to-pokemon-orange'
  };

  return `${baseClasses} ${typeClasses[props.type]}`;
});

const iconBgClass = computed(() => {
  const classes = {
    blue: 'bg-blue-700',
    mint: 'bg-emerald-700',
    yellow: 'bg-amber-700',
    pink: 'bg-pink-700',
    purple: 'bg-purple-700',
    orange: 'bg-orange-700'
  };
  return classes[props.type];
});

const badgeClasses = computed(() => {
  const baseClasses = 'text-white';
  const typeClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  return `${baseClasses} ${typeClasses[props.badgeType || 'info']}`;
});
</script>

<template>
  <div
    class="pokemon-card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
    :class="cardClasses"
    @click="$emit('click', $event)"
  >
    <!-- Header con ícono -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
          :class="iconBgClass"
        >
          {{ iconText }}
        </div>
        <div class="flex flex-col">
          <h3 class="font-bold text-gray-800 group-hover:text-white transition-colors">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-600 group-hover:text-gray-200 transition-colors">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Badge opcional -->
      <div
        v-if="badge"
        class="px-3 py-1 rounded-full text-xs font-semibold"
        :class="badgeClasses"
      >
        {{ badge }}
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="space-y-3">
      <slot name="content"></slot>

      <!-- Stats opcionales -->
      <div v-if="stats && stats.length > 0" class="grid grid-cols-2 gap-2 mt-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center p-2 bg-white bg-opacity-20 rounded-lg"
        >
          <div class="font-bold text-lg text-gray-800 group-hover:text-white transition-colors">
            {{ stat.value }}
          </div>
          <div class="text-xs text-gray-600 group-hover:text-gray-200 transition-colors">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con acciones -->
    <div v-if="$slots.actions" class="mt-4 pt-4 border-t border-white border-opacity-20">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  pointer-events: none;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.pokemon-card:hover::before {
  opacity: 1;
}
</style>
