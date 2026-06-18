import React, { FC } from 'react';
import { icons } from 'lucide-react';
import './Icon.css';

/**
 * Propiedades del componente {@link Icon}.
 */
export interface IconProps {
  /** 
   * Nombre único del icono en la librería Lucide (ej: 'Mail', 'Download', 'Settings').
   * Debe ser una clave válida del objeto de iconos de `lucide-react`.
   */
  name: keyof typeof icons;
  /** 
   * Altura y anchura del icono en píxeles o porcentaje.
   * @default 20
   */
  size?: number | string;
  /** 
   * Color de relleno/trazo del icono. Puede ser una palabra clave CSS, valor HEX, RGB o variable.
   * @default 'currentColor'
   */
  color?: string;
  /** Clases de estilo CSS adicionales para customizar el contenedor del icono. */
  className?: string;
}

/**
 * Componente Átomo: Icon
 * 
 * Actúa como un contenedor y cargador dinámico unificado para todos los iconos vectoriales de la aplicación.
 * Resuelve y dibuja de manera robusta el SVG correspondiente provisto por la librería `lucide-react`.
 * 
 * @param props - Propiedades del componente definidas en {@link IconProps}.
 * 
 * @throws {Error} Si el nombre del icono provisto no existe en la colección de `lucide-react`.
 * 
 * @example
 * ```tsx
 * // Icono por defecto (20px, color de texto actual)
 * <Icon name="Settings" />
 * 
 * // Icono personalizado más grande y de color rojo
 * <Icon name="Trash2" size={32} color="#e74c3c" />
 * 
 * // Icono con clase de utilidad de márgenes
 * <Icon name="Download" className="mr-2" />
 * ```
 */
export const Icon: FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = 'currentColor',
  className = ''
}) => {
  const LucideIcon = icons[name] as React.ElementType;

  if (!LucideIcon) {
    throw new Error(`El icono "${name}" no se encontró en lucide-react. Verifica que el nombre sea correcto (con mayúsculas, ej: 'Mail', 'AlertCircle').`);
  }

  return (
    <span className={`icon ${className}`.trim()}>
      <LucideIcon size={size} color={color} />
    </span>
  );
};

export default Icon;
