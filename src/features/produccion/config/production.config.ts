import { TableColumn } from '@/components/molecules/display/Table';;

/**
 * Retrieves the column configuration for the production status table.
 *
 * @param t - Translator function to fetch localized header labels.
 * @returns Array of table columns configuration.
 */
export const getProductionColumns = (t: (key: string) => string): TableColumn[] => [
  { key: 'numero_serie', header: t('production.table.serie') },
  { key: 'modelo_nombre', header: t('production.table.model') },
  { key: 'status', header: t('production.table.status'), align: 'center' },
  { key: 'fecha_ensamblaje', header: t('production.table.date') },
];
