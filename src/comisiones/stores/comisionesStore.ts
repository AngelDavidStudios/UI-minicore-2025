import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ComisionRequest, ComisionResponse } from '@/comisiones/interfaces'
import apiService from '@/comisiones/services/apiService.ts'


export const useComisionesStore = defineStore('comisiones', () => {
  const comisiones = ref<ComisionResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const ultimaConsulta = ref<ComisionRequest | null>(null);

  async function calcularComisiones(request: ComisionRequest) {
    loading.value = true;
    error.value = null;

    try {
      comisiones.value = await apiService.calcularComisiones(request);
      ultimaConsulta.value = { ...request };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      ultimaConsulta.value = { ...request };
    } finally {
      loading.value = false;
    }
  }

  function limpiarComisiones() {
    comisiones.value = [];
    ultimaConsulta.value = null;
    error.value = null;
  }

  return {
    comisiones,
    loading,
    error,
    ultimaConsulta,

    calcularComisiones,
    limpiarComisiones
  };
}
);
