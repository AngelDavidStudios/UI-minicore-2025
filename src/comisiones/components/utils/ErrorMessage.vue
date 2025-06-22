<script setup lang="ts">
import { withDefaults } from 'vue';

interface Props {
  message: string;
  title?: string;
  showRetry?: boolean;
}

withDefaults(defineProps<Props>(), {
  showRetry: true
});

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-red-600">⚠️</span>
        </div>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-red-800">
          {{ title || 'Error' }}
        </h3>
        <p class="mt-1 text-sm text-red-700">
          {{ message }}
        </p>
        <div v-if="showRetry" class="mt-3">
          <button
            @click="$emit('retry')"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            🔄 Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
