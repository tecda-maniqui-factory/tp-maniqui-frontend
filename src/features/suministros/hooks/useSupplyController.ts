import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Modelo } from '../../produccion/api/productionService';
import { supplyService } from '../api/supplyService';
import { ENV } from '@/config/env.config';

/**
 * Representa una orden de compra en el contexto de suministros.
 */
export interface OrdenCompra {
  /** Identificador único de la orden de compra. */
  id: string;
  /** Nombre del modelo de maniquí asociado. */
  modelo_nombre: string;
  /** Tipo específico de pieza ordenada (ej: 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** Marca de tiempo/fecha de creación de la orden. */
  fecha: string;
  /** Estado de procesamiento de la orden. */
  estado: 'pendiente' | 'completada';
}

/**
 * Hook de control (Controller) para la vista de Suministros/Recepción de Piezas.
 * 
 * Gestiona de forma unificada el estado y flujo para:
 * - Cargar modelos del catálogo mediante {@link productionService}.
 * - Recuperar dinámicamente los proveedores registrados en el backend.
 * - Suscribirse mediante Server-Sent Events (SSE) a los eventos en tiempo real de órdenes de compra pendientes.
 * - Registrar ingresos manuales de stock físico con el servicio {@link supplyService}.
 * - Rellenar automáticamente el formulario de ingreso al seleccionar una orden de compra pendiente de la lista.
 * 
 * Se conecta con los hooks globales {@link useAuth} y {@link useNotify}.
 * 
 * @example
 * ```tsx
 * import { useSupplyController } from './hooks/useSupplyController';
 * 
 * const IngresoPanel = () => {
 *   const { ordenesActivas, isSubmitting, handlers } = useSupplyController();
 *   return (
 *     <div>
 *       <span>Pedidos Pendientes: {ordenesActivas.length}</span>
 *       <form onSubmit={handlers.handleSubmit}>
 *         <button type="submit" disabled={isSubmitting}>Registrar</button>
 *       </form>
 *     </div>
 *   );
 * };
 * ```
 * 
 * @returns Estado local de modelos, opciones, listado de órdenes activas de compra y manejadores de acción.
 */
export const useSupplyController = () => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [proveedor, setProveedor] = useState('');
  const [tipoPieza, setTipoPieza] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [cantidad, setCantidad] = useState('10');
  const [costo, setCosto] = useState('50.00');
  
  const [ordenesActivas, setOrdenesActivas] = useState<OrdenCompra[]>([]);
  const [proveedorOptions, setProveedorOptions] = useState<{ value: string; label: string }[]>([
    { value: 'INT', label: 'Planta Principal (Interna)' },
    { value: 'EXT-A', label: 'Proveedor Externo A' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initModels = async () => {
      if (!token) return;
      setIsLoadingModels(true);
      try {
        const modelsData = await productionService.getModelos(token);
        if (isMounted) setModelos(modelsData.modelos || []);
      } catch (err: unknown) {
        if (String(err) === 'auth.error.session_expired') logout();
      } finally {
        if (isMounted) setIsLoadingModels(false);
      }
    };
    initModels();
    return () => { isMounted = false; };
  }, [token, logout]);

  // Fetch Providers
  useEffect(() => {
    let isMounted = true;
    const loadProveedores = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${ENV.API_URL}/sistema/proveedores`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data: Array<{ codigo: string; nombre: string }> = await response.json();
          const externalOptions = data.map(p => ({
            value: p.codigo,
            label: p.nombre
          }));
          if (isMounted) {
            setProveedorOptions([
              { value: 'INT', label: 'Planta Principal (Interna)' },
              ...externalOptions
            ]);
          }
        }
      } catch (err) {
        // Network error loading providers — silently keep defaults
        console.error('Error loading proveedores:', err);
      }
    };
    loadProveedores();
    return () => { isMounted = false; };
  }, [token]);

  // Stable ref for SSE callbacks — prevents stale closure re-subscription on every notify change
  const sseHandlerRef = useRef({ notify, setOrdenesActivas });
  useEffect(() => {
    sseHandlerRef.current = { notify, setOrdenesActivas };
  });

  // Setup SSE
  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`${ENV.API_URL}/notificaciones/stream?token=${token}`);

    const handleSyncOrdenes = (e: MessageEvent) => {
      const data: OrdenCompra[] = JSON.parse(e.data);
      sseHandlerRef.current.setOrdenesActivas(data);
    };
    const handleNuevaOrden = (e: MessageEvent) => {
      const data: OrdenCompra = JSON.parse(e.data);
      sseHandlerRef.current.setOrdenesActivas(prev => [...prev, data]);
      sseHandlerRef.current.notify(`Nueva orden recibida: ${data.tipo_parte} para ${data.modelo_nombre}`, 'info');
    };
    const handleOrdenCompletada = (e: MessageEvent) => {
      const data: { id: string } = JSON.parse(e.data);
      sseHandlerRef.current.setOrdenesActivas(prev => prev.filter(o => o.id !== data.id));
    };

    eventSource.addEventListener('sync_ordenes', handleSyncOrdenes);
    eventSource.addEventListener('nueva_orden', handleNuevaOrden);
    eventSource.addEventListener('orden_completada', handleOrdenCompletada);
    eventSource.onerror = (e) => { console.error('SSE Error (supply)', e); };

    return () => { eventSource.close(); };
  }, [token]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !proveedor || !tipoPieza || !modeloId || !cantidad || !costo) return;

    setIsSubmitting(true);
    try {
      await supplyService.ingresarPiezas(token, proveedor, tipoPieza, Number(modeloId), Number(cantidad), Number(costo));
      notify(`Ingreso de stock exitoso: ${cantidad} unidades recibidas.`, 'success');
      setProveedor('');
      setTipoPieza('');
      setModeloId('');
      setCantidad('10');
      setCosto('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage === 'auth.error.session_expired') {
        logout();
        return;
      }
      notify(errorMessage, 'danger', 'Error de Suministro');
    } finally {
      setIsSubmitting(false);
    }
  }, [token, proveedor, tipoPieza, modeloId, cantidad, costo, logout, notify]);

  const handlers = {
    handleProveedorChange: (e: React.ChangeEvent<HTMLSelectElement>) => setProveedor(e.target.value),
    handleTipoPiezaChange: (e: React.ChangeEvent<HTMLSelectElement>) => setTipoPieza(e.target.value),
    handleModeloChange: (e: React.ChangeEvent<HTMLSelectElement>) => setModeloId(e.target.value),
    handleCantidadChange: (e: React.ChangeEvent<HTMLInputElement>) => setCantidad(e.target.value),
    handleCostoChange: (e: React.ChangeEvent<HTMLInputElement>) => setCosto(e.target.value),
    handleSubmit,
    handleCompletarOrden: (orden: OrdenCompra) => {
      // Seleccionar dinámicamente el primer proveedor externo disponible, o por defecto 'EXT-A'
      const primerProveedorExterno = proveedorOptions.find(opt => opt.value !== 'INT');
      setProveedor(primerProveedorExterno ? primerProveedorExterno.value : 'EXT-A');
      
      const partMap: Record<string, string> = {
        'Cabeza': 'CAB',
        'Torso': 'TOR',
        'Brazo Izquierdo': 'BRA-I',
        'Brazo Derecho': 'BRA-D',
        'Pierna Izquierda': 'PIE-I',
        'Pierna Derecha': 'PIE-D',
        'Brazo I': 'BRA-I',
        'Brazo D': 'BRA-D',
        'Pierna I': 'PIE-I',
        'Pierna D': 'PIE-D'
      };
      
      setTipoPieza(partMap[orden.tipo_parte] || orden.tipo_parte);
      
      const mod = modelos.find(m => m.nombre === orden.modelo_nombre);
      if (mod) {
        setModeloId(String(mod.id));
      }
      setCantidad('10'); // Cantidad predeterminada
    }
  };

  return {
    modelos,
    proveedor,
    tipoPieza,
    modeloId,
    cantidad,
    costo,
    ordenesActivas,
    isSubmitting,
    isLoadingModels,
    handlers,
    t,
    proveedorOptions
  };
};
