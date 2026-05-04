# Angular Session Management - Usage Examples

This document provides comprehensive examples for using the Angular Session Management library in various scenarios.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Authentication Integration](#authentication-integration)
3. [Custom Warning Dialogs](#custom-warning-dialogs)
4. [Multi-Tab Scenarios](#multi-tab-scenarios)
5. [Advanced Configuration](#advanced-configuration)
6. [Route Guards](#route-guards)
7. [Testing Examples](#testing-examples)
8. [Real-World Scenarios](#real-world-scenarios)

---

## Basic Setup

### Minimal Configuration

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SessionManagementModule, sessionHttpInterceptor } from '@your-org/session-management';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([sessionHttpInterceptor])),
    importProvidersFrom(SessionManagementModule)
  ]
};
```

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.initialize();
  }
}
```

---

## Authentication Integration

### Login Component with Session Start

```typescript
// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <input [(ngModel)]="username" name="username" placeholder="Username" required>
        <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private router: Router
  ) {}

  onSubmit() {
    this.http.post<any>('/api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        // Start session with user data and tokens
        this.sessionService.startSession(
          response.userId,
          response.accessToken,
          response.refreshToken
        );
        
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}
```

### Logout Component

```typescript
// logout.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-logout',
  template: `
    <div class="logout-container">
      <h2>Logging out...</h2>
      <p>Please wait while we securely log you out.</p>
    </div>
  `
})
export class LogoutComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // End session and redirect to login
    this.sessionService.endSession('logout');
  }
}
```

---

## Custom Warning Dialogs

### Material Design Warning Dialog

```typescript
// session-warning-dialog.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService, IdleTimeoutService } from '@your-org/session-management';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-session-warning-dialog',
  template: `
    <h2 mat-dialog-title>Session Expiring</h2>
    <mat-dialog-content>
      <div class="warning-icon">⚠️</div>
      <p>Your session will expire in:</p>
      <div class="countdown">
        <span class="time">{{ formatTime(timeRemaining) }}</span>
      </div>
      <p>Would you like to continue your session?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="logout()">Logout</button>
      <button mat-raised-button color="primary" (click)="extendSession()">
        Continue Session
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .warning-icon {
      font-size: 48px;
      text-align: center;
      margin: 20px 0;
    }
    .countdown {
      text-align: center;
      margin: 20px 0;
    }
    .time {
      font-size: 36px;
      font-weight: bold;
      color: #f44336;
      font-family: monospace;
    }
  `]
})
export class SessionWarningDialogComponent implements OnInit, OnDestroy {
  timeRemaining = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<SessionWarningDialogComponent>,
    private sessionService: SessionService,
    private idleService: IdleTimeoutService
  ) {}

  ngOnInit() {
    this.idleService.warning$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seconds => {
        this.timeRemaining = seconds;
        if (seconds === 0) {
          this.dialogRef.close();
        }
      });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  extendSession() {
    this.sessionService.extendSession();
    this.dialogRef.close();
  }

  logout() {
    this.sessionService.endSession('logout');
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Opening the Dialog

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '@your-org/session-management';
import { SessionWarningDialogComponent } from './session-warning-dialog.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  private dialogRef: any;

  constructor(
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 1800,
      warningTimeoutInSeconds: 120
    });

    // Open dialog when warning is triggered
    this.sessionService.warningDialog$.subscribe(show => {
      if (show && !this.dialogRef) {
        this.dialogRef = this.dialog.open(SessionWarningDialogComponent, {
          disableClose: true,
          width: '400px'
        });

        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
        });
      }
    });
  }
}
```

---

## Multi-Tab Scenarios

### Detecting Multiple Tabs

```typescript
// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <div class="session-info">
        <p>Active Tabs: {{ activeTabs }}</p>
        <p *ngIf="activeTabs > 1" class="warning">
          ⚠️ Multiple tabs detected. Logging out in one tab will log you out everywhere.
        </p>
      </div>
      <div class="content">
        <!-- Dashboard content -->
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  activeTabs = 0;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.sessionState$.subscribe(state => {
      if (state) {
        this.activeTabs = state.activeTabs;
      }
    });
  }
}
```

### Synchronized Logout Across Tabs

```typescript
// The library automatically handles this, but you can monitor it:
import { Component, OnInit } from '@angular/core';
import { SessionService, SessionEvent } from '@your-org/session-management';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sessionService.initialize({
      enableMultiTabTracking: true
    });

    // Listen for session termination from other tabs
    this.sessionService.sessionEvent$.subscribe(event => {
      if (event === SessionEvent.SESSION_TERMINATED) {
        console.log('Session ended in another tab');
        this.router.navigate(['/login']);
      }
    });
  }
}
```

---

## Advanced Configuration

### Enterprise Configuration

```typescript
// app.config.ts
import { SessionService } from '@your-org/session-management';

export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.initialize({
      // Session timeout: 2 hours
      sessionTimeoutInSeconds: 7200,
      
      // Warning: 5 minutes before expiry
      warningTimeoutInSeconds: 300,
      
      // Keep-alive: every 2 minutes
      keepAliveIntervalInSeconds: 120,
      sendKeepAliveApiUrl: '/api/session/keep-alive',
      
      // Token refresh: every 15 minutes
      enableTokenRefresh: true,
      tokenRefreshIntervalInSeconds: 900,
      
      // API endpoints
      onLogOffSessionApiUrl: '/api/auth/logout',
      postLogOffSessionApiUrl: '/api/audit/logout',
      
      // Multi-tab tracking
      enableMultiTabTracking: true,
      
      // Use sessionStorage for sensitive data
      storageType: 'sessionStorage',
      
      // Enable debug logging in development
      enableDebugLogging: !environment.production,
      
      // Custom logout route
      logoutRoute: '/auth/login'
    });
  }
}
```

### Dynamic Configuration from Backend

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    // Fetch configuration from backend
    this.http.get<any>('/api/config/session').subscribe(config => {
      this.sessionService.initialize({
        sessionTimeoutInSeconds: config.timeout,
        warningTimeoutInSeconds: config.warningTime,
        keepAliveIntervalInSeconds: config.keepAliveInterval,
        sendKeepAliveApiUrl: config.keepAliveUrl,
        enableIdleTimeout: config.enableIdleDetection,
        enableMultiTabTracking: config.enableMultiTab
      });
    });
  }
}
```

---

## Route Guards

### Authentication Guard

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '@your-org/session-management';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.isSessionValid()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  sessionStorage.setItem('redirectUrl', state.url);
  
  router.navigate(['/login']);
  return false;
};
```

### Role-Based Guard

```typescript
// role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '@your-org/session-management';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    const sessionState = sessionService.getSessionState();
    
    if (!sessionState?.isValidSession) {
      router.navigate(['/login']);
      return false;
    }

    // Assuming you store user role in session
    const userRole = sessionState.userId; // Adjust based on your implementation
    
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};

// Usage in routes
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard(['admin', 'superadmin'])]
  }
];
```

### Session Timeout Guard

```typescript
// session-timeout.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '@your-org/session-management';
import { IdleTimeoutService } from '@your-org/session-management';

export const sessionTimeoutGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const idleService = inject(IdleTimeoutService);
  const router = inject(Router);

  // Check if session is valid
  if (!sessionService.isSessionValid()) {
    router.navigate(['/login'], {
      queryParams: { reason: 'session-expired' }
    });
    return false;
  }

  // Check if user has been idle too long
  if (idleService.isIdle()) {
    sessionService.endSession('timeout');
    router.navigate(['/login'], {
      queryParams: { reason: 'idle-timeout' }
    });
    return false;
  }

  return true;
};
```

---

## Testing Examples

### Unit Testing SessionService

```typescript
// session.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService, SessionEvent } from '@your-org/session-management';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start a session', (done) => {
    service.sessionState$.subscribe(state => {
      if (state) {
        expect(state.isValidSession).toBe(true);
        expect(state.userId).toBe('user123');
        done();
      }
    });

    service.startSession('user123', 'token123', 'refresh123');
  });

  it('should end a session', () => {
    service.startSession('user123', 'token123');
    service.endSession('logout');
    expect(service.isSessionValid()).toBe(false);
  });

  it('should emit session events', (done) => {
    service.sessionEvent$.subscribe(event => {
      if (event === SessionEvent.SESSION_STARTED) {
        expect(event).toBe(SessionEvent.SESSION_STARTED);
        done();
      }
    });

    service.initialize();
    service.startSession('user123', 'token123');
  });

  it('should extend session', () => {
    service.startSession('user123', 'token123');
    const initialTime = service.getSessionState()?.lastActivityTime;
    
    setTimeout(() => {
      service.extendSession();
      const newTime = service.getSessionState()?.lastActivityTime;
      expect(newTime).toBeGreaterThan(initialTime!);
    }, 100);
  });
});
```

### Integration Testing with Components

```typescript
// login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { SessionService } from '@your-org/session-management';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SessionService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
  });

  it('should start session on successful login', () => {
    spyOn(sessionService, 'startSession');
    
    component.username = 'testuser';
    component.password = 'password123';
    component.onSubmit();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    
    req.flush({
      userId: 'user123',
      accessToken: 'token123',
      refreshToken: 'refresh123'
    });

    expect(sessionService.startSession).toHaveBeenCalledWith(
      'user123',
      'token123',
      'refresh123'
    );
  });
});
```

---

## Real-World Scenarios

### E-Commerce Application

```typescript
// shopping-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService, SessionEvent } from '@your-org/session-management';

@Component({
  selector: 'app-shopping-cart',
  template: `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <div *ngIf="sessionWarning" class="session-warning">
        ⚠️ Your session is about to expire. Complete your purchase soon!
      </div>
      <!-- Cart items -->
    </div>
  `
})
export class ShoppingCartComponent implements OnInit {
  sessionWarning = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Initialize with longer timeout for shopping
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 3600, // 1 hour
      warningTimeoutInSeconds: 300,  // 5 minutes warning
      enableIdleTimeout: true
    });

    // Show warning in cart
    this.sessionService.sessionEvent$.subscribe(event => {
      if (event === SessionEvent.SESSION_WARNING) {
        this.sessionWarning = true;
      } else if (event === SessionEvent.SESSION_EXTENDED) {
        this.sessionWarning = false;
      }
    });
  }

  onCheckout() {
    // Extend session during checkout
    this.sessionService.extendSession();
    // Proceed with checkout
  }
}
```

### Banking Application

```typescript
// banking-app.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@your-org/session-management';

@Component({
  selector: 'app-banking',
  template: `
    <div class="banking-app">
      <div class="security-info">
        <p>Session expires in: {{ timeRemaining }} minutes</p>
        <button (click)="extendSession()">Extend Session</button>
      </div>
      <!-- Banking content -->
    </div>
  `
})
export class BankingAppComponent implements OnInit {
  timeRemaining = 0;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Strict security settings
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 600,  // 10 minutes
      warningTimeoutInSeconds: 60,   // 1 minute warning
      enableIdleTimeout: true,
      enableMultiTabTracking: true,
      storageType: 'sessionStorage',  // More secure
      sendKeepAliveApiUrl: '/api/banking/keep-alive',
      keepAliveIntervalInSeconds: 120
    });

    // Update time remaining display
    setInterval(() => {
      const state = this.sessionService.getSessionState();
      if (state) {
        const elapsed = (Date.now() - state.lastActivityTime) / 1000;
        this.timeRemaining = Math.max(0, Math.floor((600 - elapsed) / 60));
      }
    }, 1000);
  }

  extendSession() {
    this.sessionService.extendSession();
  }
}
```

### Admin Dashboard with Activity Monitoring

```typescript
// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService, SessionEvent } from '@your-org/session-management';

interface ActivityLog {
  timestamp: Date;
  event: string;
  details: string;
}

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-dashboard">
      <div class="session-monitor">
        <h3>Session Activity</h3>
        <div *ngFor="let log of activityLogs" class="log-entry">
          <span class="timestamp">{{ log.timestamp | date:'short' }}</span>
          <span class="event">{{ log.event }}</span>
          <span class="details">{{ log.details }}</span>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activityLogs: ActivityLog[] = [];

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 7200,
      enableDebugLogging: true
    });

    // Log all session events
    this.sessionService.sessionEvent$.subscribe(event => {
      this.logActivity(event, this.getEventDetails(event));
    });

    // Monitor session state changes
    this.sessionService.sessionState$.subscribe(state => {
      if (state) {
        this.logActivity('STATE_CHANGE', `Active tabs: ${state.activeTabs}`);
      }
    });
  }

  private logActivity(event: string, details: string) {
    this.activityLogs.unshift({
      timestamp: new Date(),
      event,
      details
    });

    // Keep only last 50 logs
    if (this.activityLogs.length > 50) {
      this.activityLogs.pop();
    }
  }

  private getEventDetails(event: SessionEvent): string {
    const details: Record<SessionEvent, string> = {
      [SessionEvent.SESSION_STARTED]: 'New session initiated',
      [SessionEvent.SESSION_EXTENDED]: 'Session extended by user activity',
      [SessionEvent.SESSION_WARNING]: 'Warning shown to user',
      [SessionEvent.SESSION_EXPIRED]: 'Session expired due to inactivity',
      [SessionEvent.SESSION_TERMINATED]: 'Session manually terminated',
      [SessionEvent.USER_ACTIVITY]: 'User activity detected',
      [SessionEvent.KEEP_ALIVE_SENT]: 'Keep-alive ping sent to server',
      [SessionEvent.TOKEN_REFRESHED]: 'Authentication token refreshed',
      [SessionEvent.MULTI_TAB_DETECTED]: 'Multiple tabs detected'
    };
    return details[event] || 'Unknown event';
  }
}
```

---

## Best Practices

1. **Always initialize early**: Call `initialize()` in your root component's `ngOnInit()`
2. **Handle session events**: Subscribe to `sessionEvent$` to respond to session changes
3. **Use route guards**: Protect routes with authentication guards
4. **Customize timeouts**: Adjust timeouts based on your application's security requirements
5. **Test thoroughly**: Write unit and integration tests for session management
6. **Monitor in production**: Use debug logging in development, disable in production
7. **Secure tokens**: Consider using httpOnly cookies for production environments
8. **Handle errors gracefully**: Implement proper error handling for API calls

---

**Made with Bob** 🤖