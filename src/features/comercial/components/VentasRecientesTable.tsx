import { FC } from 'react';
import { Table, Card } from '../../../components/molecules';
import { Button, Badge } from '../../../components/atoms';

interface VentaData {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  nro_factura: string;
  cae?: string;
  moneda: 'ARS' | 'USD';
}

interface VentasRecientesTableProps {
  data: VentaData[];
  onViewDetail?: (id: number) => void;
}

/**
 * Componente de Negocio: VentasRecientesTable
 * Muestra el historial comercial integrando campos de facturación electrónica.
 */
export const VentasRecientesTable: FC<VentasRecientesTableProps> = ({ data, onViewDetail }) => {
  const columns = [
    { header: 'Factura', accessor: 'nro_factura' },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Fecha', accessor: (row: VentaData) => new Date(row.fecha).toLocaleDateString() },
    { 
      header: 'Total', 
      accessor: (row: VentaData) => `${row.total.toLocaleString()} ${row.moneda}` 
    },
    { 
      header: 'Estado AFIP', 
      accessor: (row: VentaData) => (
        <Badge variant={row.cae ? 'success' : 'warning'}>
          {row.cae ? 'Validado' : 'Pendiente'}
        </Badge>
      ) 
    },
    {
      header: 'Acciones',
      accessor: (row: VentaData) => (
        <Button variant="secondary" size="compact" iconName="Eye" onClick={() => onViewDetail?.(row.id)}>
          Ver
        </Button>
      )
    }
  ];

  return (
    <Card title="Últimas Ventas Realizadas">
      <Table 
        columns={columns} 
        data={data} 
      />
    </Card>
  );
};
