import { ReactNode } from 'react';
import './Table.css';

export interface TableColumn {
  key: string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: TableColumn[];
  data: T[];
  footer?: ReactNode;
  isCompact?: boolean;
  isHoverable?: boolean;
  className?: string;
  renderCell?: (item: T, column: TableColumn) => ReactNode;
  rowKey?: (item: T) => string | number;
}

/**
 * Componente de Tabla flexible siguiendo BEM y Atomic Design.
 * Soporta scope="col" accesible y personalización del rowKey.
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
