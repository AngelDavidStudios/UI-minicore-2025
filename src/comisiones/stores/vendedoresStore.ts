import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Vendedor } from '@/comisiones/interfaces'
import apiService from '@/comisiones/services/apiService.ts'


export const vendedoresStore = defineStore('vendedores', () => {
  const vendedores = ref<Vendedor[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalVendedores = computed(() => vendedores.value.length);

  async function fetchVendedores() {
    loading.value = true;
    error.value = null;

    try {
      vendedores.value = await apiService.getVendedores();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';

    } finally {
      loading.value = false;
    }
  }

  function getVendedorById(id: string): Vendedor | undefined {
    return vendedores.value.find(vendedor => vendedor.iD_Vendedor === id);
  }

  return {
    vendedores,
    loading,
    error,

    totalVendedores,

    fetchVendedores,
    getVendedorById
  };
});
