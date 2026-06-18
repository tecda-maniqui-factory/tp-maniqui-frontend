import { FC } from 'react';
import Table from '@/components/molecules/display/Table';
import Card from '@/components/molecules/display/Card';;
import Icon from '@/components/atoms/display/Icon';
import Badge from '@/components/atoms/display/Badge';;

interface RentabilidadData {
  maniqui_serie: string;
  modelo: string;
  precio_lista: number;
  costo_total_piezas: number;
  margen_bruto: number;
  porcentaje_margen: number;
}

interface Column {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

interface RentabilidadTableProps {
  data: RentabilidadData[];
  isLoading?: boolean;
}

/**
 * Componente de Negocio: RentabilidadTable
 * Muestra el análisis de márgenes basado en la Vista_Rentabilidad del backend.
 */
export const RentabilidadTable: FC<RentabilidadTableProps> = ({ data, isLoading }) => {
  const columns = [
    { key: 'maniqui_serie', header: 'Maniquí (Serie)' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'precio_lista', header: 'Precio Venta', align: 'right' as const },
    { key: 'costo_total_piezas', header: 'Costo Total', align: 'right' as const },
    { key: 'porcentaje_margen', header: 'Margen (%)', align: 'center' as const },
    { key: 'margen_bruto', header: 'Ganancia Neta', align: 'right' as const }
  ];

  const renderCell = (item: RentabilidadData, col: Column) => {
    if (col.key === 'maniqui_serie') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name="Cpu" size={16} color="var(--text-muted)" />
          <span style={{ fontWeight: 600 }}>{item.maniqui_serie}</span>
        </div>
      );
    }
    if (col.key === 'precio_lista') return `$${item.precio_lista.toLocaleString()}`;
    if (col.key === 'costo_total_piezas') return `$${item.costo_total_piezas.toLocaleString()}`;
    if (col.key === 'porcentaje_margen') {
      return (
        <Badge variant={item.porcentaje_margen > 30 ? 'success' : item.porcentaje_margen > 15 ? 'warning' : 'danger'}>
          {item.porcentaje_margen}%
        </Badge>
      );
    }
    if (col.key === 'margen_bruto') {
      return (
        <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
          +${item.margen_bruto.toLocaleString()}
        </span>
      );
    }
    return item[col.key as keyof RentabilidadData] as string | number | undefined;
  };

  return (
    <Card title="Análisis de Rentabilidad por Unidad">
      <Table 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        renderCell={renderCell}
      />
    </Card>
  );
};
