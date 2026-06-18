import { FC } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';

/**
 * Representa una fila de datos de stock crítico.
 */
export interface StockCriticoData {
  /** Nombre del modelo del maniquí. */
  modelo: string;
  /** Tipo de pieza (ej: 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** Número de unidades disponibles. */
  cantidad_disponible: number;
}

/**
 * Configuración para una columna de la tabla.
 */
export interface Column {
  /** Clave que identifica la propiedad del objeto de datos. */
  key: string;
  /** Texto que se mostrará en la cabecera. */
  header: string;
  /** Alineación del contenido dentro de la columna. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Propiedades del componente {@link StockCriticoTable}.
 */
export interface StockCriticoTableProps {
  /** Array de datos de elementos con stock crítico. */
  data: StockCriticoData[];
  /** Indicador opcional de estado de carga. */
  isLoading?: boolean;
}

/**
 * Componente de Negocio: StockCriticoTable
 * 
 * Muestra los niveles de inventario de piezas críticas (menos de 5 unidades) con opciones para iniciar órdenes de compra.
 */
export const StockCriticoTable: FC<StockCriticoTableProps> = ({ data, isLoading }) => {
  const columns = [
    { key: 'modelo', header: 'Modelo de Maniquí' },
    { key: 'tipo_parte', header: 'Pieza Requerida' },
    { key: 'cantidad_disponible', header: 'Stock Actual' },
    { key: 'actions', header: 'Acción', align: 'center' as const }
  ];

  const renderCell = (item: StockCriticoData, col: Column) => {
    if (col.key === 'cantidad_disponible') {
      return (
        <Badge variant={item.cantidad_disponible === 0 ? 'danger' : 'warning'}>
          {item.cantidad_disponible} unidades
        </Badge>
      );
    }
    if (col.key === 'actions') {
      return (
        <Button variant="info" size="compact" iconName="Plus">
          Pedir
        </Button>
      );
    }
    return item[col.key as keyof StockCriticoData] as string | number | undefined;
  };

  return (
    <Card title="⚠️ Alerta de Stock Crítico (Menos de 5 unidades)">
      <Table 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        renderCell={renderCell}
      />
    </Card>
  );
};
