import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { dashboardService, StockCriticoData } from '../api/dashboardService';
import { ENV } from '@/config/env.config';

export interface OrdenCompra {
  id: string;
  modelo_nombre: string;
  tipo_parte: string;
  fecha: string;
  estado: 'pendiente' | 'completada';
}

export const useDashboardController = () => {
  const { token, logout, user } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [stockCritico, setStockCritico] = useState<StockCriticoData[]>([]);
  const [ordenesActivas, setOrdenesActivas] = useState<OrdenCompra[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStockCritico = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await dashboardService.getStockCritico(token);
      setStockCritico(data);
    } catch (err: any) {
      if (err.message === 'auth.error.session_expired') {
        logout();
      } else {
        notify(t('dashboard.error.fetch_failed'), 'danger');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, notify, t]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchStockCritico();
    }
    return () => { isMounted = false; };
  }, [fetchStockCritico]);

  // Configurar SSE para actualizaciones en tiempo real
  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`${ENV.API_URL}/notificaciones/stream?token=${token}`);

    eventSource.addEventListener('sync_ordenes', (e) => {
      const data = JSON.parse(e.data);
      setOrdenesActivas(data);
    });

    eventSource.addEventListener('nueva_orden', (e) => {
      const data = JSON.parse(e.data);
      setOrdenesActivas(prev => {
        if (prev.some(o => o.id === data.id)) return prev;
        return [...prev, data];
      });
      // Refrescar stock crítico para ver si cambió algo
      fetchStockCritico();
    });

    eventSource.addEventListener('orden_completada', (e) => {
      const data = JSON.parse(e.data);
      setOrdenesActivas(prev => prev.filter(o => o.id !== data.id));
      // Refrescar al completarse una orden de compra (ingreso de stock)
      fetchStockCritico();
    });

    eventSource.addEventListener('stock_actualizado', () => {
      // Refrescar al consumirse stock (ensamblajes)
      fetchStockCritico();
    });

    eventSource.onerror = (e) => {
      console.error('SSE Error en Dashboard', e);
    };

    return () => {
      eventSource.close();
    };
  }, [token, fetchStockCritico]);

  const handlePedirPieza = async (item: StockCriticoData) => {
    if (!token) return;
    try {
      await dashboardService.postOrdenCompra(token, item.modelo, item.tipo_parte);
      notify(`Orden de compra generada para: ${item.tipo_parte} (${item.modelo}). Diríjase a 'Suministros' para registrar el ingreso físico cuando llegue el pedido.`, 'info');
    } catch (err: any) {
      if (err.message === 'auth.error.session_expired') {
        logout();
      } else {
        notify('Error al generar la orden', 'danger');
      }
    }
  };

  return {
    stockCritico,
    ordenesActivas,
    isLoading,
    handlers: {
      handleRefresh: fetchStockCritico,
      handlePedirPieza
    },
    t,
    user
  };
};
