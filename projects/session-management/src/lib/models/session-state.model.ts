/**
 * Session state interface
 */
export interface SessionState {
  /**
   * Whether the session is valid
   */
  isValidSession: boolean;

  /**
   * Active tabs count
   */
  activeTabs: number;

  /**
   * Other sessions count
   */
  othersSession: number;

  /**
   * Last activity timestamp
   */
  lastActivityTime: number;

  /**
   * Session start timestamp
   */
  sessionStartTime: number;

  /**
   * Whether warning dialog is shown
   */
  isWarningShown: boolean;

  /**
   * User ID or identifier
   */
  userId?: string;

  /**
   * Authentication token
   */
  token?: string;

  /**
   * Refresh token
   */
  refreshToken?: string;
}

/**
 * Session events enum
 */
export enum SessionEvent {
  SESSION_STARTED = 'session-started',
  SESSION_EXTENDED = 'session-extended',
  SESSION_WARNING = 'session-warning',
  SESSION_EXPIRED = 'session-expired',
  SESSION_TERMINATED = 'session-terminated',
  USER_ACTIVITY = 'user-activity',
  KEEP_ALIVE_SENT = 'keep-alive-sent',
  TOKEN_REFRESHED = 'token-refreshed',
  MULTI_TAB_DETECTED = 'multi-tab-detected',
}

/**
 * Session storage keys
 */
export enum SessionStorageKey {
  SESSION_STATE = 'sm_session_state',
  SESSION_CONFIG = 'sm_session_config',
  ACTIVE_TABS = 'sm_active_tabs',
  LAST_ACTIVITY = 'sm_last_activity',
  SESSION_TIMER = 'sm_session_timer',
  DIALOG_TIMER = 'sm_dialog_timer',
}

/**
 * Broadcast channel message types
 */
export enum BroadcastMessageType {
  SESSION_TIMER = 'session-timer',
  DIALOG_TIMER = 'dialog-timer',
  SESSION_STATUS = 'session-status',
  SIGN_OFF = 'sign-off',
  FOCUS = 'focus',
  BEFORE_UNLOAD = 'beforeunload',
  PAGE_HIDE = 'pagehide',
}

/**
 * Broadcast channel message interface
 */
export interface BroadcastMessage {
  type: BroadcastMessageType;
  payload?: any;
  timestamp: number;
  tabId: string;
}

// Made with Bob
