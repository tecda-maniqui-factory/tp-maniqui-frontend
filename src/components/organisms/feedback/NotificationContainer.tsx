import { FC, use } from 'react';
import { createPortal } from 'react-dom';
import { NotificationContext } from '@/context/NotificationContext';
import Alert from '@/components/molecules/feedback/Alert';
import './NotificationContainer.css';

/**
 * Componente Organismo: NotificationContainer
 * 
 * Contenedor flotante global para notificaciones emergentes (toasts).
 * Utiliza `createPortal` para renderizar las alertas activas en el final de `<body>` y se
 * suscribe directamente a {@link NotificationContext} para obtener e iterar las alertas.
 * Cada alerta es renderizada mediante el componente {@link Alert}.
 * 
 * @example
 * ```tsx
 * // Normalmente se monta una única vez en el layout principal de la aplicación:
 * <NotificationProvider>
 *   <AppRouter />
 *   <NotificationContainer />
 * </NotificationProvider>
 * ```
 */
export const NotificationContainer: FC = () => {
  const context = use(NotificationContext);

  if (!context || context.notifications.length === 0) return null;

  return createPortal(
    <div className="notification-container">
      {context.notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.type}
          title={notification.title}
          onClose={() => context.hideNotification(notification.id)}
          className="notification-container__item"
        >
          {notification.message}
        </Alert>
      ))}
    </div>,
    document.body
  );
};

export default NotificationContainer;
