import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { comercialService, Cliente, Venta, Maniqui, VentaRaw, VentaDetalle } from '../api/comercialService';

/**
 * Hook de control (Controller) para el módulo Comercial/Ventas.
 * 
 * Gestiona de forma unificada el estado de la UI y los flujos de negocio para:
 * - Listar y filtrar ventas existentes ({@link Venta}).
 * - Cargar maniquíes disponibles ({@link Maniqui}) e ingresar cantidades por modelo.
 * - Administrar la creación de nuevos clientes ({@link Cliente}) con validación de CUIT.
 * - Registrar transacciones de ventas con cotización dinámica en pesos o dólares.
 * - Mostrar el detalle de facturación con CAE y número de factura usando {@link VentaDetalle}.
 * 
 * Se conecta estrechamente con el servicio {@link comercialService} para operaciones API,
 * el hook {@link useAuth} para token de sesión, y {@link useNotify} para banners informativos.
 *
 * @example
 * ```tsx
 * import { useSalesController } from './hooks/useSalesController';
 * 
 * const VentasPanel = () => {
 *   const { ventas, totalSale, handleRegisterSale, isLoading } = useSalesController();
 *   
 *   if (isLoading) return <p>Cargando panel comercial...</p>;
 *   
 *   return (
 *     <form onSubmit={handleRegisterSale}>
 *       <span>Total a Facturar: ${totalSale}</span>
 *       <button type="submit">Confirmar Venta</button>
 *     </form>
 *   );
 * };
 * ```
 * 
 * @returns Un objeto estructurado con listados de datos, estado de formularios, cargando/procesando, handlers de acción y traductor.
 */
export const useSalesController = () => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  // Estados de datos
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [maniquiesDisponibles, setManiquiesDisponibles] = useState<Maniqui[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

  // Estados de UI/Carga
  const [isLoading, setIsLoading] = useState(!!token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingCliente, setIsCreatingCliente] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // Estados de Detalle de Venta
  const [selectedVentaDetalle, setSelectedVentaDetalle] = useState<VentaDetalle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Estado del Formulario de Venta
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [quantitiesByModel, setQuantitiesByModel] = useState<Record<number, number>>({});
  const [metodoPago, setMetodoPago] = useState<string>('Transferencia');
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');
  const [tipoCambio, setTipoCambio] = useState<number>(1000);

  // Estado del Formulario de Nuevo Cliente
  const [newClienteNombre, setNewClienteNombre] = useState('');
  const [newClienteCuit, setNewClienteCuit] = useState('');
  const [newClienteEmail, setNewClienteEmail] = useState('');
  const [clienteError, setClienteError] = useState<string | null>(null);

  // Cargar cantidades seleccionadas y caparlas al stock disponible en tiempo de renderizado
  const cappedQuantitiesByModel = useMemo(() => {
    const map: Record<number, number> = {};
    maniquiesDisponibles.forEach(m => {
      map[m.modelo_id] = (map[m.modelo_id] || 0) + 1;
    });

    const capped: Record<number, number> = {};
    Object.keys(quantitiesByModel).forEach(mIdStr => {
      const mId = Number(mIdStr);
      const val = quantitiesByModel[mId] || 0;
      const max = map[mId] || 0;
      capped[mId] = Math.min(val, max);
    });
    return capped;
  }, [quantitiesByModel, maniquiesDisponibles]);

  // Derivar selectedManiquiIds a partir de cappedQuantitiesByModel e inventario disponible
  const selectedManiquiIds = useMemo(() => {
    const ids: number[] = [];
    const groups: Record<number, Maniqui[]> = {};
    maniquiesDisponibles.forEach(m => {
      if (!groups[m.modelo_id]) groups[m.modelo_id] = [];
      groups[m.modelo_id].push(m);
    });

    Object.keys(cappedQuantitiesByModel).forEach(mIdStr => {
      const mId = Number(mIdStr);
      const q = cappedQuantitiesByModel[mId] || 0;
      const subList = groups[mId] || [];
      ids.push(...subList.slice(0, q).map(mq => mq.id));
    });
    return ids;
  }, [cappedQuantitiesByModel, maniquiesDisponibles]);

  // Cargar todos los datos comerciales iniciales
  const loadCommercialData = useCallback(async (showLoading = false) => {
    if (!token) return;
    if (showLoading) setIsLoading(true);
    try {
      const [clientesData, maniquiesData, ventasData] = await Promise.all([
        comercialService.getClientes(token),
        comercialService.getManiquiesDisponibles(token),
        comercialService.getVentas(token)
      ]);

      setClientes(clientesData);
      setManiquiesDisponibles(maniquiesData);

      // Normalizar las ventas para mapear el nombre del cliente si no viene del backend
      const mappedVentas = (ventasData || []).map((v: VentaRaw) => {
        const clienteObj = clientesData.find(c => c.id === v.cliente_id);
        return {
          id: v.id,
          cliente_id: v.cliente_id,
          cliente: v.cliente || clienteObj?.nombre || `Cliente #${v.cliente_id}`,
          fecha_venta: v.fecha_venta || v.fecha,
          total: Number(v.total),
          metodo_pago: v.metodo_pago,
          nro_factura: v.nro_factura || `FAC-${v.id}`,
          cae: v.cae,
          moneda: v.moneda || 'ARS'
        } as Venta;
      });

      setVentas(mappedVentas);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        notify(t('commercial.error.fetch_failed'), 'danger');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, notify, t]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await Promise.resolve();
      if (isMounted) {
        loadCommercialData(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [loadCommercialData]);

  // Manejar creación de cliente
  const handleCreateCliente = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setClienteError(null);

    // Validaciones del CUIT
    const cuitRegex = /^[0-9]{2}-[0-9]{8}-[0-9]{1}$/;
    if (!cuitRegex.test(newClienteCuit)) {
      setClienteError(t('commercial.error.cuit_invalid'));
      return;
    }

    if (newClienteNombre.trim().length < 3) {
      setClienteError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    setIsCreatingCliente(true);
    try {
      const nuevo = await comercialService.createCliente(token, {
        nombre: newClienteNombre,
        cuit_cuil: newClienteCuit,
        email: newClienteEmail
      });

      // Actualizar listado local y seleccionar el nuevo cliente
      setClientes(prev => [...prev, nuevo]);
      setSelectedClienteId(String(nuevo.id));

      // Limpiar campos y cerrar modal
      setNewClienteNombre('');
      setNewClienteCuit('');
      setNewClienteEmail('');
      setIsClienteModalOpen(false);

      notify(t('commercial.success.client_created'), 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        setClienteError(t(msg) || t('commercial.error.client_failed'));
      }
    } finally {
      setIsCreatingCliente(false);
    }
  }, [token, newClienteNombre, newClienteCuit, newClienteEmail, notify, t, logout]);

  // Manejar registro de venta
  const handleRegisterSale = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!selectedClienteId) {
      notify('Debe seleccionar un cliente.', 'warning');
      return;
    }

    if (selectedManiquiIds.length === 0) {
      notify(t('commercial.error.no_mannequins'), 'warning');
      return;
    }

    // Armar el payload de maniquíes
    const maniquiesPayload = selectedManiquiIds.map(id => {
      const maniqui = maniquiesDisponibles.find(m => m.id === id);
      const basePrice = Number(maniqui?.Modelo?.precio_venta || 0);
      const price = moneda === 'USD' ? Number((basePrice / tipoCambio).toFixed(2)) : basePrice;
      return {
        maniqui_id: id,
        precio_final: price
      };
    });

    // Validar precios
    const precioInvalido = maniquiesPayload.some(m => m.precio_final <= 0 || isNaN(m.precio_final));
    if (precioInvalido) {
      notify('El precio de venta del modelo debe ser mayor a cero.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await comercialService.createVenta(token, {
        cliente_id: Number(selectedClienteId),
        metodo_pago: metodoPago,
        moneda: moneda,
        maniquies: maniquiesPayload
      });

      notify(t('commercial.success.sale_registered'), 'success');

      // Limpiar formulario de ventas
      setSelectedClienteId('');
      setQuantitiesByModel({});
      setMetodoPago('Transferencia');
      setMoneda('ARS');
      setTipoCambio(1000);

      // Recargar datos actualizados (ventas e inventario disponible)
      await loadCommercialData(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        notify(t(msg), 'danger');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [token, selectedClienteId, selectedManiquiIds, maniquiesDisponibles, metodoPago, moneda, tipoCambio, loadCommercialData, notify, t, logout]);

  // Manejar el cambio de cantidad por modelo
  const handleModelQuantityChange = useCallback((modelId: number, qty: number) => {
    const map: Record<number, Maniqui[]> = {};
    maniquiesDisponibles.forEach(m => {
      if (!map[m.modelo_id]) map[m.modelo_id] = [];
      map[m.modelo_id].push(m);
    });

    const list = map[modelId] || [];
    const maxStock = list.length;
    const targetQty = Math.max(0, Math.min(maxStock, qty));

    setQuantitiesByModel(prev => ({ ...prev, [modelId]: targetQty }));
  }, [maniquiesDisponibles]);

  // Calcular total
  const totalSale = selectedManiquiIds.reduce((sum, id) => {
    const maniqui = maniquiesDisponibles.find(m => m.id === id);
    const basePrice = Number(maniqui?.Modelo?.precio_venta || 0);
    const price = moneda === 'USD' ? Number((basePrice / tipoCambio).toFixed(2)) : basePrice;
    return sum + price;
  }, 0);

  const handleViewDetail = useCallback(async (id: number) => {
    if (!token) return;
    setIsDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const detail = await comercialService.getVentaById(token, id);
      setSelectedVentaDetalle(detail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        notify('Error al cargar el detalle de la venta', 'danger');
      }
      setIsDetailModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  }, [token, logout, notify]);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedVentaDetalle(null);
  }, []);

  return {
    clientes,
    maniquiesDisponibles,
    ventas,
    isLoading,
    isSubmitting,
    isCreatingCliente,
    isClienteModalOpen,
    selectedClienteId,
    selectedManiquiIds,
    quantitiesByModel: cappedQuantitiesByModel,
    metodoPago,
    moneda,
    tipoCambio,
    totalSale,
    newClienteNombre,
    newClienteCuit,
    newClienteEmail,
    clienteError,
    setNewClienteNombre,
    setNewClienteCuit,
    setNewClienteEmail,
    setSelectedClienteId,
    setMetodoPago,
    setMoneda,
    setTipoCambio,
    setIsClienteModalOpen,
    handleModelQuantityChange,
    handleCreateCliente,
    handleRegisterSale,
    handleRefresh: () => loadCommercialData(true),
    t,
    // Detalle de Venta
    selectedVentaDetalle,
    isDetailModalOpen,
    isDetailLoading,
    handleViewDetail,
    handleCloseDetailModal
  };
};
