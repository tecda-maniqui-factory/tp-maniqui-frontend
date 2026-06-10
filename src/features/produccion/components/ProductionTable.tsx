import { FC, ReactNode } from 'react';
import { Table, TableColumn } from '@/components/molecules';
import { Badge } from '@/components/atoms';
import { Maniqui } from '../api/productionService';
import { getProductionColumns } from '../config/production.config';

export interface ProductionTableProps {
  data: Maniqui[];
  t: (key: string) => string;
}

/**
 * Organismo: ProductionTable
 * 
 * Renderiza la tabla de producción de maniquíes con columnas preconfiguradas
 * y formateo dinámico de estados (Badges) y fechas.
 */
export const ProductionTable: FC<ProductionTableProps> = ({ data, t }) => {
  const columns = getProductionColumns(t);

  const renderCell = (item: Maniqui, column: TableColumn): ReactNode => {
    if (column.key === 'status') {
      const variant = item.status === 'Disponible' ? 'success' : 
                      item.status === 'En Producción' ? 'warning' : 
                      item.status === 'Vendido' ? 'info' : 'danger';
      return <Badge variant={variant}>{item.status}</Badge>;
    }
    
    if (column.key === 'fecha_ensamblaje') {
      return item.fecha_ensamblaje ? new Date(item.fecha_ensamblaje).toLocaleDateString() : '-';
    }

    if (column.key === 'modelo_nombre') {
      return item.modelo_nombre || '-';
    }

    return item[column.key as keyof Maniqui] as ReactNode;
  };

  return (
    <Table 
      columns={columns} 
      data={data} 
      renderCell={renderCell}
    />
  );
};
