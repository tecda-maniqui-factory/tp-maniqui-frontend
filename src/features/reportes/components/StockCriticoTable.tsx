import { FC } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';;
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';;

interface StockCriticoData {
  modelo: string;
  tipo_parte: string;
  cantidad_disponible: number;
}

interface Column {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

interface StockCriticoTableProps {
  data: StockCriticoData[];
  isLoading?: boolean;
}

/**
 * Componente de Negocio: StockCriticoTable
 * Basado en la Vista_Stock_Critico del backend. Alerta sobre piezas faltantes.
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
