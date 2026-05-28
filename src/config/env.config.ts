/**
 * Configuración centralizada de variables de entorno.
 * Centraliza el acceso a import.meta.env para facilitar el mantenimiento y testing.
 */
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Tecda Maniquí',
  VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  IS_DEV: import.meta.env.MODE === 'development',
} as const;
