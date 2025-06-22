<script setup lang="ts">
import { computed, withDefaults } from 'vue';

interface Props {
  size?: number;
  color?: 'blue' | 'mint' | 'yellow' | 'pink' | 'purple' | 'orange';
  text?: string;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  color: 'blue',
  fullScreen: false
});

const containerClass = computed(() => {
  return props.fullScreen ? 'min-h-screen' : 'p-8';
});

const spinnerClass = computed(() => {
  const colors = {
    blue: 'border-pokemon-blue',
    mint: 'border-pokemon-mint',
    yellow: 'border-pokemon-yellow',
    pink: 'border-pokemon-pink',
    purple: 'border-pokemon-purple',
    orange: 'border-pokemon-orange'
  };
  return colors[props.color];
});
</script>

<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Spinner principal -->
      <div
        class="animate-spin rounded-full border-4 border-t-transparent"
        :class="spinnerClass"
        :style="{ width: size + 'px', height: size + 'px' }"
      ></div>

      <!-- Pokeball center dot -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        :style="{ width: size/4 + 'px', height: size/4 + 'px' }"
      ></div>
    </div>

    <!-- Texto opcional -->
    <p v-if="text" class="mt-4 text-sm text-gray-600 animate-pulse">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>

</style>
