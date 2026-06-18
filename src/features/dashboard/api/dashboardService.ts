import { ENV } from '@/config/env.config';

/**
 * Structure of critical stock data item.
 */
export interface StockCriticoData {
  /** Name of the mannequin model. */
  modelo: string;
  /** Type of part (e.g. 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** Number of units available in stock. */
  cantidad_disponible: number;
}

/**
 * Service to handle dashboard-related API operations.
 */
export const dashboardService = {
  /**
   * Fetches parts that are in critical stock level.
   *
   * @param token - Authentication bearer token.
   * @returns A promise resolving to a list of StockCriticoData objects.
   * @throws Session expired or general fetching error.
   */
  getStockCritico: async (token: string): Promise<StockCriticoData[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/stock-critico`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('dashboard.error.fetch_failed');

    const data = await response.json();
    return Array.isArray(data) ? data : (data.stockCritico || []);
  },

  /**
   * Generates a new purchase order to replenish stock.
   *
   * @param token - Authentication bearer token.
   * @param modelo - The name of the mannequin model.
   * @param parte - The name of the part to order.
   * @returns A promise resolving when the order is successfully created.
   * @throws Session expired or creation error.
   */
  postOrdenCompra: async (token: string, modelo: string, parte: string): Promise<void> => {
    const response = await fetch(`${ENV.API_URL}/notificaciones/ordenes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ modelo, parte })
    });

    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al crear la orden');
    await response.json();
  }
};
