import { TableColumn } from '@/components/molecules';

export const getProductionColumns = (t: (key: string) => string): TableColumn[] => [
  { key: 'numero_serie', header: t('production.table.serie') },
  { key: 'modelo_nombre', header: t('production.table.model') },
  { key: 'status', header: t('production.table.status'), align: 'center' },
  { key: 'fecha_ensamblaje', header: t('production.table.date') },
];
