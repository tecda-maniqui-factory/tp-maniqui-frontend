import { FC } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';;
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';;

/**
 * Represents a sale entry record within the table.
 */
interface VentaData {
  /** Unique identifier of the sale. */
  id: number;
  /** Name of the customer. */
  cliente: string;
  /** Sale timestamp or date string. */
  fecha: string;
  /** Total cost amount of the sale. */
  total: number;
  /** Invoice identifier number. */
  nro_factura: string;
  /** Optional Authorization Code (CAE) from AFIP. */
  cae?: string;
  /** Sale currency. */
  moneda: 'ARS' | 'USD';
}

/**
 * Represents a column configuration for the table.
 */
interface Column {
  /** The key pointing to the item data property. */
  key: string;
  /** Header label of the column. */
  header: string;
  /** Alignment of the cell text. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Props for the VentasRecientesTable component.
 */
interface VentasRecientesTableProps {
  /** List of recent sales data to display. */
  data: VentaData[];
  /** Callback triggered when clicking to view details of a specific sale. */
  onViewDetail?: (id: number) => void;
}

/**
 * Business Component: VentasRecientesTable
 * Displays recent sales transaction history, integrated with AFIP billing status badges.
 */
export const VentasRecientesTable: FC<VentasRecientesTableProps> = ({ data, onViewDetail }) => {
  const columns = [
    { key: 'nro_factura', header: 'Factura' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'fecha', header: 'Fecha' },
    { key: 'total', header: 'Total' },
    { key: 'estado_afip', header: 'Estado AFIP' },
    { key: 'acciones', header: 'Acciones', align: 'center' as const }
  ];

  const renderCell = (item: VentaData, col: Column) => {
    if (col.key === 'fecha') {
      return new Date(item.fecha).toLocaleDateString();
    }
    if (col.key === 'total') {
      return `${item.total.toLocaleString()} ${item.moneda}`;
    }
    if (col.key === 'estado_afip') {
      return (
        <Badge variant={item.cae ? 'success' : 'warning'}>
          {item.cae ? 'Validado' : 'Pendiente'}
        </Badge>
      );
    }
    if (col.key === 'acciones') {
      return (
        <Button variant="secondary" size="compact" iconName="Eye" onClick={() => onViewDetail?.(item.id)}>
          Ver
        </Button>
      );
    }
    return item[col.key as keyof VentaData] as string | number | undefined;
  };

  return (
    <Card title="Últimas Ventas Realizadas">
      <Table 
        columns={columns} 
        data={data} 
        renderCell={renderCell}
      />
    </Card>
  );
};
