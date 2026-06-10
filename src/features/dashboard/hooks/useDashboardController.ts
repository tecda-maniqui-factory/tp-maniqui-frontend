import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { dashboardService, StockCriticoData } from '../api/dashboardService';

export const useDashboardController = () => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [stockCritico, setStockCritico] = useState<StockCriticoData[]>([]);
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStockCritico();
    }
    return () => { isMounted = false; };
  }, [fetchStockCritico]);

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
    isLoading,
    handlers: {
      handleRefresh: fetchStockCritico,
      handlePedirPieza
    },
    t
  };
};
