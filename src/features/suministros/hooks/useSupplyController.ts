import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Modelo } from '../../produccion/api/productionService';
import { supplyService } from '../api/supplyService';
import { ENV } from '@/config/env.config';

export interface OrdenCompra {
  id: string;
  modelo_nombre: string;
  tipo_parte: string;
  fecha: string;
  estado: 'pendiente' | 'completada';
}

export const useSupplyController = () => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [proveedor, setProveedor] = useState('');
  const [tipoPieza, setTipoPieza] = useState('');
  const [modeloId, setModeloId] = useState('');
  const [cantidad, setCantidad] = useState('10');
  
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
          const data = await response.json();
          const externalOptions = data.map((p: any) => ({
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
        console.error('Error loading proveedores:', err);
      }
    };
    loadProveedores();
    return () => { isMounted = false; };
  }, [token]);

  // Setup SSE
  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`${ENV.API_URL}/notificaciones/stream?token=${token}`);

    eventSource.addEventListener('sync_ordenes', (e) => {
      const data = JSON.parse(e.data);
      setOrdenesActivas(data);
    });

    eventSource.addEventListener('nueva_orden', (e) => {
      const data = JSON.parse(e.data);
      setOrdenesActivas(prev => [...prev, data]);
      notify(`Nueva orden recibida: ${data.tipo_parte} para ${data.modelo_nombre}`, 'info');
    });

    eventSource.addEventListener('orden_completada', (e) => {
      const data = JSON.parse(e.data);
      setOrdenesActivas(prev => prev.filter(o => o.id !== data.id));
    });

    eventSource.onerror = (e) => {
      console.error('SSE Error', e);
    };

    return () => {
      eventSource.close();
    };
  }, [token, notify]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !proveedor || !tipoPieza || !modeloId || !cantidad) return;

    setIsSubmitting(true);
    try {
      await supplyService.ingresarPiezas(token, proveedor, tipoPieza, Number(modeloId), Number(cantidad));
      notify(`Ingreso de stock exitoso: ${cantidad} unidades recibidas.`, 'success');
      setProveedor('');
      setTipoPieza('');
      setModeloId('');
      setCantidad('10');
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
  }, [token, proveedor, tipoPieza, modeloId, cantidad, logout, notify]);

  const handlers = {
    handleProveedorChange: (e: React.ChangeEvent<HTMLSelectElement>) => setProveedor(e.target.value),
    handleTipoPiezaChange: (e: React.ChangeEvent<HTMLSelectElement>) => setTipoPieza(e.target.value),
    handleModeloChange: (e: React.ChangeEvent<HTMLSelectElement>) => setModeloId(e.target.value),
    handleCantidadChange: (e: React.ChangeEvent<HTMLInputElement>) => setCantidad(e.target.value),
    handleSubmit,
    handleCompletarOrden: (orden: OrdenCompra) => {
      // Seleccionar dinámicamente el primer proveedor externo disponible, o por defecto 'EXT-A'
      const primerProveedorExterno = proveedorOptions.find(opt => opt.value !== 'INT');
      setProveedor(primerProveedorExterno ? primerProveedorExterno.value : 'EXT-A');
      
      const partMap: Record<string, string> = {
        'Cabeza': 'CAB',
        'Torso': 'TOR',
        'Brazo Izquierdo': 'BRI',
        'Brazo Derecho': 'BRD',
        'Pierna Izquierda': 'PII',
        'Pierna Derecha': 'PID',
        'Brazo I': 'BRI',
        'Brazo D': 'BRD',
        'Pierna I': 'PII',
        'Pierna D': 'PID'
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
    ordenesActivas,
    isSubmitting,
    isLoadingModels,
    handlers,
    t,
    proveedorOptions
  };
};
