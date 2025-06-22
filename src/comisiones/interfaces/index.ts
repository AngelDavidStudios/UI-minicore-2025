export interface Regla {
  iD_Regla: string;
  rule: number;
  amount: number;
}

export interface Vendedor {
  iD_Vendedor: string;
  nombre: string;
}

export interface Venta {
  iD_Venta: string;
  fechaVenta: string;
  iD_Vendedor: string;
  cuotaMonto: number;
}

export interface ComisionRequest {
  fechaInicio: string;
  fechaFin: string;
}

export interface ComisionResultadoDto {
  iD_Vendedor: string;
  nombre: string;
  totalVentas: number;
  reglaAplicada: number | string;
  porcentaje: number;
  comision: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
