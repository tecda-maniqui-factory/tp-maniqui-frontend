import { ENV } from '@/config/env.config';

export interface Cliente {
  id: number;
  nombre: string;
  cuit_cuil: string;
  email: string;
}

export interface Venta {
  id: number;
  cliente_id: number;
  cliente?: string;
  fecha_venta: string;
  total: number;
  metodo_pago: string;
  nro_factura?: string;
  cae?: string;
  moneda: 'ARS' | 'USD';
}

export interface Maniqui {
  id: number;
  numero_serie: string;
  modelo_id: number;
  status: string;
  Modelo?: {
    nombre: string;
    precio_venta?: number | string;
  };
}

export const comercialService = {
  getClientes: async (token: string): Promise<Cliente[]> => {
    const response = await fetch(`${ENV.API_URL}/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar clientes');
    return response.json();
  },

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

  getVentas: async (token: string): Promise<any[]> => {
    const response = await fetch(`${ENV.API_URL}/ventas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar ventas');
    return response.json();
  },

  getVentaById: async (token: string, id: number): Promise<any> => {
    const response = await fetch(`${ENV.API_URL}/ventas/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar detalle de venta');
    return response.json();
  },

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

  getManiquiesDisponibles: async (token: string): Promise<Maniqui[]> => {
    const response = await fetch(`${ENV.API_URL}/maniquies?status=Disponible`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) throw new Error('auth.error.session_expired');
    if (!response.ok) throw new Error('Error al cargar maniquíes disponibles');
    return response.json();
  }
};
