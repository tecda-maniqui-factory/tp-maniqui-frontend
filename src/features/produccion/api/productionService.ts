import { ENV } from '@/config/env.config';

/**
 * Represents a mannequin item in production or inventory.
 */
export interface Maniqui {
  /** Unique identifier of the mannequin. */
  id: number;
  /** Serial number of the mannequin. */
  nro_serie: string;
  /** Reference identifier of the mannequin model. */
  id_modelo: number;
  /** Production or availability status. */
  status: 'En Producción' | 'Disponible' | 'Vendido' | 'Dañado';
  /** Date/time string when the mannequin was assembled. */
  fecha_ensamblaje: string;
  /** Optional name of the mannequin model. */
  modelo_nombre?: string; 
}

/**
 * Represents a mannequin model design.
 */
export interface Modelo {
  /** Unique identifier of the model. */
  id: number;
  /** Name of the model. */
  nombre: string;
  /** Optional detailed description of the model. */
  descripcion?: string;
}

/**
 * Service to handle production API operations.
 */
export const productionService = {
  /**
   * Fetches the list of all mannequin records.
   *
   * @param token - Authentication bearer token.
   * @returns An object containing the list of mannequins and count.
   * @throws Session expired or general fetching error.
   */
  getManiquies: async (token: string): Promise<{ maniquies: Maniqui[], totalCount: number }> => {
    const response = await fetch(`${ENV.API_URL}/maniquies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.status === 401) {
      throw new Error('auth.error.session_expired');
    }

    if (!response.ok) throw new Error('production.error.fetch_failed');
    return response.json();
  },

  /**
   * Fetches the list of all available mannequin models.
   * Normalizes the response to support direct arrays or nested responses.
   *
   * @param token - Authentication bearer token.
   * @returns An object containing the list of models.
   * @throws Session expired or model fetching error.
   */
  getModelos: async (token: string): Promise<{ modelos: Modelo[] }> => {
    const response = await fetch(`${ENV.API_URL}/sistema/modelos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      throw new Error('auth.error.session_expired');
    }

    if (!response.ok) throw new Error('production.error.models_failed');

    const data = await response.json();
    
    // El backend devuelve un array directo: [ {id, nombre, ...}, ... ]
    const modelosArray = Array.isArray(data) ? data : (data.modelos || []);

    return { modelos: modelosArray };
  },

  /**
   * Registers the assembly of a new mannequin.
   *
   * @param token - Authentication bearer token.
   * @param modelo_id - ID of the mannequin model to assemble.
   * @param numero_serie - Unique serial number for the new mannequin.
   * @returns A promise resolving to the API response.
   * @throws Session expired or validation error message.
   */
  ensamblarManiqui: async (token: string, modelo_id: number, numero_serie: string): Promise<unknown> => {
    const response = await fetch(`${ENV.API_URL}/maniquies/ensamblar`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ modelo_id, numero_serie })
    });

    if (response.status === 401) {
      throw new Error('auth.error.session_expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Si hay errores de validación de express-validator, están en errorData.errores
      const msg = errorData.errores?.[0]?.msg || errorData.error || 'production.error.assembly_failed';
      throw new Error(msg);
    }

    return response.json();
  },

  /**
   * Registers a new mannequin model with its parts recipe.
   *
   * @param token - Authentication bearer token.
   * @param data - The configuration of the new model.
   * @returns A promise resolving to the created model response.
   * @throws Session expired or saving error.
   */
  createModelo: async (token: string, data: { nombre: string; partes: string[]; sexo_id: number; costo_unitario: number; precio_venta: number }): Promise<any> => {
    const response = await fetch(`${ENV.API_URL}/sistema/modelos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      throw new Error('auth.error.session_expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error || 'Error al guardar el modelo';
      throw new Error(msg);
    }

    return response.json();
  }
};
