import { ReactNode } from 'react';
import './Table.css';

/**
 * Configuración para una columna de la tabla.
 */
export interface TableColumn {
  /** Clave única que identifica la columna en el objeto de datos. */
  key: string;
  /** Componente o texto a renderizar en la cabecera de la columna. */
  header: ReactNode;
  /** Alineación horizontal de los valores de la columna. */
  align?: 'left' | 'center' | 'right';
}

/**
 * Props para el componente {@link Table}.
 * 
 * @template T - Tipo de los elementos de datos a renderizar en las filas.
 */
export interface TableProps<T> {
  /** Listado de configuraciones de columnas de tipo {@link TableColumn}. */
  columns: TableColumn[];
  /** Colección de elementos de datos para poblar las filas de la tabla. */
  data: T[];
  /** Elemento opcional a renderizar en el pie de página de la tabla (footer). */
  footer?: ReactNode;
  /** Habilita la variante compacta reduciendo el padding de las celdas. */
  isCompact?: boolean;
  /** Habilita el cambio visual en la fila al pasar el cursor (hover). */
  isHoverable?: boolean;
  /** Clase CSS adicional para personalizar estilos de la tabla. */
  className?: string;
  /** Función personalizada de renderizado para celdas específicas. */
  renderCell?: (item: T, column: TableColumn) => ReactNode;
  /** Callback opcional para extraer la clave única de cada fila. */
  rowKey?: (item: T) => string | number;
}

/**
 * Componente de Tabla flexible siguiendo la metodología BEM y Atomic Design.
 * 
 * Soporta cabeceras de columna accesibles mediante `scope="col"`, renderizado condicional,
 * pie de tabla y mapeo personalizado de celdas y claves de fila.
 * 
 * @example
 * ```tsx
 * import Table, { TableColumn } from './Table';
 * 
 * interface User { id: number; name: string; role: string; }
 * 
 * const columns: TableColumn[] = [
 *   { key: 'name', header: 'Nombre Completo' },
 *   { key: 'role', header: 'Rol del Sistema', align: 'center' }
 * ];
 * 
 * const users: User[] = [
 *   { id: 1, name: 'Juan Pérez', role: 'Administrador' }
 * ];
 * 
 * const UserTable = () => (
 *   <Table 
 *     columns={columns} 
 *     data={users} 
 *     rowKey={(user) => user.id} 
 *     isHoverable={true} 
 *   />
 * );
 * ```
 * 
 * @param props - Props matching {@link TableProps}.
 * @returns Elemento React representativo de la tabla.
 */
const Table = <T extends Record<string, any>>({
  columns,
  data,
  footer,
  isCompact = false,
  isHoverable = true,
  className = '',
  renderCell,
  rowKey
}: TableProps<T>) => {
  const tableClasses = [
    'table',
    isCompact ? 'table--compact' : '',
    className
  ].filter(Boolean).join(' ');

  const rowClasses = [
    'table__row',
    isHoverable ? 'table__row--hoverable' : ''
  ].filter(Boolean).join(' ');

  const getRowKey = (item: T, index: number): string | number => {
    if (rowKey) return rowKey(item);
    return item.id !== undefined ? item.id : index;
  };

  return (
    <div className="table-container">
      <table className={tableClasses}>
        <thead className="table__header">
          <tr className="table__row">
            {columns.map((col) => (
              <th 
                scope="col"
                key={col.key} 
                className={`table__header-cell table__header-cell--${col.align || 'left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {data && data.length > 0 ? (
            data.map((item, index) => {
              const key = getRowKey(item, index);
              return (
                <tr key={key} className={rowClasses}>
                  {columns.map((col) => (
                    <td 
                      key={`${key}-${col.key}`} 
                      className={`table__cell table__cell--${col.align || 'left'}`}
                    >
                      {renderCell ? renderCell(item, col) : (item[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr className="table__row">
              <td colSpan={columns.length} className="table__cell table__cell--center">
                Sin datos disponibles
              </td>
            </tr>
          )}
        </tbody>
        {footer && (
          <tfoot className="table__footer">
            {footer}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Table;
