import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SessionService, SessionWarningDialogComponent, SessionEvent } from 'session-management';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SessionWarningDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  title = 'Session Management Demo - Multi-User Testing';
  isLoggedIn = false;
  sessionInfo: any = null;
  conflictMessage = '';
  private destroy$ = new Subject<void>();
  private tabId = `Tab_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  constructor(private sessionService: SessionService) {
    console.log(`%c[${this.tabId}] Tab initialized`, 'color: blue; font-weight: bold');
  }

  ngOnInit(): void {
    // Check for existing session on load
    this.checkExistingSession();

    // Subscribe to session events
    this.sessionService.sessionEvent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        console.log(`%c[${this.tabId}] Session Event: ${event}`, 'color: green');
        this.updateSessionInfo();

        if (event === SessionEvent.SESSION_EXPIRED || event === SessionEvent.SESSION_TERMINATED) {
          this.isLoggedIn = false;
          this.conflictMessage = '';
        }
      });

    // Subscribe to session state changes
    this.sessionService.sessionState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        console.log(`%c[${this.tabId}] Session State:`, 'color: purple', state);
        this.sessionInfo = state;
        this.isLoggedIn = state?.isValidSession ?? false;
      });

    // Check for session conflicts on window focus
    window.addEventListener('focus', () => {
      console.log(`%c[${this.tabId}] Window focused - checking session`, 'color: orange');
      this.checkSessionConflict();
    });

    // Listen for storage changes (other tabs)
    window.addEventListener('storage', (event) => {
      if (event.key === 'sm_current_user') {
        console.log(`%c[${this.tabId}] Storage changed - checking conflict`, 'color: red');
        this.checkSessionConflict();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    // Prompt for username to simulate different users
    const username = prompt('Enter username (e.g., UserA, UserB):') || `User${Date.now()}`;
    const userId = `${username}-${Date.now()}`;
    const token = `token-${username}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`%c[${this.tabId}] Logging in as: ${username}`, 'color: blue; font-weight: bold');

    // Initialize session management with sessionStorage for tab isolation
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 300, // 5 minutes
      warningTimeoutInSeconds: 60, // 1 minute warning
      enableIdleTimeout: true,
      enableMultiTabTracking: true,
      enableDebugLogging: true,
      storageType: 'sessionStorage', // Use sessionStorage for tab-specific data
    });

    // Store current user in localStorage (shared across tabs) to detect conflicts
    localStorage.setItem('sm_current_user', userId);
    
    // Store tab-specific user in sessionStorage
    sessionStorage.setItem('sm_tab_user', userId);
    sessionStorage.setItem('sm_tab_id', this.tabId);

    // Start session
    this.sessionService.startSession(userId, token);
    this.isLoggedIn = true;
    this.conflictMessage = '';

    console.log(`%c[${this.tabId}] Session started for ${username}`, 'color: green; font-weight: bold');
  }

  logout(): void {
    console.log(`%c[${this.tabId}] Logging out`, 'color: red; font-weight: bold');
    this.sessionService.endSession('logout');
    this.isLoggedIn = false;
    this.conflictMessage = '';
    
    // Clear tab-specific storage
    sessionStorage.removeItem('sm_tab_user');
    sessionStorage.removeItem('sm_tab_id');
  }

  extendSession(): void {
    this.sessionService.extendSession();
  }

  private checkExistingSession(): void {
    const tabUser = sessionStorage.getItem('sm_tab_user');
    const currentUser = localStorage.getItem('sm_current_user');
    
    if (tabUser && currentUser) {
      console.log(`%c[${this.tabId}] Existing session found`, 'color: blue', {
        tabUser,
        currentUser
      });
      
      if (tabUser !== currentUser) {
        this.handleSessionConflict(tabUser, currentUser);
      }
    }
  }

  private checkSessionConflict(): void {
    const tabUser = sessionStorage.getItem('sm_tab_user');
    const currentUser = localStorage.getItem('sm_current_user');

    if (!tabUser || !currentUser) {
      return;
    }

    console.log(`%c[${this.tabId}] Checking session conflict:`, 'color: orange', {
      tabUser,
      currentUser,
      match: tabUser === currentUser
    });

    if (tabUser !== currentUser) {
      this.handleSessionConflict(tabUser, currentUser);
    }
  }

  private handleSessionConflict(tabUser: string, currentUser: string): void {
    console.error(`%c[${this.tabId}] SESSION CONFLICT DETECTED!`, 'color: red; font-weight: bold; font-size: 16px');
    console.error(`%c[${this.tabId}] Tab User: ${tabUser}`, 'color: red');
    console.error(`%c[${this.tabId}] Current User: ${currentUser}`, 'color: red');

    this.conflictMessage = `⚠️ Session Conflict: Another user (${currentUser}) has logged in. Your session (${tabUser}) has been terminated.`;
    
    // End the session
    this.sessionService.endSession('logout');
    this.isLoggedIn = false;

    // Clear tab-specific storage
    sessionStorage.removeItem('sm_tab_user');
    sessionStorage.removeItem('sm_tab_id');

    // Show alert
    alert(this.conflictMessage);
  }

  private updateSessionInfo(): void {
    this.sessionInfo = this.sessionService.getSessionState();
  }
}

// Made with Bob
