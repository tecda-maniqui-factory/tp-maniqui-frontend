import { FC } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';
import Button from '@/components/atoms/form/Button';
import Badge from '@/components/atoms/display/Badge';

/**
 * Representa un registro de entrada de venta dentro de la tabla.
 */
export interface VentaData {
  /** Identificador único de la venta. */
  id: number;
  /** Nombre del cliente. */
  cliente: string;
  /** Fecha o cadena de fecha de la venta. */
  fecha: string;
  /** Monto total de la venta. */
  total: number;
  /** Número de factura asociado. */
  nro_factura: string;
  /** Código de Autorización Electrónico (CAE) opcional de la AFIP. */
  cae?: string;
  /** Moneda de la venta. */
  moneda: 'ARS' | 'USD';
}

/**
 * Representa la configuración de columna para la tabla.
 */
export interface Column {
  /** La clave asociada al campo de los datos. */
  key: string;
  /** Etiqueta de cabecera de la columna. */
  header: string;
  /** Alineación del texto de la celda. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Propiedades del componente {@link VentasRecientesTable}.
 */
export interface VentasRecientesTableProps {
  /** Listado de datos de ventas recientes a mostrar. */
  data: VentaData[];
  /** Función callback que se ejecuta al presionar ver detalle de una venta específica. */
  onViewDetail?: (id: number) => void;
}

/**
 * Componente de Negocio: `VentasRecientesTable`
 * 
 * Muestra el historial de transacciones de ventas recientes en un panel tipo tarjeta ({@link Card}).
 * Integra el listado genérico {@link Table} y formatea celdas complejas como fechas, totales
 * monetarios con su respectiva divisa, y estados de validación AFIP (usando {@link Badge}).
 * 
 * @example
 * ```tsx
 * import { VentasRecientesTable } from './components/VentasRecientesTable';
 * 
 * const sales = [
 *   { id: 1, cliente: 'Cliente A', fecha: '2026-06-18', total: 50000, nro_factura: 'FAC-0001', cae: '123456', moneda: 'ARS' as const }
 * ];
 * 
 * <VentasRecientesTable data={sales} onViewDetail={(id) => console.log('Ver detalle de venta:', id)} />
 * ```
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
