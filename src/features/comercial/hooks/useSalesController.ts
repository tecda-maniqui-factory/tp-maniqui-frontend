import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { comercialService, Cliente, Venta, Maniqui } from '../api/comercialService';

/**
 * Hook Controlador para el Módulo Comercial - Ventas y Clientes.
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingCliente, setIsCreatingCliente] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // Estado del Formulario de Venta
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [selectedManiquiIds, setSelectedManiquiIds] = useState<number[]>([]);
  const [metodoPago, setMetodoPago] = useState<string>('Transferencia');
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');

  // Estado del Formulario de Nuevo Cliente
  const [newClienteNombre, setNewClienteNombre] = useState('');
  const [newClienteCuit, setNewClienteCuit] = useState('');
  const [newClienteEmail, setNewClienteEmail] = useState('');
  const [clienteError, setClienteError] = useState<string | null>(null);

  // Cargar todos los datos comerciales iniciales
  const loadCommercialData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [clientesData, maniquiesData, ventasData] = await Promise.all([
        comercialService.getClientes(token),
        comercialService.getManiquiesDisponibles(token),
        comercialService.getVentas(token)
      ]);

      setClientes(clientesData);
      setManiquiesDisponibles(maniquiesData);

      // Normalizar las ventas para mapear el nombre del cliente si no viene del backend
      const mappedVentas = (ventasData || []).map((v: any) => {
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
    } catch (err: any) {
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
    if (isMounted) {
      loadCommercialData();
    }
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
    } catch (err: any) {
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
      const price = Number(maniqui?.Modelo?.precio_venta || 0);
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
      setSelectedManiquiIds([]);
      setMetodoPago('Transferencia');
      setMoneda('ARS');

      // Recargar datos actualizados (ventas e inventario disponible)
      await loadCommercialData();
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        notify(t(msg), 'danger');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [token, selectedClienteId, selectedManiquiIds, maniquiesDisponibles, metodoPago, moneda, loadCommercialData, notify, t, logout]);

  // Alternar selección de maniquí
  const handleToggleManiqui = (maniquiId: number) => {
    setSelectedManiquiIds(prev => {
      if (prev.includes(maniquiId)) {
        return prev.filter(id => id !== maniquiId);
      } else {
        return [...prev, maniquiId];
      }
    });
  };

  // Calcular total
  const totalSale = selectedManiquiIds.reduce((sum, id) => {
    const maniqui = maniquiesDisponibles.find(m => m.id === id);
    const price = Number(maniqui?.Modelo?.precio_venta || 0);
    return sum + price;
  }, 0);

  return {
    clientes,
    maniquiesDisponibles,
    ventas,
    isLoading,
    isSubmitting,
    isCreatingCliente,
    selectedClienteId,
    selectedManiquiIds,
    metodoPago,
    moneda,
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
    setIsClienteModalOpen,
    handleToggleManiqui,
    handleCreateCliente,
    handleRegisterSale,
    handleRefresh: loadCommercialData,
    t
  };
};
