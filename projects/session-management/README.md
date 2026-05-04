# Angular Session Management Library

[![npm version](https://badge.fury.io/js/%40your-org%2Fsession-management.svg)](https://badge.fury.io/js/%40your-org%2Fsession-management)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive Angular library for managing user sessions with idle timeout detection, multi-tab synchronization, automatic keep-alive, and token refresh capabilities.

## 🚀 Features

- ✅ **Session Timeout Management** - Configurable session expiration with automatic logout
- ✅ **Idle Detection** - Monitor user activity and detect idle state
- ✅ **Multi-Tab Synchronization** - Sync session state across browser tabs
- ✅ **Keep-Alive Mechanism** - Automatic session extension with configurable intervals
- ✅ **Token Management** - Automatic token refresh and rotation
- ✅ **HTTP Interceptor** - Automatic token injection and session extension
- ✅ **Warning Dialog** - Customizable warning before session expires
- ✅ **Event System** - Observable-based events for session lifecycle
- ✅ **Flexible Storage** - Support for localStorage and sessionStorage
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Angular 21+ Compatible** - Built with latest Angular features

## 📦 Installation

```bash
npm install @your-org/session-management
```

## 🔧 Quick Start

### 1. Import the Module

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SessionManagementModule } from '@your-org/session-management';
import { sessionHttpInterceptor } from '@your-org/session-management';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([sessionHttpInterceptor])
    ),
    // Import the session management module
    importProvidersFrom(SessionManagementModule)
  ]
};
```

### 2. Initialize Session Service

```typescript
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Initialize with default configuration
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 1800,      // 30 minutes
      warningTimeoutInSeconds: 120,       // 2 minutes warning
      enableIdleTimeout: true,
      enableMultiTabTracking: true,
      logoutRoute: '/login'
    });
  }
}
```

### 3. Start a Session (After Login)

```typescript
import { SessionService } from '@your-org/session-management';

export class LoginComponent {
  constructor(private sessionService: SessionService) {}

  onLoginSuccess(response: any) {
    this.sessionService.startSession(
      response.userId,
      response.token,
      response.refreshToken
    );
  }
}
```

## 📖 Configuration

### SessionConfig Interface

```typescript
interface SessionConfig {
  // Timeout settings
  sessionTimeoutInSeconds?: number;              // Default: 1800 (30 min)
  warningTimeoutInSeconds?: number;              // Default: 120 (2 min)
  keepAliveIntervalInSeconds?: number;           // Default: 300 (5 min)
  
  // Feature toggles
  enableIdleTimeout?: boolean;                   // Default: true
  enableMultiTabTracking?: boolean;              // Default: true
  enableTokenRefresh?: boolean;                  // Default: false
  enableDebugLogging?: boolean;                  // Default: false
  
  // API endpoints
  sendKeepAliveApiUrl?: string;                  // Keep-alive endpoint
  onLogOffSessionApiUrl?: string;                // Logout endpoint
  postLogOffSessionApiUrl?: string;              // Post-logout endpoint
  
  // Token refresh
  tokenRefreshIntervalInSeconds?: number;        // Default: 600 (10 min)
  
  // Storage
  storageType?: 'localStorage' | 'sessionStorage'; // Default: 'localStorage'
  
  // Navigation
  logoutRoute?: string;                          // Default: '/logout'
}
```

### Example Configuration

```typescript
this.sessionService.initialize({
  // Session timeout: 30 minutes
  sessionTimeoutInSeconds: 1800,
  
  // Show warning 2 minutes before timeout
  warningTimeoutInSeconds: 120,
  
  // Send keep-alive every 5 minutes
  keepAliveIntervalInSeconds: 300,
  sendKeepAliveApiUrl: '/api/session/keep-alive',
  
  // Enable features
  enableIdleTimeout: true,
  enableMultiTabTracking: true,
  enableTokenRefresh: true,
  
  // Token refresh every 10 minutes
  tokenRefreshIntervalInSeconds: 600,
  
  // API endpoints
  onLogOffSessionApiUrl: '/api/auth/logout',
  postLogOffSessionApiUrl: '/api/auth/post-logout',
  
  // Redirect to login on logout
  logoutRoute: '/login',
  
  // Use localStorage for persistence
  storageType: 'localStorage',
  
  // Enable debug logging
  enableDebugLogging: true
});
```

## 🎯 Usage Examples

### Monitoring Session Events

```typescript
import { Component, OnInit } from '@angular/core';
import { SessionService, SessionEvent } from '@your-org/session-management';

@Component({
  selector: 'app-dashboard',
  template: `<div>Dashboard Content</div>`
})
export class DashboardComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Subscribe to session events
    this.sessionService.sessionEvent$.subscribe(event => {
      switch(event) {
        case SessionEvent.SESSION_STARTED:
          console.log('Session started');
          break;
        case SessionEvent.SESSION_EXTENDED:
          console.log('Session extended');
          break;
        case SessionEvent.SESSION_WARNING:
          console.log('Session about to expire');
          break;
        case SessionEvent.SESSION_EXPIRED:
          console.log('Session expired');
          break;
        case SessionEvent.USER_ACTIVITY:
          console.log('User activity detected');
          break;
      }
    });

    // Subscribe to session state changes
    this.sessionService.sessionState$.subscribe(state => {
      if (state) {
        console.log('Session valid:', state.isValidSession);
        console.log('Active tabs:', state.activeTabs);
      }
    });
  }
}
```

### Custom Warning Dialog

```typescript
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-session-warning',
  template: `
    <div *ngIf="showWarning" class="warning-dialog">
      <h3>Session Expiring Soon</h3>
      <p>Your session will expire in {{ timeRemaining }} seconds</p>
      <button (click)="extendSession()">Stay Logged In</button>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class SessionWarningComponent implements OnInit {
  showWarning = false;
  timeRemaining = 0;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Show/hide warning dialog
    this.sessionService.warningDialog$.subscribe(show => {
      this.showWarning = show;
    });

    // Update countdown
    this.sessionService.sessionEvent$.subscribe(event => {
      if (event === 'session-warning') {
        // Update time remaining logic here
      }
    });
  }

  extendSession() {
    this.sessionService.extendSession();
  }

  logout() {
    this.sessionService.endSession('logout');
  }
}
```

### Manual Session Control

```typescript
import { SessionService } from '@your-org/session-management';

export class MyComponent {
  constructor(private sessionService: SessionService) {}

  // Check if session is valid
  isLoggedIn(): boolean {
    return this.sessionService.isSessionValid();
  }

  // Get current session state
  getSessionInfo() {
    const state = this.sessionService.getSessionState();
    console.log('User ID:', state?.userId);
    console.log('Token:', state?.token);
    console.log('Active tabs:', state?.activeTabs);
  }

  // Manually extend session
  keepSessionAlive() {
    this.sessionService.extendSession();
  }

  // Manually end session
  logout() {
    this.sessionService.endSession('logout');
  }

  // Update token after refresh
  updateAuthToken(newToken: string, newRefreshToken?: string) {
    this.sessionService.updateToken(newToken, newRefreshToken);
  }
}
```

### HTTP Interceptor Setup

The library includes an HTTP interceptor that automatically:
- Adds Bearer token to requests
- Extends session on successful API calls
- Handles 401/302 errors (session expired)

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { sessionHttpInterceptor } from '@your-org/session-management';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([sessionHttpInterceptor])
    )
  ]
};
```

### Route Guards

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@your-org/session-management';

export const authGuard = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.isSessionValid()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Use in routes
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  }
];
```

## 🔌 API Reference

### SessionService

#### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `initialize()` | `config?: Partial<SessionConfig>` | `void` | Initialize session management |
| `startSession()` | `userId?: string, token?: string, refreshToken?: string` | `void` | Start a new session |
| `endSession()` | `reason?: 'logout' \| 'timeout' \| 'expired'` | `void` | End current session |
| `extendSession()` | - | `void` | Extend session and reset idle timer |
| `isSessionValid()` | - | `boolean` | Check if session is valid |
| `getSessionState()` | - | `SessionState \| null` | Get current session state |
| `getConfig()` | - | `SessionConfig` | Get session configuration |
| `updateToken()` | `token: string, refreshToken?: string` | `void` | Update authentication token |

#### Observables

| Observable | Type | Description |
|-----------|------|-------------|
| `sessionState$` | `Observable<SessionState \| null>` | Emits session state changes |
| `sessionEvent$` | `Observable<SessionEvent>` | Emits session lifecycle events |
| `warningDialog$` | `Observable<boolean>` | Emits warning dialog visibility |

### IdleTimeoutService

#### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `startWatching()` | `idleTimeInSeconds: number, warningTimeInSeconds?: number` | `void` | Start idle detection |
| `stopWatching()` | - | `void` | Stop idle detection |
| `resetTimer()` | - | `void` | Reset idle timer |
| `getTimeRemaining()` | - | `number` | Get seconds until timeout |
| `isIdle()` | - | `boolean` | Check if user is idle |

#### Observables

| Observable | Type | Description |
|-----------|------|-------------|
| `idleTimeout$` | `Observable<void>` | Emits when idle timeout occurs |
| `userActivity$` | `Observable<void>` | Emits on user activity |
| `warning$` | `Observable<number>` | Emits time remaining during warning |

### SessionStorageService

#### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `setStorageType()` | `type: 'localStorage' \| 'sessionStorage'` | `void` | Set storage type |
| `saveSessionState()` | `state: SessionState` | `void` | Save session state |
| `getSessionState()` | - | `SessionState \| null` | Get session state |
| `clearSessionData()` | - | `void` | Clear all session data |
| `incrementActiveTabs()` | - | `number` | Increment and return tab count |
| `decrementActiveTabs()` | - | `number` | Decrement and return tab count |

## 📊 Session Events

The library emits the following events through `sessionEvent$`:

| Event | Description |
|-------|-------------|
| `SESSION_STARTED` | Session has been started |
| `SESSION_EXTENDED` | Session has been extended |
| `SESSION_WARNING` | Warning shown before expiration |
| `SESSION_EXPIRED` | Session has expired |
| `SESSION_TERMINATED` | Session manually terminated |
| `USER_ACTIVITY` | User activity detected |
| `KEEP_ALIVE_SENT` | Keep-alive ping sent |
| `TOKEN_REFRESHED` | Token has been refreshed |
| `MULTI_TAB_DETECTED` | Multiple tabs detected |

## 🎨 Customization

### Custom Warning Component

You can create your own warning dialog component:

```typescript
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';
import { IdleTimeoutService } from '@your-org/session-management';

@Component({
  selector: 'app-custom-warning',
  template: `
    <div class="modal" *ngIf="showWarning">
      <div class="modal-content">
        <h2>⚠️ Session Expiring</h2>
        <p>Your session will expire in:</p>
        <div class="countdown">{{ formatTime(timeRemaining) }}</div>
        <div class="actions">
          <button (click)="extend()" class="btn-primary">
            Continue Session
          </button>
          <button (click)="logout()" class="btn-secondary">
            Logout Now
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .countdown {
      font-size: 48px;
      font-weight: bold;
      color: #ff6b6b;
      margin: 20px 0;
    }
  `]
})
export class CustomWarningComponent implements OnInit {
  showWarning = false;
  timeRemaining = 0;

  constructor(
    private sessionService: SessionService,
    private idleService: IdleTimeoutService
  ) {}

  ngOnInit() {
    this.sessionService.warningDialog$.subscribe(show => {
      this.showWarning = show;
    });

    this.idleService.warning$.subscribe(seconds => {
      this.timeRemaining = seconds;
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  extend() {
    this.sessionService.extendSession();
  }

  logout() {
    this.sessionService.endSession('logout');
  }
}
```

## 🔒 Security Considerations

1. **Token Storage**: Tokens are stored in browser storage. Consider using secure, httpOnly cookies for production.
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit.
3. **Token Refresh**: Implement proper token refresh logic on your backend.
4. **XSS Protection**: Sanitize user inputs to prevent XSS attacks.
5. **CSRF Protection**: Implement CSRF tokens for state-changing operations.

## 🧪 Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { SessionService } from '@your-org/session-management';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
  });

  it('should create session', () => {
    service.startSession('user123', 'token123');
    expect(service.isSessionValid()).toBe(true);
  });

  it('should end session', () => {
    service.startSession('user123', 'token123');
    service.endSession('logout');
    expect(service.isSessionValid()).toBe(false);
  });
});
```

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

**Note**: Multi-tab synchronization requires BroadcastChannel API support.

## 📝 Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for version history and release notes.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@your-org.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/session-management/issues)
- 📖 Documentation: [Full Documentation](https://github.com/your-org/session-management)

## 🙏 Acknowledgments

Built with ❤️ using Angular and RxJS.

---

**Made with Bob** 🤖
