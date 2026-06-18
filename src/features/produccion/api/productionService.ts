import { ENV } from '@/config/env.config';

/**
 * Representa un maniquí individual dentro de la línea de producción o inventario.
 */
export interface Maniqui {
  /** Identificador único del maniquí. */
  id: number;
  /** Número de serie único del maniquí. */
  nro_serie: string;
  /** ID de referencia del modelo de diseño al que pertenece. */
  id_modelo: number;
  /** Estado del ciclo de vida del maniquí. */
  status: 'En Producción' | 'Disponible' | 'Vendido' | 'Dañado';
  /** Marca de tiempo de la fecha en que se finalizó el ensamblaje. */
  fecha_ensamblaje: string;
  /** Nombre opcional del modelo de maniquí. */
  modelo_nombre?: string; 
}

/**
 * Representa el diseño técnico de un modelo del catálogo.
 */
export interface Modelo {
  /** Identificador único del modelo en base de datos. */
  id: number;
  /** Nombre representativo del modelo. */
  nombre: string;
  /** Descripción detallada del modelo. */
  descripcion?: string;
}

/**
 * Servicio técnico de API encargado de realizar las consultas relativas a Producción y Catálogo.
 * 
 * Se consume principalmente por hooks de control como {@link useProductionController} y {@link useAssemblyController}.
 * 
 * @example
 * ```ts
 * import { productionService } from './productionService';
 * 
 * const token = 'jwt-token';
 * const result = await productionService.getManiquies(token);
 * console.log('Total maniquíes:', result.totalCount);
 * ```
 */
export const productionService = {
  /**
   * Obtiene el listado completo de maniquíes registrados (historial e inventario).
   *
   * @param token - Token de autenticación del usuario.
   * @returns Promesa que resuelve a un objeto con la lista de maniquíes {@link Maniqui} y la cantidad total.
   * @throws {Error} Si la sesión expira (`auth.error.session_expired`) o si ocurre un fallo en la llamada.
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
   * Obtiene la lista completa de todos los modelos técnicos registrados en el catálogo.
   *
   * @param token - Token de autenticación del usuario.
   * @returns Promesa que resuelve al listado de modelos {@link Modelo}.
   * @throws {Error} Si la sesión expira o falla la petición al servidor.
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
   * Registra el ensamblaje técnico de un nuevo maniquí.
   * 
   * Consume las piezas necesarias del inventario físico y crea la entidad con estado 'Disponible'.
   *
   * @param token - Token de autenticación.
   * @param modelo_id - ID del modelo técnico de maniquí a ensamblar.
   * @param numero_serie - Número de serie único asignado al maniquí.
   * @returns Promesa con el resultado provisto por la API del backend.
   * @throws {Error} Si la sesión expira o si no hay suficiente stock de piezas para concretar el armado.
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
   * Registra un nuevo modelo técnico junto con la receta de sus piezas requeridas.
   *
   * @param token - Token de autenticación del usuario.
   * @param data - Configuración técnica del nuevo modelo (nombre, piezas, costo, precio venta).
   * @returns Promesa que resuelve al objeto de modelo creado.
   * @throws {Error} Si la sesión expira o falla el almacenamiento.
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
