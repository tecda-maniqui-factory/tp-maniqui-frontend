import { ENV } from '@/config/env.config';

export interface Maniqui {
  id: number;
  nro_serie: string;
  id_modelo: number;
  status: 'En Producción' | 'Disponible' | 'Vendido' | 'Dañado';
  fecha_ensamblaje: string;
  modelo_nombre?: string; 
}

export interface Modelo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const productionService = {
  /**
   * Obtiene el listado de maniquíes.
   */
  getManiquies: async (token: string): Promise<{ maniquies: Maniqui[], totalCount: number }> => {
    const response = await fetch(`${ENV.API_URL}/maniquies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('production.error.fetch_failed');
    return response.json();
  },

  /**
   * Obtiene el listado de modelos disponibles.
   * Normaliza la respuesta para soportar arrays directos o respuestas anidadas.
   */
  getModelos: async (token: string): Promise<{ modelos: Modelo[] }> => {
    const response = await fetch(`${ENV.API_URL}/sistema/modelos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('production.error.models_failed');

    const data = await response.json();
    
    // El backend devuelve un array directo: [ {id, nombre, ...}, ... ]
    const modelosArray = Array.isArray(data) ? data : (data.modelos || []);

    return { modelos: modelosArray };
  },

  /**
   * Registra el ensamblaje de un nuevo maniquí.
   */
  ensamblarManiqui: async (token: string, modelo_id: number, numero_serie: string): Promise<any> => {
    const response = await fetch(`${ENV.API_URL}/maniquies/ensamblar`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ modelo_id, numero_serie })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Si hay errores de validación de express-validator, están en errorData.errores
      const msg = errorData.errores?.[0]?.msg || errorData.error || 'production.error.assembly_failed';
      throw new Error(msg);
    }

    return response.json();
  }
};
