import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, interval, Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SessionConfig, DEFAULT_SESSION_CONFIG } from '../models/session-config.model';
import {
  SessionState,
  SessionEvent,
  SessionStorageKey,
  BroadcastMessage,
  BroadcastMessageType,
} from '../models/session-state.model';
import { SessionStorageService } from './session-storage.service';
import { IdleTimeoutService } from './idle-timeout.service';

/**
 * Main session management service
 */
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private config: SessionConfig = DEFAULT_SESSION_CONFIG;
  private sessionState: SessionState | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private keepAliveSubscription: Subscription | null = null;
  private tokenRefreshSubscription: Subscription | null = null;
  private tabId: string = this.generateTabId();

  // Observables
  private sessionStateSubject = new BehaviorSubject<SessionState | null>(null);
  private sessionEventSubject = new Subject<SessionEvent>();
  private warningDialogSubject = new BehaviorSubject<boolean>(false);

  public sessionState$ = this.sessionStateSubject.asObservable();
  public sessionEvent$ = this.sessionEventSubject.asObservable();
  public warningDialog$ = this.warningDialogSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: SessionStorageService,
    private idleTimeoutService: IdleTimeoutService,
    @Optional() @Inject('SESSION_CONFIG') private injectedConfig?: SessionConfig
  ) {
    this.initializeConfig();
  }

  /**
   * Initialize session management with configuration
   */
  initialize(config?: Partial<SessionConfig>): void {
    // Merge configurations
    this.config = {
      ...DEFAULT_SESSION_CONFIG,
      ...this.injectedConfig,
      ...config,
    };

    // Set storage type
    this.storageService.setStorageType(this.config.storageType || 'localStorage');

    // Save configuration
    this.storageService.saveSessionConfig(this.config);

    // Load or create session state
    this.loadOrCreateSessionState();

    // Setup idle timeout if enabled
    if (this.config.enableIdleTimeout) {
      this.setupIdleTimeout();
    }

    // Setup multi-tab tracking if enabled
    if (this.config.enableMultiTabTracking) {
      this.setupMultiTabTracking();
    }

    // Setup keep-alive if configured
    if (this.config.sendKeepAliveApiUrl && this.config.keepAliveIntervalInSeconds) {
      this.setupKeepAlive();
    }

    // Setup token refresh if enabled
    if (this.config.enableTokenRefresh && this.config.tokenRefreshIntervalInSeconds) {
      this.setupTokenRefresh();
    }

    // Setup browser event listeners
    this.setupBrowserEventListeners();

    this.log('Session management initialized', this.config);
    this.emitEvent(SessionEvent.SESSION_STARTED);
  }

  /**
   * Start a new session
   */
  startSession(userId?: string, token?: string, refreshToken?: string): void {
    const now = Date.now();
    this.sessionState = {
      isValidSession: true,
      activeTabs: this.storageService.incrementActiveTabs(),
      othersSession: 0,
      lastActivityTime: now,
      sessionStartTime: now,
      isWarningShown: false,
      userId,
      token,
      refreshToken,
    };

    this.storageService.saveSessionState(this.sessionState);
    this.storageService.updateLastActivity();
    this.sessionStateSubject.next(this.sessionState);
    this.emitEvent(SessionEvent.SESSION_STARTED);
    this.log('Session started', this.sessionState);
  }

  /**
   * End the current session
   */
  endSession(reason: 'logout' | 'timeout' | 'expired' = 'logout'): void {
    this.log('Ending session', reason);

    // Call logout API if configured
    if (this.config.onLogOffSessionApiUrl) {
      this.callLogoutApi().subscribe();
    }

    // Broadcast sign-off to other tabs
    this.broadcastMessage({
      type: BroadcastMessageType.SIGN_OFF,
      timestamp: Date.now(),
      tabId: this.tabId,
    });

    // Cleanup
    this.cleanup();

    // Clear storage
    this.storageService.clearSessionData();

    // Update state
    if (this.sessionState) {
      this.sessionState.isValidSession = false;
      this.sessionStateSubject.next(this.sessionState);
    }

    // Emit event
    const event =
      reason === 'timeout' || reason === 'expired'
        ? SessionEvent.SESSION_EXPIRED
        : SessionEvent.SESSION_TERMINATED;
    this.emitEvent(event);

    // Navigate to logout route
    if (this.config.logoutRoute) {
      this.router.navigate([this.config.logoutRoute]);
    }

    // Call post-logout API if configured
    if (this.config.postLogOffSessionApiUrl) {
      this.http.post(this.config.postLogOffSessionApiUrl, {}).subscribe();
    }
  }

  /**
   * Extend the current session
   */
  extendSession(): void {
    if (!this.sessionState || !this.sessionState.isValidSession) {
      return;
    }

    const now = Date.now();
    this.sessionState.lastActivityTime = now;
    this.sessionState.isWarningShown = false;

    this.storageService.saveSessionState(this.sessionState);
    this.storageService.updateLastActivity();
    this.sessionStateSubject.next(this.sessionState);

    // Reset idle timer
    this.idleTimeoutService.resetTimer();

    // Hide warning dialog
    this.warningDialogSubject.next(false);

    this.emitEvent(SessionEvent.SESSION_EXTENDED);
    this.log('Session extended');
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    return this.sessionState?.isValidSession ?? false;
  }

  /**
   * Get current session state
   */
  getSessionState(): SessionState | null {
    return this.sessionState;
  }

  /**
   * Get session configuration
   */
  getConfig(): SessionConfig {
    return this.config;
  }

  /**
   * Update session token
   */
  updateToken(token: string, refreshToken?: string): void {
    if (this.sessionState) {
      this.sessionState.token = token;
      if (refreshToken) {
        this.sessionState.refreshToken = refreshToken;
      }
      this.storageService.saveSessionState(this.sessionState);
      this.sessionStateSubject.next(this.sessionState);
      this.log('Token updated');
    }
  }

  /**
   * Initialize configuration
   */
  private initializeConfig(): void {
    // Try to load config from storage
    const storedConfig = this.storageService.getSessionConfig();
    if (storedConfig) {
      this.config = { ...DEFAULT_SESSION_CONFIG, ...storedConfig };
    }
  }

  /**
   * Load or create session state
   */
  private loadOrCreateSessionState(): void {
    const storedState = this.storageService.getSessionState();
    if (storedState && storedState.isValidSession) {
      this.sessionState = storedState;
      this.sessionStateSubject.next(this.sessionState);
      this.log('Session state loaded from storage', this.sessionState);
    }
  }

  /**
   * Setup idle timeout detection
   */
  private setupIdleTimeout(): void {
    const timeoutSeconds = this.config.sessionTimeoutInSeconds || 1800;
    const warningSeconds = this.config.warningTimeoutInSeconds || 120;

    this.idleTimeoutService.startWatching(timeoutSeconds, warningSeconds);

    // Subscribe to user activity
    this.idleTimeoutService.userActivity$.subscribe(() => {
      this.extendSession();
      this.emitEvent(SessionEvent.USER_ACTIVITY);
    });

    // Subscribe to warning
    this.idleTimeoutService.warning$.subscribe((timeRemaining) => {
      if (!this.sessionState?.isWarningShown) {
        this.showWarningDialog(timeRemaining);
      }
    });

    // Subscribe to idle timeout
    this.idleTimeoutService.idleTimeout$.subscribe(() => {
      this.endSession('timeout');
    });

    this.log('Idle timeout configured', { timeoutSeconds, warningSeconds });
  }

  /**
   * Setup multi-tab tracking
   */
  private setupMultiTabTracking(): void {
    try {
      this.broadcastChannel = new BroadcastChannel('session-management');

      this.broadcastChannel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
        this.handleBroadcastMessage(event.data);
      };

      // Increment active tabs
      this.storageService.incrementActiveTabs();

      this.log('Multi-tab tracking enabled');
    } catch (error) {
      console.warn('BroadcastChannel not supported', error);
    }
  }

  /**
   * Setup keep-alive mechanism
   */
  private setupKeepAlive(): void {
    const intervalSeconds = this.config.keepAliveIntervalInSeconds || 300;

    this.keepAliveSubscription = interval(intervalSeconds * 1000)
      .pipe(
        tap(() => {
          if (this.sessionState?.isValidSession && this.config.sendKeepAliveApiUrl) {
            this.sendKeepAlive().subscribe();
          }
        })
      )
      .subscribe();

    this.log('Keep-alive configured', { intervalSeconds });
  }

  /**
   * Setup token refresh mechanism
   */
  private setupTokenRefresh(): void {
    const intervalSeconds = this.config.tokenRefreshIntervalInSeconds || 600;

    this.tokenRefreshSubscription = interval(intervalSeconds * 1000)
      .pipe(
        tap(() => {
          if (this.sessionState?.isValidSession && this.sessionState.refreshToken) {
            this.refreshToken().subscribe();
          }
        })
      )
      .subscribe();

    this.log('Token refresh configured', { intervalSeconds });
  }

  /**
   * Setup browser event listeners
   */
  private setupBrowserEventListeners(): void {
    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.extendSession();
      }
    });

    // Handle before unload
    window.addEventListener('beforeunload', () => {
      this.storageService.decrementActiveTabs();
      this.broadcastMessage({
        type: BroadcastMessageType.BEFORE_UNLOAD,
        timestamp: Date.now(),
        tabId: this.tabId,
      });
    });

    // Handle page hide (for mobile)
    window.addEventListener('pagehide', () => {
      this.storageService.decrementActiveTabs();
      this.broadcastMessage({
        type: BroadcastMessageType.PAGE_HIDE,
        timestamp: Date.now(),
        tabId: this.tabId,
      });
    });
  }

  /**
   * Show warning dialog
   */
  private showWarningDialog(timeRemaining: number): void {
    if (this.sessionState) {
      this.sessionState.isWarningShown = true;
      this.storageService.saveSessionState(this.sessionState);
    }

    this.warningDialogSubject.next(true);
    this.emitEvent(SessionEvent.SESSION_WARNING);
    this.log('Warning dialog shown', { timeRemaining });
  }

  /**
   * Send keep-alive request
   */
  private sendKeepAlive(): Observable<any> {
    return this.http.post(this.config.sendKeepAliveApiUrl!, {}).pipe(
      tap(() => {
        this.emitEvent(SessionEvent.KEEP_ALIVE_SENT);
        this.log('Keep-alive sent');
      }),
      catchError((error) => {
        console.error('Keep-alive failed', error);
        throw error;
      })
    );
  }

  /**
   * Refresh authentication token
   */
  private refreshToken(): Observable<any> {
    // This should be implemented based on your backend API
    // Example implementation:
    return this.http
      .post('/api/auth/refresh', {
        refreshToken: this.sessionState?.refreshToken,
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.updateToken(response.token, response.refreshToken);
            this.emitEvent(SessionEvent.TOKEN_REFRESHED);
            this.log('Token refreshed');
          }
        }),
        catchError((error) => {
          console.error('Token refresh failed', error);
          this.endSession('expired');
          throw error;
        })
      );
  }

  /**
   * Call logout API
   */
  private callLogoutApi(): Observable<any> {
    return this.http.post(this.config.onLogOffSessionApiUrl!, {}).pipe(
      tap(() => this.log('Logout API called')),
      catchError((error) => {
        console.error('Logout API failed', error);
        throw error;
      })
    );
  }

  /**
   * Broadcast message to other tabs
   */
  private broadcastMessage(message: BroadcastMessage): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(message);
    }
  }

  /**
   * Handle broadcast message from other tabs
   */
  private handleBroadcastMessage(message: BroadcastMessage): void {
    if (message.tabId === this.tabId) {
      return; // Ignore messages from self
    }

    switch (message.type) {
      case BroadcastMessageType.SIGN_OFF:
        this.log('Sign-off received from another tab');
        this.endSession('logout');
        break;

      case BroadcastMessageType.SESSION_STATUS:
        this.log('Session status update from another tab', message.payload);
        break;

      default:
        this.log('Unknown broadcast message', message);
    }
  }

  /**
   * Emit session event
   */
  private emitEvent(event: SessionEvent): void {
    this.sessionEventSubject.next(event);
  }

  /**
   * Generate unique tab ID
   */
  private generateTabId(): string {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log message if debug logging is enabled
   */
  private log(message: string, data?: any): void {
    if (this.config.enableDebugLogging) {
      console.log(`[SessionService] ${message}`, data || '');
    }
  }

  /**
   * Cleanup subscriptions and listeners
   */
  private cleanup(): void {
    if (this.keepAliveSubscription) {
      this.keepAliveSubscription.unsubscribe();
    }

    if (this.tokenRefreshSubscription) {
      this.tokenRefreshSubscription.unsubscribe();
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }

    this.idleTimeoutService.stopWatching();
  }

  /**
   * Destroy service
   */
  ngOnDestroy(): void {
    this.cleanup();
    this.sessionStateSubject.complete();
    this.sessionEventSubject.complete();
    this.warningDialogSubject.complete();
  }
}

// Made with Bob
