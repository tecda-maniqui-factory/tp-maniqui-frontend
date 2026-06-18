import { ENV } from '@/config/env.config';

/**
 * Servicio técnico de API encargado de registrar la recepción e ingreso de suministros (piezas de maniquíes) al stock.
 * 
 * Se consume principalmente dentro de {@link useSupplyController}.
 * 
 * @example
 * ```ts
 * import { supplyService } from './supplyService';
 * 
 * const token = 'jwt-token';
 * await supplyService.ingresarPiezas(token, 'Nac', 'CAB', 5, 10, 15000);
 * ```
 */
export const supplyService = {
  /**
   * Registra el ingreso/arribo de un lote de piezas físicas al almacén de suministros.
   *
   * @param token - Token de autenticación del usuario.
   * @param origen_codigo - Código del proveedor de origen (ej. 'Nac', 'Imp').
   * @param tipo_parte_codigo - Código de la pieza recibida (ej. 'CAB', 'TOR').
   * @param modelo_id - ID del modelo técnico de maniquí destinatario.
   * @param cantidad - Cantidad de piezas del lote.
   * @param costo - Costo total del lote recibido.
   * @returns Promesa que se resuelve al guardar con éxito el ingreso.
   * @throws {Error} Si la sesión expira (`auth.error.session_expired`) o falla la validación en el backend.
   */
  ingresarPiezas: async (token: string, origen_codigo: string, tipo_parte_codigo: string, modelo_id: number, cantidad: number, costo: number): Promise<void> => {
    const response = await fetch(`${ENV.API_URL}/piezas/ingreso`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ origen_codigo, tipo_parte_codigo, modelo_id, cantidad, costo })
    });

    if (response.status === 401) {
      throw new Error('auth.error.session_expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Error al ingresar stock');
    }
  }
};
