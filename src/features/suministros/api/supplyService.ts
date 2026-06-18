import { ENV } from '@/config/env.config';

export const supplyService = {
  /**
   * Registers the arrival of mannequin parts from a supplier.
   *
   * @param token - Authentication bearer token.
   * @param origen_codigo - Code representing the origin supplier (e.g. 'Nacional', 'Importado').
   * @param tipo_parte_codigo - Code of the part type (e.g. 'C', 'T').
   * @param modelo_id - ID of the mannequin model.
   * @param cantidad - Quantity of parts arriving.
   * @param costo - Unit cost of the parts.
   * @returns A promise resolving when the transaction is saved.
   * @throws Session expired error or API response error.
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
