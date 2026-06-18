import { FC } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';;
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';;

/**
 * Represents a row of critical stock data.
 */
interface StockCriticoData {
  /** Name of the mannequin model. */
  modelo: string;
  /** Type of the part (e.g. 'Cabeza', 'Torso'). */
  tipo_parte: string;
  /** Number of units available. */
  cantidad_disponible: number;
}

/**
 * Configuration for a table column.
 */
interface Column {
  /** Unique key identifying the item property. */
  key: string;
  /** Label header text. */
  header: string;
  /** Alignment of content within the column. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Props for the StockCriticoTable component.
 */
interface StockCriticoTableProps {
  /** Array of critical stock item data. */
  data: StockCriticoData[];
  /** Optional loading indicator state. */
  isLoading?: boolean;
}

/**
 * Business Component: StockCriticoTable
 * Shows critical part inventory levels (under 5 units) with options to trigger purchase orders.
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
