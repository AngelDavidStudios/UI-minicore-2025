import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { ApiResponse, ComisionRequest, ComisionResponse, Regla, Vendedor, Venta } from '@/comisiones/interfaces'


class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptors para manejo de errores y respuestas
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async getReglas(): Promise<Regla[]> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Regla[]>>('/api/Regla');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching reglas:', error);
      throw new Error('No se pudieron cargar las reglas');
    }
  }

  async getVendedores(): Promise<Vendedor[]> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Vendedor[]>>('/api/Vendedor');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching vendedores:', error);
      throw new Error('No se pudieron cargar los vendedores');
    }
  }

  async getVentas(): Promise<Venta[]> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Venta[]>>('/api/Venta');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching ventas:', error);
      throw new Error('No se pudieron cargar las ventas');
    }
  }

  async calcularComisiones(request: ComisionRequest): Promise<ComisionResponse[]> {
    try {
      const params = new URLSearchParams({
        fechaInicio: request.fechaInicio,
        fechaFin: request.fechaFin,
      });

      const response = await this.axiosInstance.get<ApiResponse<ComisionResponse[]>>(
        `/api/Comisiones?${params.toString()}`
      );

      return response.data.data || response.data;
    } catch (error) {
      console.error('Error calculating comisiones:', error);
      throw new Error('No se pudieron calcular las comisiones');
    }
  }
}

export const serviceAPI = new ApiService();
export default serviceAPI;
