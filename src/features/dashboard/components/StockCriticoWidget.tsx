import { FC, useMemo } from 'react';
import { Table, Card } from '@/components/molecules';
import { Button, Badge } from '@/components/atoms';
import { StockCriticoData } from '../api/dashboardService';

interface StockCriticoWidgetProps {
  data: StockCriticoData[];
  isLoading?: boolean;
  onPedir: (item: StockCriticoData) => void;
  t: (key: string) => string;
  userRole?: string;
  ordenesActivas?: any[];
}

/**
 * Widget: StockCriticoWidget
 * Muestra alertas de stock crítico directamente en el Dashboard con acciones funcionales.
 */
export const StockCriticoWidget: FC<StockCriticoWidgetProps> = ({ data, isLoading, onPedir, t, userRole, ordenesActivas = [] }) => {
  const columns = useMemo(() => [
    { key: 'modelo', header: t('dashboard.stock.model') || 'Modelo' },
    { key: 'tipo_parte', header: t('dashboard.stock.part') || 'Pieza' },
    { key: 'cantidad_disponible', header: t('dashboard.stock.available') || 'Stock', align: 'center' as const },
    ...(userRole === 'gerente_prod' || userRole === 'operario' ? [
      { key: 'actions', header: t('dashboard.stock.actions') || 'Acción', align: 'center' as const }
    ] : [])
  ], [t, userRole]);

  const renderCell = (item: StockCriticoData, col: any) => {
    if (col.key === 'cantidad_disponible') {
      return (
        <Badge variant={item.cantidad_disponible === 0 ? 'danger' : 'warning'}>
          {item.cantidad_disponible}
        </Badge>
      );
    }
    if (col.key === 'actions') {
      const isOrdered = ordenesActivas.some(
        o => o.modelo_nombre === item.modelo && o.tipo_parte === item.tipo_parte
      );

      return (
        <Button 
          variant={isOrdered ? "success" : "info"} 
          size="compact" 
          iconName={isOrdered ? "Check" : "Plus"} 
          onClick={() => onPedir(item)}
          isDisabled={isOrdered}
        >
          {isOrdered ? (t('dashboard.stock.ordered_btn') || 'Pedido') : (t('dashboard.stock.order_btn') || 'Pedir')}
        </Button>
      );
    }
    return item[col.key as keyof StockCriticoData] as any;
  };

  return (
    <Card 
      title={t('dashboard.stock.critical_alert') || '⚠️ Alerta de Stock Crítico'}
      description={t('dashboard.stock.critical_desc') || 'Piezas con menos de 5 unidades'}
    >
      <Table 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        renderCell={renderCell}
      />
    </Card>
  );
};
