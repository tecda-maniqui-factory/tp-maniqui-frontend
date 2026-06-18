import { ENV } from '@/config/env.config';

/**
 * Estructura de un registro de stock crítico.
 */
export interface StockCriticoData {
  /** Nombre del modelo de maniquí. */
  modelo: string;
  /** Tipo de parte del cuerpo (ej. 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** Cantidad de unidades físicas disponibles en stock. */
  cantidad_disponible: number;
}

/**
 * Servicio encargado de gestionar las consultas y peticiones de stock crítico en el backend.
 * 
 * Se consume principalmente dentro de {@link useDashboardController}.
 * 
 * @example
 * ```ts
 * import { dashboardService } from './dashboardService';
 * 
 * const token = 'jwt-token-aqui';
 * const stockCritico = await dashboardService.getStockCritico(token);
 * ```
 */
export const dashboardService = {
  /**
   * Obtiene la lista de partes que tienen un nivel de stock por debajo del mínimo de seguridad.
   *
   * @param token - Token de autenticación del usuario.
   * @returns Promesa con el listado de registros de stock crítico {@link StockCriticoData}.
   * @throws {Error} Si la sesión expira (`auth.error.session_expired`) o si ocurre un fallo de red.
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
   * Genera y envía una nueva orden de compra/reposición para reabastecer el stock crítico de una parte.
   *
   * @param token - Token de autenticación del usuario.
   * @param modelo - Nombre del modelo de maniquí.
   * @param parte - Nombre del tipo de parte a reponer.
   * @returns Promesa que se resuelve al crear exitosamente la orden.
   * @throws {Error} Si la sesión expira o si falla la petición de creación.
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
