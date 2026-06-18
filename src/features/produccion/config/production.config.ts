import { TableColumn } from '@/components/molecules/display/Table';;

/**
 * Obtiene la configuración de columnas de tabla para el listado de producción de maniquíes.
 *
 * @param t - Función de traducción para internacionalizar las etiquetas de cabecera.
 * @returns Configuración de columnas compatible con {@link Table}.
 * 
 * @example
 * ```ts
 * import { getProductionColumns } from './config/production.config';
 * 
 * const columns = getProductionColumns((key) => key);
 * ```
 */
export const getProductionColumns = (t: (key: string) => string): TableColumn[] => [
  { key: 'numero_serie', header: t('production.table.serie') },
  { key: 'modelo_nombre', header: t('production.table.model') },
  { key: 'status', header: t('production.table.status'), align: 'center' },
  { key: 'fecha_ensamblaje', header: t('production.table.date') },
];
