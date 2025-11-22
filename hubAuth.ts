/**
 * HubAuth - Utilidad para recibir tokens JWT desde Hub WebsOpen
 * Se ejecuta automáticamente al cargar cualquier web del sistema
 */

export interface HubTokenData {
  token: string;
  owner_id: string;
}

export interface HubAuthConfig {
  onTokenReceived?: (tokenData: HubTokenData) => void | Promise<void>;
  tokenParamName?: string;
  ownerIdParamName?: string;
  autoStore?: boolean; // Auto-guardar en localStorage
}

const DEFAULT_CONFIG: HubAuthConfig = {
  tokenParamName: 'token',
  ownerIdParamName: 'owner_id',
  autoStore: true,
};

/**
 * Obtener token y owner_id de la URL
 * Soporta: ?token=xxx&owner_id=xxx (enviados por Hub)
 */
export const getHubTokenFromUrl = (config: HubAuthConfig = {}): HubTokenData | null => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const urlParams = new URLSearchParams(window.location.search);

  const token = urlParams.get(finalConfig.tokenParamName!);
  const owner_id = urlParams.get(finalConfig.ownerIdParamName!);

  if (token && owner_id) {
    return { token, owner_id };
  }

  return null;
};

/**
 * Limpiar parámetros de token de la URL
 */
export const cleanHubParamsFromUrl = (config: HubAuthConfig = {}): void => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const url = new URL(window.location.href);
  url.searchParams.delete(finalConfig.tokenParamName!);
  url.searchParams.delete(finalConfig.ownerIdParamName!);
  window.history.replaceState({}, document.title, url.toString());
};

/**
 * Inicializar autenticación desde Hub
 * Debe llamarse al inicio de la aplicación
 *
 * Ejemplo de uso:
 * ```typescript
 * useEffect(() => {
 *   initHubAuth({
 *     onTokenReceived: async (tokenData) => {
 *       // Guardar token en tu state management
 *       setToken(tokenData.token);
 *       setOwnerId(tokenData.owner_id);
 *     }
 *   });
 * }, []);
 * ```
 */
export const initHubAuth = async (config: HubAuthConfig = {}): Promise<HubTokenData | null> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Verificar si hay token en la URL
  const tokenData = getHubTokenFromUrl(finalConfig);

  if (tokenData) {
    console.log('[HubAuth] 🔐 Token recibido desde Hub WebsOpen');
    console.log('[HubAuth] Owner ID:', tokenData.owner_id);

    // Auto-guardar en localStorage si está habilitado
    if (finalConfig.autoStore) {
      localStorage.setItem('hub_token', tokenData.token);
      localStorage.setItem('owner_id', tokenData.owner_id);
      console.log('[HubAuth] ✅ Token guardado en localStorage');
    }

    // Callback con el token
    if (finalConfig.onTokenReceived) {
      try {
        await finalConfig.onTokenReceived(tokenData);
        console.log('[HubAuth] ✅ Token procesado exitosamente');
      } catch (error) {
        console.error('[HubAuth] ❌ Error procesando token:', error);
      }
    }

    // Limpiar URL
    cleanHubParamsFromUrl(finalConfig);

    return tokenData;
  }

  // Si no hay token en URL, intentar cargar desde localStorage
  const storedToken = localStorage.getItem('hub_token');
  const storedOwnerId = localStorage.getItem('owner_id');

  if (storedToken && storedOwnerId) {
    console.log('[HubAuth] 📦 Token cargado desde localStorage');
    return { token: storedToken, owner_id: storedOwnerId };
  }

  console.log('[HubAuth] ⚠️  No se encontró token (ni en URL ni en localStorage)');
  return null;
};

/**
 * Verificar si el usuario tiene un token válido
 */
export const hasValidToken = (): boolean => {
  const token = localStorage.getItem('hub_token');
  return !!token;
};

/**
 * Obtener token del localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('hub_token');
};

/**
 * Obtener owner_id del localStorage
 */
export const getStoredOwnerId = (): string | null => {
  return localStorage.getItem('owner_id');
};

/**
 * Cerrar sesión (eliminar token)
 */
export const logout = (): void => {
  localStorage.removeItem('hub_token');
  localStorage.removeItem('owner_id');
  console.log('[HubAuth] 👋 Sesión cerrada');
};

export default {
  getHubTokenFromUrl,
  cleanHubParamsFromUrl,
  initHubAuth,
  hasValidToken,
  getStoredToken,
  getStoredOwnerId,
  logout,
};
