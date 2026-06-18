import { use } from 'react';
import { NotificationContext } from '@/context/NotificationContext';;

/**
 * Hook de acceso rápido a las notificaciones globales.
 * Retorna la función para mostrar notificaciones.
 */
export const useNotify = () => {
  const context = use(NotificationContext);
  if (!context) {
    throw new Error('useNotify debe usarse dentro de un NotificationProvider');
  }
  return context.showNotification;
};
