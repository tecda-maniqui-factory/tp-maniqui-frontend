import { ENV } from '@/config/env.config';

/**
 * Servicio de API para la Feature de Autenticación.
 */
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    rol: string;
  };
}

export const authService = {
  /**
   * Envía las credenciales al backend para obtener un token JWT.
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${ENV.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'auth.error.invalid_credentials');
    }

    const data = await response.json();
    
    // Normalización de la respuesta (soporta respuesta plana o anidada)
    return {
      token: data.token,
      user: data.user || {
        id: data.id,
        username: data.username,
        email: data.email,
        rol: data.rol
      }
    };
  },
};
