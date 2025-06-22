import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Regla } from '@/comisiones/interfaces'
import apiService from '@/comisiones/services/apiService.ts'


export const reglasStore = defineStore('reglas', () => {
  const reglas = ref<Regla[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalReglas = computed(() => reglas.value.length);

  const reglasPorRule = computed(() => {
    const grouped = new Map<number, Regla[]>();
    reglas.value.forEach(regla => {
      const rule = regla.rule;
      if (!grouped.has(rule)) {
        grouped.set(rule, []);
      }
      grouped.get(rule)!.push(regla);
    });
    return grouped;
  });

  async function fetchReglas() {
    loading.value = true;
    error.value = null;

    try {
      reglas.value = await apiService.getReglas();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';

    } finally {
      loading.value = false;
    }
  }

  function getReglaById(id: string): Regla | undefined {
    return reglas.value.find(regla => regla.iD_Regla === id);
  }

  function getReglasPorRule(rule: number): Regla[] {
    return reglas.value.filter(regla => regla.rule === rule);
  }

  return {
    reglas,
    loading,
    error,

    totalReglas,
    reglasPorRule,

    // Actions
    fetchReglas,
    getReglaById,
    getReglasPorRule
  };

});
