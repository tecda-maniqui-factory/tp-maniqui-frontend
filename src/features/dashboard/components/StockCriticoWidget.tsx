import { FC, useMemo } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';;
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';;
import { StockCriticoData } from '../api/dashboardService';

/**
 * Represents an active purchase order for replenishment.
 */
interface OrdenActiva {
  /** The name of the model of the mannequin. */
  modelo_nombre: string;
  /** The specific type of part ordered. */
  tipo_parte: string;
}

/**
 * Configuration for a table column.
 */
interface Column {
  /** Key identifying the data property. */
  key: string;
  /** Display label for the column header. */
  header: string;
  /** Alignment of content within cells. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Props for the StockCriticoWidget component.
 */
interface StockCriticoWidgetProps {
  /** List of items in critical stock level. */
  data: StockCriticoData[];
  /** Optional loading state indicator. */
  isLoading?: boolean;
  /** Callback triggered to request parts/orders for an item. */
  onPedir: (item: StockCriticoData) => void;
  /** Translator function. */
  t: (key: string) => string;
  /** Role of the authenticated user to restrict actions. */
  userRole?: string;
  /** List of active orders to prevent double ordering. */
  ordenesActivas?: OrdenActiva[];
}

/**
 * Widget Component: StockCriticoWidget
 * Displays critical stock alert tables on the dashboard with interactive order request actions.
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

  const renderCell = (item: StockCriticoData, col: Column) => {
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
    return item[col.key as keyof StockCriticoData] as string | number | undefined;
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
