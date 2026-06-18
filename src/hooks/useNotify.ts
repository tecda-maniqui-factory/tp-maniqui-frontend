import { use } from 'react';
import { NotificationContext } from '@/context/NotificationContext';;

/**
 * Hook personalizado para disparar notificaciones en cualquier parte de la aplicación.
 * 
 * Consume el {@link NotificationContext} y retorna exclusivamente el método `showNotification`
 * para simplificar la llamada.
 * 
 * @example
 * ```tsx
 * import { useNotify } from '@/hooks/useNotify';
 * 
 * const SaveButton = () => {
 *   const notify = useNotify();
 *   const handleSave = () => {
 *     notify('Guardado con éxito', 'success', 'Operación Exitosa');
 *   };
 *   return <button onClick={handleSave}>Guardar</button>;
 * };
 * ```
 * 
 * @returns Función `showNotification` para disparar notificaciones.
 * @throws {Error} Si el hook se invoca fuera del árbol de componentes envuelto por {@link NotificationProvider}.
 */
export const useNotify = () => {
  const context = use(NotificationContext);
  if (!context) {
    throw new Error('useNotify debe usarse dentro de un NotificationProvider');
  }
  return context.showNotification;
};
