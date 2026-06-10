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
    
    // Normalización de la respuesta (soporta usuario, user o respuesta plana)
    const userData = data.usuario || data.user || data;

    return {
      token: data.token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        rol: userData.rol,
        name: userData.nombre || userData.nombre_completo
      }
    };
  },
};
