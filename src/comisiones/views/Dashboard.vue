<script setup lang="ts">
import { reglasStore } from '@/comisiones/stores/reglasStore.ts'
import { vendedoresStore } from '@/comisiones/stores/vendedoresStore.ts'
import { ventasStore } from '@/comisiones/stores/ventasStore.ts'
import { useComisiones } from '@/comisiones/composables/useComisiones.ts'
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/comisiones/components/utils/LoadingSpinner.vue'
import ErrorMessage from '@/comisiones/components/utils/ErrorMessage.vue'
import PokemonCard from '@/comisiones/components/utils/PokemonCard.vue'

//Stores
const storeReglas = reglasStore();
const storeVendedores = vendedoresStore();
const storeVentas = ventasStore();

// Composables
const {
  fechaInicio,
  fechaFin,
  validacionError,
  comisiones,
  loading,
  isFormularioValido,
  calcular,
  limpiar,
  configurarFechasPorDefecto
} = useComisiones();

const activeTab = ref('reglas');

const tabs = [
  { id: 'reglas', name: 'Reglas', icon: '📋' },
  { id: 'vendedores', name: 'Vendedores', icon: '👥' },
  { id: 'ventas', name: 'Ventas', icon: '💳' }
];

// Utility functions
function getCardType(index: number): 'blue' | 'mint' | 'yellow' | 'pink' | 'purple' | 'orange' {
  const types = ['blue', 'mint', 'yellow', 'pink', 'purple', 'orange'] as const;
  return types[index % types.length];
}

function getVendedorNombre(vendedorId: string): string {
  const vendedor = storeVendedores.getVendedorById(vendedorId);
  return vendedor ? vendedor.nombre : 'N/A';
}

onMounted(async () => {
  // Cargar datos iniciales
  await Promise.all([
    storeReglas.fetchReglas(),
    storeVendedores.fetchVendedores(),
    storeVentas.fetchVentas()
  ]);

  // Configurar fechas por defecto
  configurarFechasPorDefecto();
});

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-pokemon-blue to-pokemon-mint rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">⚡</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Mini Core Comisiones 2025</h1>
              <p class="text-sm text-gray-600">Sistema de Gestión de Comisiones</p>
            </div>
          </div>

          <!-- Stats rápidas -->
          <div class="hidden md:flex items-center space-x-6">
            <div class="text-center">
              <div class="text-lg font-bold text-pokemon-blue">{{ storeVendedores.totalVendedores }}</div>
              <div class="text-xs text-gray-600">Vendedores</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-pokemon-mint">{{ storeVentas.totalVentas }}</div>
              <div class="text-xs text-gray-600">Ventas</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-pokemon-purple">{{ storeReglas.totalReglas }}</div>
              <div class="text-xs text-gray-600">Reglas</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Sección de Cálculo de Comisiones -->
      <section class="mb-12">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-pokemon-yellow to-pokemon-orange rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-xl">💰</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Calcular Comisiones</h2>
              <p class="text-gray-600">Selecciona el rango de fechas para obtener las comisiones calculadas por el backend</p>
            </div>
          </div>

          <!-- Formulario de fechas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label for="fechaInicio" class="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                id="fechaInicio"
                v-model="fechaInicio"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label for="fechaFin" class="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                id="fechaFin"
                v-model="fechaFin"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pokemon-blue focus:border-transparent transition-all"
              />
            </div>

            <div class="flex items-end space-x-3">
              <button
                @click="calcular"
                :disabled="!isFormularioValido || loading"
                class="flex-1 bg-gradient-to-r from-blue-400 to-green-200 text-black px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                <span v-if="loading">Obteniendo...</span>
                <span v-else>💰 Obtener Comisiones</span>
              </button>

              <button
                @click="configurarFechasPorDefecto"
                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Configurar mes actual"
              >
                📅
              </button>

              <button
                @click="limpiar"
                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Limpiar"
              >
                🗑️
              </button>
            </div>
          </div>

          <!-- Error de validación -->
          <ErrorMessage
            v-if="validacionError"
            :message="validacionError"
            title="Error de Validación"
            :show-retry="false"
            class="mb-6"
          />

          <!-- Resultados de comisiones -->
          <div v-if="comisiones.length > 0" class="space-y-6">
            <!-- Resumen -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-br from-pokemon-purple to-purple-600 text-white p-4 rounded-xl">
                <div class="text-2xl font-bold">{{ comisiones.length }}</div>
                <div class="text-purple-100">Vendedores</div>
              </div>
            </div>

            <!-- Tarjetas de comisiones -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PokemonCard
                v-for="(comision, index) in comisiones"
                :key="comision.iD_Vendedor"
                :title="comision.nombre"
                :subtitle="`ID: ${comision.iD_Vendedor}`"
                :type="getCardType(index)"
                icon-text="👤"
                :badge="`${comision.porcentaje}%`"
                badge-type="success"
                :stats="[
                  { label: 'Total Ventas', value: `$${comision.totalVentas.toLocaleString()}` },
                  { label: 'Comisión', value: `$${comision.comision.toLocaleString()}` }
                ]"
              >
                <template #content>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600 group-hover:text-gray-200">Regla:</span>
                      <span class="font-semibold text-gray-800 group-hover:text-white">{{ comision.reglaAplicada }}</span>
                    </div>
                  </div>
                </template>
              </PokemonCard>
            </div>
          </div>

          <!-- Loading state -->
          <LoadingSpinner
            v-if="loading"
            text="Obteniendo comisiones del backend..."
            color="blue"
          />
        </div>
      </section>

      <!-- Tabs para las secciones -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100">
        <!-- Tab Headers -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-8 pt-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-pokemon-blue text-pokemon-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.icon }} {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-8">
          <!-- Reglas Tab -->
          <div v-if="activeTab === 'reglas'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">Reglas de Comisión</h3>
              <button
                @click="storeReglas.fetchReglas()"
                class="px-4 py-2 bg-pokemon-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>

            <LoadingSpinner v-if="storeReglas.loading" text="Cargando reglas..." />

            <ErrorMessage
              v-else-if="storeReglas.error"
              :message="storeReglas.error"
              @retry="storeReglas.fetchReglas()"
            />

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PokemonCard
                v-for="(regla, index) in storeReglas.reglas"
                :key="regla.iD_Regla"
                :title="`Regla ${regla.rule}`"
                :subtitle="`ID: ${regla.iD_Regla}`"
                :type="getCardType(index)"
                icon-text="📋"
                :stats="[
                  { label: 'Monto', value: `$${regla.amount.toLocaleString()}` },
                  { label: 'Nivel', value: regla.rule }
                ]"
              />
            </div>
          </div>

          <!-- Vendedores Tab -->
          <div v-if="activeTab === 'vendedores'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">Vendedores</h3>
              <button
                @click="storeVendedores.fetchVendedores()"
                class="px-4 py-2 bg-pokemon-mint text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>

            <LoadingSpinner v-if="storeVendedores.loading" text="Cargando vendedores..." />

            <ErrorMessage
              v-else-if="storeVendedores.error"
              :message="storeVendedores.error"
              @retry="storeVendedores.fetchVendedores()"
            />

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PokemonCard
                v-for="(vendedor, index) in storeVendedores.vendedores"
                :key="vendedor.iD_Vendedor"
                :title="vendedor.nombre"
                :subtitle="`ID: ${vendedor.iD_Vendedor}`"
                :type="getCardType(index)"
                icon-text="👤"
              />
            </div>
          </div>

          <!-- Ventas Tab -->
          <div v-if="activeTab === 'ventas'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">Ventas</h3>
              <div class="flex items-center space-x-3">
                <div class="text-sm text-gray-600">
                  Total: ${{ storeVentas.montoTotalVentas.toLocaleString() }}
                </div>
                <button
                  @click="storeVentas.fetchVentas()"
                  class="px-4 py-2 bg-pokemon-yellow text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>

            <LoadingSpinner v-if="storeVentas.loading" text="Cargando ventas..." />

            <ErrorMessage
              v-else-if="storeVentas.error"
              :message="storeVentas.error"
              @retry="storeVentas.fetchVentas()"
            />

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PokemonCard
                v-for="(venta, index) in storeVentas.ventas"
                :key="venta.iD_Venta"
                :title="`Venta ${venta.iD_Venta.slice(-3)}`"
                :subtitle="venta.fechaVenta"
                :type="getCardType(index)"
                icon-text="💳"
                :stats="[
                  { label: 'Monto', value: `$${venta.cuotaMonto.toLocaleString()}` },
                  { label: 'Vendedor', value: getVendedorNombre(venta.iD_Vendedor) }
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

</template>

<style scoped>
</style>
