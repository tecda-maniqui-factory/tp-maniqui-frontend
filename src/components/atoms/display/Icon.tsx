import React, { FC } from 'react';
import { icons } from 'lucide-react';
import './Icon.css';

export interface IconProps {
  /** Nombre del icono de Lucide (ej: 'Mail', 'Download', 'Settings') */
  name: keyof typeof icons;
  /** Tamaño en píxeles */
  size?: number | string;
  /** Color (hex o token CSS) */
  color?: string;
  /** Clase opcional para BEM */
  className?: string;
}

/**
 * Componente Átomo: Icon
 * Actúa como wrapper unificado para todos los iconos de la app.
 */
const Icon: FC<IconProps> = ({ 
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
