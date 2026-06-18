import { ENV } from '@/config/env.config';

export interface StockCriticoData {
  modelo: string;
  tipo_parte: string;
  cantidad_disponible: number;
}

export const dashboardService = {
  /**
   * Obtiene las piezas con stock crítico.
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
   * Genera una nueva orden de compra para reponer stock.
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
