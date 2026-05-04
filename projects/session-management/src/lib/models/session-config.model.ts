/**
 * Configuration interface for session management
 */
export interface SessionConfig {
  /**
   * Session timeout in seconds (default: 1800 = 30 minutes)
   */
  sessionTimeoutInSeconds?: number;

  /**
   * Warning timeout in seconds - shows warning before session expires (default: 120 = 2 minutes)
   */
  warningTimeoutInSeconds?: number;

  /**
   * Keep-alive interval in seconds - sends ping to keep session alive (default: 300 = 5 minutes)
   */
  keepAliveIntervalInSeconds?: number;

  /**
   * Timeout for other session invalidation in seconds (default: 0 = disabled)
   */
  timeoutForOtherSessionInvalidationInSeconds?: number;

  /**
   * Enable idle timeout detection (default: true)
   */
  enableIdleTimeout?: boolean;

  /**
   * Enable multi-tab/session behavior tracking (default: true)
   */
  enableMultiTabTracking?: boolean;

  /**
   * API endpoint to get session configuration from backend
   */
  getConfigApiUrl?: string;

  /**
   * API endpoint to send keep-alive ping
   */
  sendKeepAliveApiUrl?: string;

  /**
   * API endpoint to call on logout/session end
   */
  onLogOffSessionApiUrl?: string;

  /**
   * API endpoint to call after logout is complete
   */
  postLogOffSessionApiUrl?: string;

  /**
   * Route to redirect to on logout (default: '/logout')
   */
  logoutRoute?: string;

  /**
   * Enable automatic token refresh (default: false)
   */
  enableTokenRefresh?: boolean;

  /**
   * Token refresh interval in seconds (default: 600 = 10 minutes)
   */
  tokenRefreshIntervalInSeconds?: number;

  /**
   * Storage type for session data (default: 'localStorage')
   */
  storageType?: 'localStorage' | 'sessionStorage';

  /**
   * Enable debug logging (default: false)
   */
  enableDebugLogging?: boolean;
}

/**
 * Default session configuration
 */
export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  sessionTimeoutInSeconds: 1800, // 30 minutes
  warningTimeoutInSeconds: 120, // 2 minutes
  keepAliveIntervalInSeconds: 300, // 5 minutes
  timeoutForOtherSessionInvalidationInSeconds: 0,
  enableIdleTimeout: true,
  enableMultiTabTracking: true,
  logoutRoute: '/logout',
  enableTokenRefresh: false,
  tokenRefreshIntervalInSeconds: 600, // 10 minutes
  storageType: 'localStorage',
  enableDebugLogging: false,
};

// Made with Bob
