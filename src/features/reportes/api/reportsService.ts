import { ENV } from '../../../config/env.config';

/**
 * Representa un registro analítico de rentabilidad para un maniquí vendido.
 */
export interface RentabilidadItem {
  /** Número de serie único del maniquí. */
  maniqui_serie: string;
  /** Nombre del modelo de maniquí. */
  modelo: string;
  /** Precio de lista o precio final de venta. */
  precio_lista: number;
  /** Costo acumulado de las piezas consumidas para su ensamblaje. */
  costo_total_piezas: number;
  /** Margen bruto obtenido expresado en valor monetario (precio_lista - costo_total_piezas). */
  margen_bruto: number;
  /** Porcentaje de margen obtenido. */
  porcentaje_margen: number;
}

/**
 * Representa un registro del reporte de existencias críticas.
 */
export interface StockCriticoItem {
  /** Nombre del modelo de maniquí. */
  modelo: string;
  /** Tipo específico de pieza física (ej. 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** Cantidad de piezas disponibles en stock. */
  cantidad_disponible: number;
}

/**
 * Servicio técnico de API encargado de realizar las consultas relativas al Módulo de Reportes.
 * 
 * Se consume principalmente por la página {@link ReportsPage}.
 * 
 * @example
 * ```ts
 * import { reportsService } from './reportsService';
 * 
 * const token = 'jwt-token';
 * const rentData = await reportsService.getRentabilidad(token);
 * ```
 */
export const reportsService = {
  /**
   * Obtiene el reporte analítico de rentabilidad detallado por maniquí vendido.
   *
   * @param token - Token de autenticación del usuario.
   * @returns Promesa que resuelve a un listado de métricas de rentabilidad {@link RentabilidadItem}.
   * @throws {Error} Si la petición de red falla o la respuesta HTTP no es exitosa.
   */
  getRentabilidad: async (token: string): Promise<RentabilidadItem[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/rentabilidad`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener reporte de rentabilidad');
    return response.json();
  },

  /**
   * Obtiene el reporte de piezas con nivel de stock crítico (existencias por debajo del mínimo).
   *
   * @param token - Token de autenticación del usuario.
   * @returns Promesa que resuelve al listado de stock crítico {@link StockCriticoItem}.
   * @throws {Error} Si la petición de red falla o la respuesta HTTP no es exitosa.
   */
  getStockCritico: async (token: string): Promise<StockCriticoItem[]> => {
    const response = await fetch(`${ENV.API_URL}/reportes/stock-critico`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener reporte de stock crítico');
    return response.json();
  }
};
