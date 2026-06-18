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
 * Componente de Tabla flexible y genérico siguiendo la metodología BEM.
 * 
 * Proporciona un renderizado seguro y accesible de datos tabulares con soporte para:
 * - Cabeceras de columna alineables mediante {@link TableColumn.align}.
 * - Renderizadores de celda dinámicos y avanzados mediante {@link TableProps.renderCell}.
 * - Variante estética compacta y filas interactivas al pasar el cursor (hover).
 * - Mensajes de estado cuando la colección de datos está vacía.
 * 
 * @template T - Tipo del registro de datos (debe extender de un objeto estándar indexable).
 * @param props - Propiedades definidas en {@link TableProps}.
 * 
 * @example
 * ```tsx
 * // 1. Tabla básica de texto
 * const columns = [
 *   { key: 'nombre', header: 'Nombre' },
 *   { key: 'rol', header: 'Rol', align: 'center' }
 * ];
 * 
 * <Table columns={columns} data={usuarios} rowKey={(u) => u.id} />
 * 
 * // 2. Tabla avanzada usando renderCell para inyectar otros componentes
 * const columns = [
 *   { key: 'nombre', header: 'Nombre' },
 *   { key: 'estado', header: 'Estado', align: 'center' },
 *   { key: 'acciones', header: 'Acciones', align: 'right' }
 * ];
 * 
 * <Table 
 *   columns={columns} 
 *   data={usuarios}
 *   rowKey={(u) => u.id}
 *   renderCell={(user, col) => {
 *     if (col.key === 'estado') {
 *       return <Badge variant={user.active ? 'success' : 'danger'}>{user.active ? 'Activo' : 'Inactivo'}</Badge>;
 *     }
 *     if (col.key === 'acciones') {
 *       return <Button iconName="Edit" isCompact onClick={() => handleEdit(user.id)} />;
 *     }
 *     return user[col.key];
 *   }}
 * />
 * ```
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
