# Angular Session Management - API Documentation

Complete API reference for the Angular Session Management library.

## Table of Contents

1. [Services](#services)
   - [SessionService](#sessionservice)
   - [IdleTimeoutService](#idletimeoutservice)
   - [SessionStorageService](#sessionstorageservice)
2. [Interceptors](#interceptors)
   - [SessionHttpInterceptor](#sessionhttpinterceptor)
3. [Models](#models)
   - [SessionConfig](#sessionconfig)
   - [SessionState](#sessionstate)
   - [SessionEvent](#sessionevent)
   - [BroadcastMessage](#broadcastmessage)
4. [Components](#components)
   - [SessionWarningDialogComponent](#sessionwarningdialogcomponent)

---

## Services

### SessionService

Main service for managing user sessions.

#### Constructor

```typescript
constructor(
  private http: HttpClient,
  private router: Router,
  private storageService: SessionStorageService,
  private idleTimeoutService: IdleTimeoutService,
  @Optional() @Inject('SESSION_CONFIG') private injectedConfig?: SessionConfig
)
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `sessionState$` | `Observable<SessionState \| null>` | Observable that emits session state changes |
| `sessionEvent$` | `Observable<SessionEvent>` | Observable that emits session lifecycle events |
| `warningDialog$` | `Observable<boolean>` | Observable that emits warning dialog visibility state |

#### Methods

##### initialize()

Initialize session management with configuration.

```typescript
initialize(config?: Partial<SessionConfig>): void
```

**Parameters:**
- `config` (optional): Partial session configuration to override defaults

**Example:**
```typescript
sessionService.initialize({
  sessionTimeoutInSeconds: 1800,
  warningTimeoutInSeconds: 120,
  enableIdleTimeout: true
});
```

---

##### startSession()

Start a new user session.

```typescript
startSession(userId?: string, token?: string, refreshToken?: string): void
```

**Parameters:**
- `userId` (optional): User identifier
- `token` (optional): Authentication token
- `refreshToken` (optional): Refresh token for token renewal

**Example:**
```typescript
sessionService.startSession('user123', 'eyJhbGc...', 'refresh_token');
```

**Emits:**
- `SessionEvent.SESSION_STARTED`

---

##### endSession()

End the current session and perform cleanup.

```typescript
endSession(reason?: 'logout' | 'timeout' | 'expired'): void
```

**Parameters:**
- `reason` (optional): Reason for ending session. Default: `'logout'`
  - `'logout'`: User manually logged out
  - `'timeout'`: Session timed out due to inactivity
  - `'expired'`: Session expired (token expired)

**Example:**
```typescript
sessionService.endSession('logout');
```

**Emits:**
- `SessionEvent.SESSION_TERMINATED` (for logout)
- `SessionEvent.SESSION_EXPIRED` (for timeout/expired)

**Side Effects:**
- Calls logout API if configured
- Broadcasts sign-off to other tabs
- Clears session storage
- Navigates to logout route
- Calls post-logout API if configured

---

##### extendSession()

Extend the current session and reset idle timer.

```typescript
extendSession(): void
```

**Example:**
```typescript
sessionService.extendSession();
```

**Emits:**
- `SessionEvent.SESSION_EXTENDED`

**Side Effects:**
- Updates last activity time
- Resets idle timer
- Hides warning dialog

---

##### isSessionValid()

Check if the current session is valid.

```typescript
isSessionValid(): boolean
```

**Returns:**
- `boolean`: `true` if session is valid, `false` otherwise

**Example:**
```typescript
if (sessionService.isSessionValid()) {
  // Session is active
}
```

---

##### getSessionState()

Get the current session state.

```typescript
getSessionState(): SessionState | null
```

**Returns:**
- `SessionState | null`: Current session state or null if no session

**Example:**
```typescript
const state = sessionService.getSessionState();
console.log('User ID:', state?.userId);
console.log('Active tabs:', state?.activeTabs);
```

---

##### getConfig()

Get the current session configuration.

```typescript
getConfig(): SessionConfig
```

**Returns:**
- `SessionConfig`: Current session configuration

**Example:**
```typescript
const config = sessionService.getConfig();
console.log('Timeout:', config.sessionTimeoutInSeconds);
```

---

##### updateToken()

Update the authentication token.

```typescript
updateToken(token: string, refreshToken?: string): void
```

**Parameters:**
- `token`: New authentication token
- `refreshToken` (optional): New refresh token

**Example:**
```typescript
sessionService.updateToken('new_token', 'new_refresh_token');
```

**Side Effects:**
- Updates token in session state
- Saves to storage
- Emits state change

---

### IdleTimeoutService

Service for detecting user idle time and activity.

#### Constructor

```typescript
constructor(private ngZone: NgZone)
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `idleTimeout$` | `Observable<void>` | Emits when idle timeout occurs |
| `userActivity$` | `Observable<void>` | Emits when user activity is detected |
| `warning$` | `Observable<number>` | Emits time remaining (in seconds) during warning period |

#### Methods

##### startWatching()

Start monitoring user activity and idle time.

```typescript
startWatching(idleTimeInSeconds: number, warningTimeInSeconds?: number): void
```

**Parameters:**
- `idleTimeInSeconds`: Time in seconds before considering user idle
- `warningTimeInSeconds` (optional): Time in seconds before timeout to show warning. Default: `120`

**Example:**
```typescript
idleTimeoutService.startWatching(1800, 120); // 30 min timeout, 2 min warning
```

**Monitored Events:**
- `mousedown`
- `mousemove`
- `keydown`
- `scroll`
- `touchstart`
- `click`
- `wheel`

---

##### stopWatching()

Stop monitoring user activity.

```typescript
stopWatching(): void
```

**Example:**
```typescript
idleTimeoutService.stopWatching();
```

---

##### resetTimer()

Reset the idle timer (called on user activity).

```typescript
resetTimer(): void
```

**Example:**
```typescript
idleTimeoutService.resetTimer();
```

**Emits:**
- `userActivity$`

---

##### getTimeRemaining()

Get time remaining until idle timeout.

```typescript
getTimeRemaining(): number
```

**Returns:**
- `number`: Seconds remaining until timeout

**Example:**
```typescript
const remaining = idleTimeoutService.getTimeRemaining();
console.log(`${remaining} seconds until timeout`);
```

---

##### getLastActivityTime()

Get timestamp of last user activity.

```typescript
getLastActivityTime(): number
```

**Returns:**
- `number`: Timestamp (milliseconds since epoch)

**Example:**
```typescript
const lastActivity = idleTimeoutService.getLastActivityTime();
const elapsed = Date.now() - lastActivity;
```

---

##### isIdle()

Check if user is currently idle.

```typescript
isIdle(): boolean
```

**Returns:**
- `boolean`: `true` if user is idle, `false` otherwise

**Example:**
```typescript
if (idleTimeoutService.isIdle()) {
  console.log('User is idle');
}
```

---

### SessionStorageService

Service for managing session data in browser storage.

#### Methods

##### setStorageType()

Set the storage type to use.

```typescript
setStorageType(type: 'localStorage' | 'sessionStorage'): void
```

**Parameters:**
- `type`: Storage type to use

**Example:**
```typescript
storageService.setStorageType('sessionStorage');
```

---

##### saveSessionState()

Save session state to storage.

```typescript
saveSessionState(state: SessionState): void
```

**Parameters:**
- `state`: Session state to save

**Example:**
```typescript
storageService.saveSessionState({
  isValidSession: true,
  activeTabs: 1,
  othersSession: 0,
  lastActivityTime: Date.now(),
  sessionStartTime: Date.now(),
  isWarningShown: false,
  userId: 'user123'
});
```

---

##### getSessionState()

Retrieve session state from storage.

```typescript
getSessionState(): SessionState | null
```

**Returns:**
- `SessionState | null`: Stored session state or null

**Example:**
```typescript
const state = storageService.getSessionState();
```

---

##### saveSessionConfig()

Save session configuration to storage.

```typescript
saveSessionConfig(config: SessionConfig): void
```

**Parameters:**
- `config`: Configuration to save

---

##### getSessionConfig()

Retrieve session configuration from storage.

```typescript
getSessionConfig(): SessionConfig | null
```

**Returns:**
- `SessionConfig | null`: Stored configuration or null

---

##### clearSessionData()

Clear all session data from storage.

```typescript
clearSessionData(): void
```

**Example:**
```typescript
storageService.clearSessionData();
```

---

##### incrementActiveTabs()

Increment and return the active tabs count.

```typescript
incrementActiveTabs(): number
```

**Returns:**
- `number`: New active tabs count

**Example:**
```typescript
const tabCount = storageService.incrementActiveTabs();
```

---

##### decrementActiveTabs()

Decrement and return the active tabs count.

```typescript
decrementActiveTabs(): number
```

**Returns:**
- `number`: New active tabs count

**Example:**
```typescript
const tabCount = storageService.decrementActiveTabs();
```

---

##### updateLastActivity()

Update the last activity timestamp.

```typescript
updateLastActivity(): void
```

**Example:**
```typescript
storageService.updateLastActivity();
```

---

## Interceptors

### SessionHttpInterceptor

HTTP interceptor for session management.

#### Features

- Automatically adds Bearer token to HTTP requests
- Extends session on successful API calls
- Handles 401/302 responses (session expired)
- Triggers logout on authentication failures

#### Usage

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

#### Behavior

**Request Phase:**
- Checks if session is valid
- Adds `Authorization: Bearer <token>` header if token exists

**Response Phase:**
- On success: Extends session automatically
- On 401/302 error: Ends session with reason 'expired'

---

## Models

### SessionConfig

Configuration interface for session management.

```typescript
interface SessionConfig {
  sessionTimeoutInSeconds?: number;
  warningTimeoutInSeconds?: number;
  keepAliveIntervalInSeconds?: number;
  timeoutForOtherSessionInvalidationInSeconds?: number;
  enableIdleTimeout?: boolean;
  enableMultiTabTracking?: boolean;
  getConfigApiUrl?: string;
  sendKeepAliveApiUrl?: string;
  onLogOffSessionApiUrl?: string;
  postLogOffSessionApiUrl?: string;
  logoutRoute?: string;
  enableTokenRefresh?: boolean;
  tokenRefreshIntervalInSeconds?: number;
  storageType?: 'localStorage' | 'sessionStorage';
  enableDebugLogging?: boolean;
}
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sessionTimeoutInSeconds` | `number` | `1800` | Session timeout in seconds (30 minutes) |
| `warningTimeoutInSeconds` | `number` | `120` | Warning time before timeout (2 minutes) |
| `keepAliveIntervalInSeconds` | `number` | `300` | Keep-alive ping interval (5 minutes) |
| `timeoutForOtherSessionInvalidationInSeconds` | `number` | `0` | Timeout for other session invalidation |
| `enableIdleTimeout` | `boolean` | `true` | Enable idle timeout detection |
| `enableMultiTabTracking` | `boolean` | `true` | Enable multi-tab session tracking |
| `getConfigApiUrl` | `string` | `undefined` | API endpoint to fetch configuration |
| `sendKeepAliveApiUrl` | `string` | `undefined` | API endpoint for keep-alive pings |
| `onLogOffSessionApiUrl` | `string` | `undefined` | API endpoint called on logout |
| `postLogOffSessionApiUrl` | `string` | `undefined` | API endpoint called after logout |
| `logoutRoute` | `string` | `'/logout'` | Route to navigate to on logout |
| `enableTokenRefresh` | `boolean` | `false` | Enable automatic token refresh |
| `tokenRefreshIntervalInSeconds` | `number` | `600` | Token refresh interval (10 minutes) |
| `storageType` | `'localStorage' \| 'sessionStorage'` | `'localStorage'` | Storage type for session data |
| `enableDebugLogging` | `boolean` | `false` | Enable debug console logging |

---

### SessionState

Interface representing the current session state.

```typescript
interface SessionState {
  isValidSession: boolean;
  activeTabs: number;
  othersSession: number;
  lastActivityTime: number;
  sessionStartTime: number;
  isWarningShown: boolean;
  userId?: string;
  token?: string;
  refreshToken?: string;
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isValidSession` | `boolean` | Whether the session is currently valid |
| `activeTabs` | `number` | Number of active browser tabs |
| `othersSession` | `number` | Number of other sessions |
| `lastActivityTime` | `number` | Timestamp of last user activity (ms) |
| `sessionStartTime` | `number` | Timestamp when session started (ms) |
| `isWarningShown` | `boolean` | Whether warning dialog is currently shown |
| `userId` | `string` | User identifier (optional) |
| `token` | `string` | Authentication token (optional) |
| `refreshToken` | `string` | Refresh token (optional) |

---

### SessionEvent

Enum of session lifecycle events.

```typescript
enum SessionEvent {
  SESSION_STARTED = 'session-started',
  SESSION_EXTENDED = 'session-extended',
  SESSION_WARNING = 'session-warning',
  SESSION_EXPIRED = 'session-expired',
  SESSION_TERMINATED = 'session-terminated',
  USER_ACTIVITY = 'user-activity',
  KEEP_ALIVE_SENT = 'keep-alive-sent',
  TOKEN_REFRESHED = 'token-refreshed',
  MULTI_TAB_DETECTED = 'multi-tab-detected'
}
```

#### Events

| Event | Description | When Emitted |
|-------|-------------|--------------|
| `SESSION_STARTED` | Session has been started | After `startSession()` is called |
| `SESSION_EXTENDED` | Session has been extended | After `extendSession()` or user activity |
| `SESSION_WARNING` | Warning shown before expiration | When warning timeout is reached |
| `SESSION_EXPIRED` | Session has expired | When session times out or token expires |
| `SESSION_TERMINATED` | Session manually terminated | When user logs out |
| `USER_ACTIVITY` | User activity detected | When user interacts with the page |
| `KEEP_ALIVE_SENT` | Keep-alive ping sent | When keep-alive request is sent |
| `TOKEN_REFRESHED` | Token has been refreshed | After successful token refresh |
| `MULTI_TAB_DETECTED` | Multiple tabs detected | When another tab is opened |

---

### BroadcastMessage

Interface for messages sent between tabs.

```typescript
interface BroadcastMessage {
  type: BroadcastMessageType;
  payload?: any;
  timestamp: number;
  tabId: string;
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `BroadcastMessageType` | Type of broadcast message |
| `payload` | `any` | Optional message payload |
| `timestamp` | `number` | Message timestamp (ms) |
| `tabId` | `string` | Unique identifier of sending tab |

#### BroadcastMessageType Enum

```typescript
enum BroadcastMessageType {
  SESSION_TIMER = 'session-timer',
  DIALOG_TIMER = 'dialog-timer',
  SESSION_STATUS = 'session-status',
  SIGN_OFF = 'sign-off',
  FOCUS = 'focus',
  BEFORE_UNLOAD = 'beforeunload',
  PAGE_HIDE = 'pagehide'
}
```

---

## Components

### SessionWarningDialogComponent

Built-in component for displaying session timeout warnings.

#### Usage

```typescript
import { SessionWarningDialogComponent } from '@your-org/session-management';

// The component is automatically shown when warning is triggered
// You can also create your own custom warning component
```

#### Inputs

None (uses SessionService internally)

#### Outputs

None (uses SessionService methods)

#### Methods

| Method | Description |
|--------|-------------|
| `extendSession()` | Extends the session when user clicks "Continue" |
| `logout()` | Logs out when user clicks "Logout" |

---

## Type Definitions

### SessionStorageKey

Enum for storage keys used by the library.

```typescript
enum SessionStorageKey {
  SESSION_STATE = 'sm_session_state',
  SESSION_CONFIG = 'sm_session_config',
  ACTIVE_TABS = 'sm_active_tabs',
  LAST_ACTIVITY = 'sm_last_activity',
  SESSION_TIMER = 'sm_session_timer',
  DIALOG_TIMER = 'sm_dialog_timer'
}
```

---

## Error Handling

### Common Errors

#### Session Not Initialized

```typescript
// Error: Session service not initialized
// Solution: Call initialize() before using other methods
sessionService.initialize();
```

#### Invalid Token

```typescript
// Error: 401 Unauthorized
// Solution: Token expired or invalid, session will auto-logout
// Handle in your login flow
```

#### Storage Not Available

```typescript
// Error: localStorage/sessionStorage not available
// Solution: Check browser settings, ensure storage is enabled
```

---

## Best Practices

### 1. Initialize Early

```typescript
// In app.component.ts ngOnInit()
this.sessionService.initialize(config);
```

### 2. Subscribe to Events

```typescript
// Monitor session lifecycle
this.sessionService.sessionEvent$.subscribe(event => {
  // Handle events
});
```

### 3. Use Type Guards

```typescript
const state = this.sessionService.getSessionState();
if (state?.isValidSession) {
  // Safe to use state
}
```

### 4. Handle Errors

```typescript
this.http.post('/api/data', data).subscribe({
  next: (response) => { /* success */ },
  error: (error) => {
    if (error.status === 401) {
      // Session expired, handled by interceptor
    }
  }
});
```

### 5. Clean Up Subscriptions

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.sessionService.sessionState$
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => { /* ... */ });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

## Version Compatibility

| Library Version | Angular Version | RxJS Version |
|----------------|-----------------|--------------|
| 1.0.0 | 21.2.0+ | 7.8.0+ |

---

## Migration Guide

### From Pre-release to 1.0.0

No breaking changes. This is the initial stable release.

---

**Made with Bob** 🤖

For more information, see:
- [Library README](projects/session-management/README.md)
- [Usage Examples](EXAMPLES.md)
- [Changelog](CHANGELOG.md)