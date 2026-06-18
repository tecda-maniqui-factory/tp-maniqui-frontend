import { FC, useMemo } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';
import { StockCriticoData } from '../api/dashboardService';

/**
 * Representa una orden de compra activa para reabastecimiento.
 */
export interface OrdenActiva {
  /** El nombre del modelo del maniquí. */
  modelo_nombre: string;
  /** El tipo específico de pieza solicitada. */
  tipo_parte: string;
}

/**
 * Configuración para una columna de la tabla.
 */
export interface Column {
  /** Clave que identifica la propiedad de los datos. */
  key: string;
  /** Etiqueta que se mostrará en la cabecera. */
  header: string;
  /** Alineación del contenido dentro de las celdas. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Propiedades del componente {@link StockCriticoWidget}.
 */
export interface StockCriticoWidgetProps {
  /** Lista de elementos en nivel de stock crítico. */
  data: StockCriticoData[];
  /** Indicador opcional de estado de carga. */
  isLoading?: boolean;
  /** Función callback ejecutada al solicitar piezas/órdenes para un elemento. */
  onPedir: (item: StockCriticoData) => void;
  /** Función de traducción. */
  t: (key: string) => string;
  /** Rol del usuario autenticado para restringir acciones. */
  userRole?: string;
  /** Lista de órdenes activas para prevenir pedidos duplicados. */
  ordenesActivas?: OrdenActiva[];
}

/**
 * Componente Widget: StockCriticoWidget
 * 
 * Muestra alertas de stock crítico en el dashboard con acciones interactivas para solicitar piezas.
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
