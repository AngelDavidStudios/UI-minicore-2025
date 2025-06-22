import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Venta } from '@/comisiones/interfaces'
import { vendedoresStore } from '@/comisiones/stores/vendedoresStore.ts'
import apiService from '@/comisiones/services/apiService.ts'


export const ventasStore = defineStore('ventas', () => {
  const ventas = ref<Venta[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalVentas = computed(() => ventas.value.length);

  const montoTotalVentas = computed(() =>
    ventas.value.reduce((total, venta) => total + venta.cuotaMonto, 0)
  );

  const ventasConVendedor = computed(() => {
    const vendedores = vendedoresStore();
    return ventas.value.map(venta => ({
      ...venta,
      vendedor: vendedores.getVendedorById(venta.iD_Vendedor)
    }));
  });

  async function fetchVentas() {
    loading.value = true;
    error.value = null;

    try {
      ventas.value = await apiService.getVentas();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading.value = false;
    }
  }

  function getVentasPorVendedor(vendedorId: string): Venta[] {
    return ventas.value.filter(venta => venta.iD_Vendedor === vendedorId);
  }

  function getVentasPorFecha(fechaInicio: string, fechaFin: string): Venta[] {
    return ventas.value.filter(venta =>
      venta.fechaVenta >= fechaInicio && venta.fechaVenta <= fechaFin
    );
  }

  return {
    ventas,
    loading,
    error,

    totalVentas,
    montoTotalVentas,
    ventasConVendedor,

    fetchVentas,
    getVentasPorVendedor,
    getVentasPorFecha
  };
});
