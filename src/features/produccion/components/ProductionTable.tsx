import { FC, ReactNode } from 'react';
import Table, { TableColumn } from '@/components/molecules/display/Table';;
import Badge from '@/components/atoms/display/Badge';;
import { Maniqui } from '../api/productionService';
import { getProductionColumns } from '../config/production.config';

/**
 * Propiedades del componente {@link ProductionTable}.
 */
export interface ProductionTableProps {
  /** Colección de registros de maniquíes {@link Maniqui} a desplegar en la tabla. */
  data: Maniqui[];
  /** Utilidad de traducción. */
  t: (key: string) => string;
}

/**
 * Componente Organismo: `ProductionTable`
 * 
 * Renderiza el historial y stock de maniquíes utilizando el listado {@link Table}
 * con columnas configuradas de manera estándar (número de serie, modelo, fecha de ensamblaje, estado).
 * Formatea de forma dinámica las celdas mediante {@link Badge} para los estados de ciclo de vida.
 * 
 * @example
 * ```tsx
 * import { ProductionTable } from './components/ProductionTable';
 * 
 * const data = [
 *   { id: 1, nro_serie: 'SN-001', id_modelo: 10, status: 'Disponible' as const, fecha_ensamblaje: '2026-06-18', modelo_nombre: 'Busto' }
 * ];
 * 
 * <ProductionTable data={data} t={(key) => key} />
 * ```
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
