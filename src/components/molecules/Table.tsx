import { FC, ReactNode } from 'react';
import './Table.css';

export interface TableColumn {
  key: string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  footer?: ReactNode;
  isCompact?: boolean;
  isHoverable?: boolean;
  className?: string;
  renderCell?: (item: any, column: TableColumn) => ReactNode;
}

/**
 * Componente de Tabla flexible siguiendo BEM y Atomic Design.
 */
const Table: FC<TableProps> = ({
  columns,
  data,
  footer,
  isCompact = false,
  isHoverable = true,
  className = '',
  renderCell
}) => {
  const tableClasses = [
    'table',
    isCompact ? 'table--compact' : '',
    className
  ].filter(Boolean).join(' ');

  const rowClasses = [
    'table__row',
    isHoverable ? 'table__row--hoverable' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="table-container" style={{ overflowX: 'auto', width: '100%' }}>
      <table className={tableClasses}>
        <thead className="table__header">
          <tr className="table__row">
            {columns.map((col) => (
              <th 
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
            data.map((item, index) => (
              <tr key={item.id || index} className={rowClasses}>
                {columns.map((col) => (
                  <td 
                    key={`${item.id || index}-${col.key}`} 
                    className={`table__cell table__cell--${col.align || 'left'}`}
                  >
                    {renderCell ? renderCell(item, col) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
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
