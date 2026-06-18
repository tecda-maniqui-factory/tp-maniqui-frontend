import { ENV } from '../../../config/env.config';

/**
 * Represents a profitability report item for a mannequin.
 */
export interface RentabilidadItem {
  /** The mannequin's unique serial number. */
  maniqui_serie: string;
  /** The name of the mannequin model. */
  modelo: string;
  /** The list price/sale price of the mannequin. */
  precio_lista: number;
  /** The total cost of the parts used to assemble it. */
  costo_total_piezas: number;
  /** The gross margin amount (price - cost). */
  margen_bruto: number;
  /** The percentage margin. */
  porcentaje_margen: number;
}

/**
 * Represents a critical stock report item.
 */
export interface StockCriticoItem {
  /** The mannequin model associated with the part. */
  modelo: string;
  /** The type of part (e.g. 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** The quantity of parts currently available. */
  cantidad_disponible: number;
}

/**
 * Service to handle reports-related API operations.
 */
export const reportsService = {
  /**
   * Fetches the profitability report details.
   *
   * @param token - Authentication bearer token.
   * @returns A promise resolving to an array of RentabilidadItem.
   * @throws An error if request fails.
   */
  getRentabilidad: async (token: string): Promise<RentabilidadItem[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/rentabilidad`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener reporte de rentabilidad');
    return response.json();
  },

  /**
   * Fetches the critical stock report details.
   *
   * @param token - Authentication bearer token.
   * @returns A promise resolving to an array of StockCriticoItem.
   * @throws An error if request fails.
   */
  getStockCritico: async (token: string): Promise<StockCriticoItem[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/stock-critico`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener reporte de stock crítico');
    return response.json();
  }
};
