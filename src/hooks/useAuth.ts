import { use } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Hook de acceso rápido a la autenticación.
 * Encapsula el consumo del AuthContext.
 */
export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
