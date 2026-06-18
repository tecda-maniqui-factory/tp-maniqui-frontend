import { ENV } from '@/config/env.config';

/**
 * Servicio de API para la Feature de Autenticación.
 */
/**
 * Estructura de la respuesta devuelta por el endpoint de inicio de sesión.
 */
export interface LoginResponse {
  /** El JSON Web Token (JWT) para la sesión autenticada. */
  token: string;
  /** Los detalles del perfil de usuario autenticado. */
  user: {
    /** Identificador único del usuario. */
    id: number;
    /** Nombre de usuario del usuario. */
    username: string;
    /** Correo electrónico del usuario. */
    email: string;
    /** Rol del usuario en el sistema. */
    rol: string;
    /** Nombre opcional para mostrar. */
    name?: string;
  };
}

/**
 * Servicio encargado de gestionar las llamadas a la API de autenticación del backend.
 * 
 * Se consume principalmente dentro de {@link useLoginController}.
 */
export const authService = {
  /**
   * Envía las credenciales de usuario a la API del backend para obtener un token JWT de sesión.
   *
   * @param username - El nombre de usuario que intenta iniciar sesión.
   * @param password - Contraseña en texto plano.
   * @returns Promesa que resuelve a un {@link LoginResponse} con el token y datos del usuario.
   * @throws {Error} Si el inicio de sesión falla o la respuesta HTTP no es exitosa (ej. credenciales incorrectas).
   * 
   * @example
   * ```ts
   * import { authService } from './authService';
   * 
   * try {
   *   const res = await authService.login('admin', 'password');
   *   console.log('JWT:', res.token);
   * } catch (error) {
   *   console.error('Error de autenticación:', error);
   * }
   * ```
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
