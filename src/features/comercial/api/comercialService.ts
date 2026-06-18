import { ENV } from '@/config/env.config';

/**
 * Representa a un cliente dentro del módulo comercial.
 */
export interface Cliente {
  /** Identificador único del cliente. */
  id: number;
  /** Nombre o razón social del cliente. */
  nombre: string;
  /** Número de CUIT o CUIL del cliente. */
  cuit_cuil: string;
  /** Correo electrónico de contacto del cliente. */
  email: string;
}

/**
 * Representa una transacción de venta registrada con información básica.
 */
export interface Venta {
  /** Identificador único de la venta. */
  id: number;
  /** Identificador de referencia del cliente comprador. */
  cliente_id: number;
  /** Nombre del cliente (mapeado u obtenido desde la relación). */
  cliente?: string;
  /** Marca de tiempo ISO que indica el momento en que se registró la venta. */
  fecha_venta: string;
  /** Monto total facturado de la venta. */
  total: number;
  /** Método de pago seleccionado (ej. 'Efectivo', 'Tarjeta'). */
  metodo_pago: string;
  /** Número de factura oficial generado por el sistema de facturación. */
  nro_factura?: string;
  /** Código de Autorización Electrónico (CAE) emitido por AFIP. */
  cae?: string;
  /** Moneda en la que se efectuó la transacción. */
  moneda: 'ARS' | 'USD';
}

/**
 * Representación cruda de la venta tal como es devuelta por la API del backend antes de ser procesada.
 */
export interface VentaRaw {
  /** Identificador único del registro de venta en bruto. */
  id: number;
  /** Identificador de referencia del cliente. */
  cliente_id: number;
  /** Nombre del cliente. */
  cliente?: string;
  /** Fecha de venta. */
  fecha_venta?: string;
  /** Campo de fecha alternativo devuelto por el backend. */
  fecha?: string;
  /** Total bruto (puede ser devuelto como string o number por la base de datos). */
  total: number | string;
  /** Método de pago empleado. */
  metodo_pago: string;
  /** Número de factura oficial. */
  nro_factura?: string;
  /** Código de autorización AFIP CAE. */
  cae?: string;
  /** Moneda de la transacción. */
  moneda?: 'ARS' | 'USD';
}

/**
 * Representa el detalle individual de un maniquí vendido en una transacción.
 */
export interface DetalleVentaItem {
  /** ID único del maniquí vendido. */
  maniqui_id: number;
  /** Número de serie del maniquí. */
  numero_serie: string;
  /** Precio unitario final cobrado por el maniquí. */
  precio_final: number;
  /** Relación del modelo que contiene metadatos como el nombre. */
  Modelo?: { nombre: string };
  /** Relación anidada del maniquí físico vendido. */
  maniqui?: { numero_serie?: string; Modelo?: { nombre: string } };
}

/**
 * Detalle completo de una venta, incluyendo la lista desglosada de ítems o maniquíes vendidos.
 */
export interface VentaDetalle extends Venta {
  /** Colección de maniquíes individuales incluidos en esta venta. */
  Detalle_Ventas: DetalleVentaItem[];
}

/**
 * Representa un maniquí individual dentro del inventario físico.
 */
export interface Maniqui {
  /** Identificador único del maniquí en base de datos. */
  id: number;
  /** Número de serie único grabado en el maniquí. */
  numero_serie: string;
  /** ID del modelo de diseño al que pertenece. */
  modelo_id: number;
  /** Estado del ciclo de vida del maniquí (ej. 'Disponible', 'Vendido'). */
  status: string;
  /** Metadatos del modelo del maniquí. */
  Modelo?: {
    /** Nombre del modelo técnico. */
    nombre: string;
    /** Precio de venta sugerido. */
    precio_venta?: number | string;
  };
}

/**
 * Servicio encargado de realizar las consultas a la API comercial del backend.
 * 
 * Se consume principalmente dentro de {@link useSalesController}.
 * 
 * @example
 * ```ts
 * import { comercialService } from './comercialService';
 * 
 * const token = 'jwt-token-aqui';
 * const clientes = await comercialService.getClientes(token);
 * ```
 */
export const comercialService = {
  /**
   * Obtiene la lista completa de clientes registrados.
   *
   * @param token - Token de autenticación del usuario.
   * @returns Promesa que resuelve al listado de clientes {@link Cliente}.
   * @throws {Error} Si la sesión ha expirado (`auth.error.session_expired`) o si ocurre un fallo de red.
   */
  getClientes: async (token: string): Promise<Cliente[]> => {
    const response = await fetch(`${ENV.API_URL}/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar clientes');
    return response.json();
  },

  /**
   * Da de alta un nuevo cliente.
   *
   * @param token - Token de autenticación.
   * @param data - Datos de registro del nuevo cliente.
   * @returns Promesa con el cliente {@link Cliente} creado.
   * @throws {Error} Si la sesión expira o si los datos (como CUIT) no pasan las validaciones del backend.
   */
  createCliente: async (token: string, data: { nombre: string; cuit_cuil: string; email: string }): Promise<Cliente> => {
    const response = await fetch(`${ENV.API_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData.errores?.[0]?.msg || errData.error || 'Error al crear cliente';
      throw new Error(msg);
    }
    return response.json();
  },

  /**
   * Obtiene el listado histórico de todas las ventas del sistema.
   *
   * @param token - Token de autenticación.
   * @returns Promesa que resuelve a la lista de ventas en crudo {@link VentaRaw}.
   * @throws {Error} Si la sesión expira o si falla la petición de carga.
   */
  getVentas: async (token: string): Promise<VentaRaw[]> => {
    const response = await fetch(`${ENV.API_URL}/ventas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar ventas');
    return response.json();
  },

  /**
   * Recupera el detalle completo de una venta específica mediante su ID único.
   *
   * @param token - Token de autenticación.
   * @param id - Identificador único de la venta.
   * @returns Promesa con el detalle extendido de la venta {@link VentaDetalle}.
   * @throws {Error} Si la sesión expira o no se encuentra la venta solicitada.
   */
  getVentaById: async (token: string, id: number): Promise<VentaDetalle> => {
    const response = await fetch(`${ENV.API_URL}/ventas/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar detalle de venta');
    return response.json();
  },

  /**
   * Registra una nueva venta de maniquíes en el sistema.
   *
   * @param token - Token de autenticación.
   * @param data - Datos de la venta incluyendo el cliente, método de pago, moneda y los maniquíes asociados.
   * @returns Promesa con el resumen básico de la venta {@link Venta} registrada.
   * @throws {Error} Si la sesión expira, si el cliente no existe, o si algún maniquí seleccionado ya no está disponible.
   */
  createVenta: async (token: string, data: { cliente_id: number; metodo_pago: string; moneda: string; maniquies: { maniqui_id: number; precio_final: number }[] }): Promise<Venta> => {
    const response = await fetch(`${ENV.API_URL}/ventas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData.errores?.[0]?.msg || errData.error || 'Error al registrar venta';
      throw new Error(msg);
    }
    return response.json();
  },

  /**
   * Obtiene la lista de maniquíes que se encuentran listos para la venta.
   *
   * @param token - Token de autenticación.
   * @returns Promesa con la lista de maniquíes disponibles {@link Maniqui}.
   * @throws {Error} Si la sesión expira o falla el servicio de red.
   */
  getManiquiesDisponibles: async (token: string): Promise<Maniqui[]> => {
    const response = await fetch(`${ENV.API_URL}/maniquies?status=Disponible`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar maniquíes disponibles');
    return response.json();
  }
};
