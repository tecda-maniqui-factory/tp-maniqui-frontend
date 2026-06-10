import { FC } from 'react';
import { Table, Card } from '@/components/molecules';
import { Button, Badge } from '@/components/atoms';
import { StockCriticoData } from '../api/dashboardService';

interface StockCriticoWidgetProps {
  data: StockCriticoData[];
  isLoading?: boolean;
  onPedir: (item: StockCriticoData) => void;
  t: (key: string) => string;
}

/**
 * Widget: StockCriticoWidget
 * Muestra alertas de stock crítico directamente en el Dashboard con acciones funcionales.
 */
export const StockCriticoWidget: FC<StockCriticoWidgetProps> = ({ data, isLoading, onPedir, t }) => {
  const columns = [
    { key: 'modelo', header: t('dashboard.stock.model') || 'Modelo' },
    { key: 'tipo_parte', header: t('dashboard.stock.part') || 'Pieza' },
    { key: 'cantidad_disponible', header: t('dashboard.stock.available') || 'Stock', align: 'center' as const },
    { key: 'actions', header: t('dashboard.stock.actions') || 'Acción', align: 'center' as const }
  ];

  const renderCell = (item: StockCriticoData, col: any) => {
    if (col.key === 'cantidad_disponible') {
      return (
        <Badge variant={item.cantidad_disponible === 0 ? 'danger' : 'warning'}>
          {item.cantidad_disponible}
        </Badge>
      );
    }
    if (col.key === 'actions') {
      return (
        <Button 
          variant="info" 
          size="compact" 
          iconName="Plus" 
          onClick={() => onPedir(item)}
        >
          {t('dashboard.stock.order_btn') || 'Pedir'}
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
