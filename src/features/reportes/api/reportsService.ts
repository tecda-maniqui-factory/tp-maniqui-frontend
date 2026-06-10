import { ENV } from '../../../config/env.config';

export interface RentabilidadItem {
  maniqui_serie: string;
  modelo: string;
  precio_lista: number;
  costo_total_piezas: number;
  margen_bruto: number;
  porcentaje_margen: number;
}

export interface StockCriticoItem {
  modelo: string;
  tipo_parte: string;
  cantidad_disponible: number;
}

export const reportsService = {
  getRentabilidad: async (token: string): Promise<RentabilidadItem[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/rentabilidad`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener reporte de rentabilidad');
    return response.json();
  },

  getStockCritico: async (token: string): Promise<StockCriticoItem[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/stock-critico`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener reporte de stock crítico');
    return response.json();
  }
};
