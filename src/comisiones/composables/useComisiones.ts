import { useComisionesStore } from '@/comisiones/stores/comisionesStore.ts'
import { computed, ref } from 'vue'
import type { ComisionRequest } from '@/comisiones/interfaces'


export function useComisiones() {
  const comisiones = useComisionesStore();

  const fechaInicio = ref('');
  const fechaFin = ref('');
  const validacionError = ref<string | null>(null);

  const isFormularioValido = computed(() => {
    return fechaInicio.value !== '' && fechaFin.value !== '' &&
      fechaInicio.value <= fechaFin.value;
  });

  const rangoFechas = computed(() => {
    if (!fechaInicio.value || !fechaFin.value) return '';
    return `${fechaInicio.value} - ${fechaFin.value}`;
  });

  function validarFechas(): boolean {
    validacionError.value = null;

    if (!fechaInicio.value || !fechaFin.value) {
      validacionError.value = 'Ambas fechas son requeridas';
      return false;
    }

    if (fechaInicio.value > fechaFin.value) {
      validacionError.value = 'La fecha de inicio debe ser anterior a la fecha fin';
      return false;
    }

    return true;
  }

  async function calcular() {
    if (!validarFechas()) {
      return false;
    }

    const request: ComisionRequest = {
      fechaInicio: fechaInicio.value,
      fechaFin: fechaFin.value
    };

    try {
      await comisiones.calcularComisiones(request);
      return true;
    } catch (error) {
      console.error('Error al obtener comisiones del backend:', error);
      return false;
    }
  }

  function limpiar() {
    fechaInicio.value = '';
    fechaFin.value = '';
    validacionError.value = null;
    comisiones.limpiarComisiones();
  }

  function configurarFechasPorDefecto() {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    fechaInicio.value = primerDiaMes.toISOString().split('T')[0];
    fechaFin.value = hoy.toISOString().split('T')[0];
  }

  return {
    fechaInicio,
    fechaFin,
    validacionError,

    comisiones: computed(() => comisiones.comisiones),
    loading: computed(() => comisiones.loading),
    error: computed(() => comisiones.error),
    ultimaConsulta: computed(() => comisiones.ultimaConsulta),

    isFormularioValido,
    rangoFechas,

    calcular,
    limpiar,
    configurarFechasPorDefecto
  };
}
