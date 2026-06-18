import { ENV } from '@/config/env.config';

export const supplyService = {
  /**
   * Registra el ingreso de piezas desde un proveedor.
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
