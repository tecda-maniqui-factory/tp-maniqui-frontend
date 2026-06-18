import { FC, ReactNode } from 'react';
import Icon from '@/components/atoms/display/Icon';
import { icons } from 'lucide-react';
import './Alert.css';

/**
 * Propiedades del componente {@link Alert}.
 */
export interface AlertProps {
  /** Título opcional en negrita para encabezar el mensaje de alerta. */
  title?: string;
  /** Contenido principal o mensaje detallado a mostrar dentro de la alerta. */
  children: ReactNode;
  /** 
   * Variante visual que define el color del contenedor y el icono por defecto (Flat UI).
   * @default 'info'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** 
   * Nombre de un icono personalizado de Lucide a renderizar a la izquierda.
   * Si no se provee, se elige uno automáticamente basándose en la {@link AlertProps.variant}.
   */
  iconName?: keyof typeof icons;
  /** 
   * Función callback opcional para cerrar o descartar la alerta.
   * Si está presente, renderiza un botón de cierre en forma de cruz ('X') a la derecha.
   */
  onClose?: () => void;
  /** Clase CSS adicional para sobreescribir estilos o definir márgenes. */
  className?: string;
}

/** Iconos por defecto de Lucide asociados a cada variante de alerta. */
const defaultIcons: Record<string, keyof typeof icons> = {
  primary: 'Info',
  secondary: 'Info',
  danger: 'CircleAlert',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  info: 'Info'
};

/**
 * Componente Molécula: Alert
 * 
 * Banner estático de retroalimentación para mostrar información relevante, advertencias,
 * éxitos o errores de negocio. Incluye soporte para cierre interactivo y resolución automática de iconos.
 * Cumple con accesibilidad WAI-ARIA asignando el atributo `role="alert"`.
 * 
 * @param props - Propiedades definidas en {@link AlertProps}.
 * 
 * @example
 * ```tsx
 * // Alerta informativa básica
 * <Alert variant="info">
 *   El sistema se actualizará a las 22:00 hs.
 * </Alert>
 * 
 * // Alerta de éxito con título
 * <Alert variant="success" title="¡Ensamblado Exitoso!">
 *   El maniquí número de serie S-1-2491 se ha guardado en el inventario.
 * </Alert>
 * 
 * // Alerta descartable de peligro con callback
 * <Alert 
 *   variant="danger" 
 *   title="Error de Validación" 
 *   onClose={() => setHasError(false)}
 * >
 *   Faltan piezas en el stock de cabezas para el modelo elegido.
 * </Alert>
 * ```
 */
const Alert: FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  iconName,
  onClose,
  className = ''
}) => {
  const baseClass = 'alert';
  const variantClass = `${baseClass}--${variant}`;
  const IconComponent = iconName || defaultIcons[variant] || 'Info';

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} role="alert">
      <div className={`${baseClass}__icon-wrapper`}>
        <Icon name={IconComponent} className={`${baseClass}__icon`} />
      </div>
      <div className={`${baseClass}__content`}>
        {title && <h4 className={`${baseClass}__title`}>{title}</h4>}
        <div className={`${baseClass}__message`}>{children}</div>
      </div>
      {onClose && (
        <button 
          className={`${baseClass}__close`} 
          onClick={onClose}
          aria-label="Cerrar alerta"
        >
          <Icon name="X" />
        </button>
      )}
    </div>
  );
};

export default Alert;
