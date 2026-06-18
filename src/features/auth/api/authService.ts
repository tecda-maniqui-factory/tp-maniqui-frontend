import { ENV } from '@/config/env.config';

/**
 * Servicio de API para la Feature de Autenticación.
 */
/**
 * Structure of the response returned by the login endpoint.
 */
export interface LoginResponse {
  /** The JSON Web Token (JWT) for the authenticated session. */
  token: string;
  /** The authenticated user profile details. */
  user: {
    /** Unique identifier of the user. */
    id: number;
    /** Username of the user. */
    username: string;
    /** Email of the user. */
    email: string;
    /** Role of the user. */
    rol: string;
    /** Optional display name of the user. */
    name?: string;
  };
}

/**
 * Service to handle authentication API calls.
 */
export const authService = {
  /**
   * Sends user credentials to the backend API to obtain a JWT session token.
   *
   * @param username - The username of the user trying to log in.
   * @param password - The password of the user.
   * @returns A promise resolving to the LoginResponse containing token and user info.
   * @throws An error with a message key if credentials or API request fails.
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
