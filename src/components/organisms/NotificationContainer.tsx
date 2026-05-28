import { FC, use } from 'react';
import { NotificationContext } from '@/context/NotificationContext';
import Alert from '../molecules/Alert';
import './NotificationContainer.css';

/**
 * Organismo: NotificationContainer
 * Se encarga de renderizar la lista de notificaciones activas en el portal global.
 */
const NotificationContainer: FC = () => {
  const context = use(NotificationContext);

  if (!context || context.notifications.length === 0) return null;

  return (
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
    </div>
  );
};

export default NotificationContainer;
