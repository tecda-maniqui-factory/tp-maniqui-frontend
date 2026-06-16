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
    { key: 'nro_factura', header: 'Factura' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'fecha', header: 'Fecha' },
    { key: 'total', header: 'Total' },
    { key: 'estado_afip', header: 'Estado AFIP' },
    { key: 'acciones', header: 'Acciones', align: 'center' as const }
  ];

  const renderCell = (item: VentaData, col: any) => {
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
    return item[col.key as keyof VentaData] as any;
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
