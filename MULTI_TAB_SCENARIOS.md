# Multi-Tab Session Management Scenarios

Comprehensive guide for handling multiple users and sessions across browser tabs.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Scenario 1: Different Users in Different Tabs](#scenario-1-different-users-in-different-tabs)
3. [Scenario 2: Same User in Multiple Tabs](#scenario-2-same-user-in-multiple-tabs)
4. [Scenario 3: Session Conflict Detection](#scenario-3-session-conflict-detection)
5. [Implementation Guide](#implementation-guide)
6. [Configuration Options](#configuration-options)
7. [Testing Multi-Tab Scenarios](#testing-multi-tab-scenarios)

---

## Overview

The Angular Session Management library handles complex multi-tab scenarios where:
- Different users can be logged in different tabs
- Same user can have multiple tabs open
- Session conflicts are detected and resolved
- Cookie and storage synchronization is managed

---

## Scenario 1: Different Users in Different Tabs

### Real-World Scenario: User A logged in Tab 1, then User B logs into Tab 2

This scenario demonstrates what happens when two different users are logged into different tabs of the same browser.

### **T0: User A logs in (Tab 1)**

```
Tab 1 actions:
  • Authentication SUCCESS
  • Read cookie: uid = "user-a-token-xxx"
  • sessionStorage[Tab1] = { uid: "user-a-token-xxx" }
  • localStorage = { 
      isValidSession: true, 
      activeTabs: 1, 
      othersSession: [] 
    }

Tab 1 state now:
  ✓ Valid session for User A
  ✓ Timer running
  ✓ Active tabs: 1
```

### **T1: User B opens new tab and logs in (Tab 2)**

```
Tab 2 actions:
  • Authentication SUCCESS
  • Browser cookies updated: uid = "user-b-token-yyy" ← NEW COOKIE VALUE
  • sessionStorage[Tab2] = { uid: "user-b-token-yyy" }
  • localStorage = { 
      isValidSession: true, 
      activeTabs: 2, 
      othersSession: [] 
    }

Tab 2 state:
  ✓ Valid session for User B
  ✓ Timer running
  ✓ Active tabs: 2

BUT: Cookie at domain level is now "user-b-token-yyy"
     Tab 1 still has old stored UID "user-a-token-xxx" in sessionStorage
```

### **T2: You click back on Tab 1**

```
Tab 1:
  • window:focus event fires
  • Read sessionStorage[Tab1]: { uid: "user-a-token-xxx" }
  • Read current cookie: getSessionUid() returns "user-b-token-yyy"
  
  ❌ COMPARISON: "user-a-token-xxx" != "user-b-token-yyy"
  
ACTION:
  → Log: "different session. redirecting user to sign off"
  → Close any open dialog
  → Clear sessionStorage[Tab1]
  → Redirect to login page
  → Show message: "Another user has logged in. Please sign in again."
```

### Expected Behavior

| Tab | User | Session State | Action |
|-----|------|---------------|--------|
| Tab 1 | User A | ❌ Invalidated | Redirected to login |
| Tab 2 | User B | ✅ Active | Continues normally |

### Storage State After T2

```javascript
// Browser Cookie (domain level)
document.cookie = "uid=user-b-token-yyy"

// Tab 1 - sessionStorage (cleared)
sessionStorage = {}

// Tab 2 - sessionStorage (unchanged)
sessionStorage = { uid: "user-b-token-yyy" }

// localStorage (shared)
localStorage = {
  isValidSession: true,
  activeTabs: 1,  // Decremented when Tab 1 logged out
  currentUser: "user-b-token-yyy"
}
```

---

## Scenario 2: Same User in Multiple Tabs

### Real-World Scenario: User A opens multiple tabs

```
T0: User A logs in Tab 1
  • sessionStorage[Tab1] = { uid: "user-a-token-xxx" }
  • localStorage = { activeTabs: 1 }
  • Cookie: uid = "user-a-token-xxx"

T1: User A opens Tab 2 (same session)
  • sessionStorage[Tab2] = { uid: "user-a-token-xxx" }
  • localStorage = { activeTabs: 2 }
  • Cookie: uid = "user-a-token-xxx" (same)

T2: User A logs out from Tab 1
  • BroadcastChannel sends SIGN_OFF message
  • Tab 2 receives message
  • Both tabs clear session
  • Both tabs redirect to login
```

### Expected Behavior

| Event | Tab 1 | Tab 2 | Result |
|-------|-------|-------|--------|
| Login Tab 1 | ✅ Active | - | Single session |
| Open Tab 2 | ✅ Active | ✅ Active | Synced session |
| Logout Tab 1 | ❌ Logged out | ❌ Logged out | Both logout |

---

## Scenario 3: Session Conflict Detection

### Implementation in Code

```typescript
// session.service.ts
export class SessionService {
  
  private checkSessionConflict(): void {
    // Get stored session ID from sessionStorage (tab-specific)
    const storedSessionId = this.storageService.getTabSessionId();
    
    // Get current session ID from cookie (domain-level)
    const currentSessionId = this.getCookieSessionId();
    
    // Compare
    if (storedSessionId && currentSessionId && storedSessionId !== currentSessionId) {
      console.warn('Session conflict detected!');
      this.handleSessionConflict();
    }
  }
  
  private handleSessionConflict(): void {
    // Log the conflict
    this.log('Different session detected. Current user has been replaced.');
    
    // Clear current tab's session
    this.storageService.clearTabSession();
    
    // Close any open dialogs
    this.warningDialogSubject.next(false);
    
    // Emit conflict event
    this.emitEvent(SessionEvent.SESSION_CONFLICT);
    
    // Redirect to login with message
    this.router.navigate([this.config.logoutRoute], {
      queryParams: { 
        reason: 'session-conflict',
        message: 'Another user has logged in. Please sign in again.'
      }
    });
  }
  
  // Check on window focus
  private setupBrowserEventListeners(): void {
    window.addEventListener('focus', () => {
      this.checkSessionConflict();
    });
  }
}
```

---

## Implementation Guide

### Step 1: Configure Session Conflict Detection

```typescript
// app.config.ts
this.sessionService.initialize({
  enableMultiTabTracking: true,
  enableSessionConflictDetection: true,  // Enable conflict detection
  sessionConflictAction: 'logout',       // 'logout' | 'warn' | 'ignore'
  storageType: 'sessionStorage'          // Use sessionStorage for tab isolation
});
```

### Step 2: Handle Session Conflict Events

```typescript
// app.component.ts
export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService) {}
  
  ngOnInit() {
    // Listen for session conflicts
    this.sessionService.sessionEvent$.subscribe(event => {
      if (event === SessionEvent.SESSION_CONFLICT) {
        this.showConflictMessage();
      }
    });
  }
  
  private showConflictMessage() {
    // Show user-friendly message
    alert('Another user has logged in from this browser. You have been logged out.');
  }
}
```

### Step 3: Add Session Conflict to Models

```typescript
// session-state.model.ts
export enum SessionEvent {
  SESSION_STARTED = 'session-started',
  SESSION_EXTENDED = 'session-extended',
  SESSION_WARNING = 'session-warning',
  SESSION_EXPIRED = 'session-expired',
  SESSION_TERMINATED = 'session-terminated',
  SESSION_CONFLICT = 'session-conflict',  // NEW EVENT
  USER_ACTIVITY = 'user-activity',
  KEEP_ALIVE_SENT = 'keep-alive-sent',
  TOKEN_REFRESHED = 'token-refreshed',
  MULTI_TAB_DETECTED = 'multi-tab-detected'
}

export interface SessionConfig {
  // ... existing config
  enableSessionConflictDetection?: boolean;
  sessionConflictAction?: 'logout' | 'warn' | 'ignore';
}
```

---

## Configuration Options

### Multi-Tab Configuration

```typescript
interface MultiTabConfig {
  // Enable multi-tab tracking
  enableMultiTabTracking: boolean;
  
  // Enable session conflict detection
  enableSessionConflictDetection: boolean;
  
  // Action to take on conflict
  sessionConflictAction: 'logout' | 'warn' | 'ignore';
  
  // Storage type (sessionStorage for tab isolation)
  storageType: 'localStorage' | 'sessionStorage';
  
  // Check interval for conflicts (ms)
  conflictCheckInterval: number;
  
  // Allow multiple sessions per user
  allowMultipleSessionsPerUser: boolean;
}
```

### Example Configurations

#### Strict Mode (One User Per Browser)

```typescript
{
  enableMultiTabTracking: true,
  enableSessionConflictDetection: true,
  sessionConflictAction: 'logout',
  storageType: 'sessionStorage',
  allowMultipleSessionsPerUser: false
}
```

#### Permissive Mode (Multiple Users Allowed)

```typescript
{
  enableMultiTabTracking: true,
  enableSessionConflictDetection: false,
  sessionConflictAction: 'ignore',
  storageType: 'sessionStorage',
  allowMultipleSessionsPerUser: true
}
```

#### Warning Mode (Notify but Don't Logout)

```typescript
{
  enableMultiTabTracking: true,
  enableSessionConflictDetection: true,
  sessionConflictAction: 'warn',
  storageType: 'sessionStorage',
  allowMultipleSessionsPerUser: false
}
```

---

## Testing Multi-Tab Scenarios

### Test Case 1: Different Users

```typescript
describe('Multi-Tab: Different Users', () => {
  it('should logout User A when User B logs in', async () => {
    // Tab 1: Login as User A
    const tab1 = await openNewTab();
    await tab1.login('userA', 'passwordA');
    expect(tab1.isLoggedIn()).toBe(true);
    
    // Tab 2: Login as User B
    const tab2 = await openNewTab();
    await tab2.login('userB', 'passwordB');
    expect(tab2.isLoggedIn()).toBe(true);
    
    // Switch back to Tab 1
    await tab1.focus();
    
    // Tab 1 should be logged out
    expect(tab1.isLoggedIn()).toBe(false);
    expect(tab1.getCurrentUrl()).toContain('/login');
  });
});
```

### Test Case 2: Same User Multiple Tabs

```typescript
describe('Multi-Tab: Same User', () => {
  it('should sync logout across all tabs', async () => {
    // Tab 1: Login
    const tab1 = await openNewTab();
    await tab1.login('userA', 'passwordA');
    
    // Tab 2: Open (same session)
    const tab2 = await openNewTab();
    expect(tab2.isLoggedIn()).toBe(true);
    
    // Tab 1: Logout
    await tab1.logout();
    
    // Both tabs should be logged out
    expect(tab1.isLoggedIn()).toBe(false);
    expect(tab2.isLoggedIn()).toBe(false);
  });
});
```

### Manual Testing Steps

1. **Setup**
   ```bash
   npm run build
   npm start
   ```

2. **Test Different Users**
   - Open `http://localhost:4200/` in Tab 1
   - Login as User A (click "Login to Start Demo")
   - Open `http://localhost:4200/` in Tab 2
   - Login as User B (click "Login to Start Demo")
   - Switch back to Tab 1
   - **Expected**: Tab 1 shows login screen with conflict message

3. **Test Same User**
   - Open `http://localhost:4200/` in Tab 1
   - Login (click "Login to Start Demo")
   - Open `http://localhost:4200/` in Tab 2
   - Notice "Active Tabs: 2" in both tabs
   - Logout from Tab 1
   - **Expected**: Tab 2 also logs out automatically

4. **Test Session Storage**
   - Open DevTools (F12) in each tab
   - Application > Session Storage
   - Compare session IDs between tabs
   - Verify conflict detection works

---

## Storage Architecture

### sessionStorage (Tab-Specific)

```javascript
// Tab 1
sessionStorage = {
  sm_tab_id: "tab_1234567890_abc123",
  sm_user_id: "user-a-token-xxx",
  sm_tab_session: {
    userId: "user-a",
    token: "token-xxx",
    tabId: "tab_1234567890_abc123"
  }
}

// Tab 2
sessionStorage = {
  sm_tab_id: "tab_0987654321_xyz789",
  sm_user_id: "user-b-token-yyy",
  sm_tab_session: {
    userId: "user-b",
    token: "token-yyy",
    tabId: "tab_0987654321_xyz789"
  }
}
```

### localStorage (Shared Across Tabs)

```javascript
localStorage = {
  sm_session_state: {
    isValidSession: true,
    activeTabs: 2,
    lastActivityTime: 1234567890,
    sessionStartTime: 1234567890
  },
  sm_active_tabs: 2,
  sm_session_config: { /* config */ }
}
```

### Cookies (Domain-Level)

```javascript
document.cookie = "uid=user-b-token-yyy; path=/; secure; samesite=strict"
```

---

## Best Practices

### 1. Use sessionStorage for Tab Isolation

```typescript
storageType: 'sessionStorage'  // Isolates sessions per tab
```

### 2. Enable Conflict Detection

```typescript
enableSessionConflictDetection: true
```

### 3. Handle Conflict Events

```typescript
this.sessionService.sessionEvent$.subscribe(event => {
  if (event === SessionEvent.SESSION_CONFLICT) {
    // Show user-friendly message
    this.notificationService.show(
      'Another user has logged in',
      'You have been logged out for security reasons'
    );
  }
});
```

### 4. Check on Window Focus

```typescript
window.addEventListener('focus', () => {
  this.sessionService.checkSessionValidity();
});
```

### 5. Clear Tab Session on Logout

```typescript
logout() {
  // Clear tab-specific data
  sessionStorage.clear();
  
  // End session
  this.sessionService.endSession('logout');
}
```

---

## Security Considerations

1. **Cookie Security**: Use `secure` and `httpOnly` flags
2. **Session Validation**: Always validate on window focus
3. **Conflict Resolution**: Logout old sessions immediately
4. **User Notification**: Inform users about session conflicts
5. **Audit Logging**: Log all session conflicts for security monitoring

---

## Troubleshooting

### Issue: Tab 1 not detecting conflict

**Solution**: Ensure window focus event listener is set up
```typescript
window.addEventListener('focus', () => {
  this.checkSessionConflict();
});
```

### Issue: Both tabs logout when only one should

**Solution**: Use sessionStorage instead of localStorage
```typescript
storageType: 'sessionStorage'
```

### Issue: Conflict not detected immediately

**Solution**: Add periodic conflict check
```typescript
setInterval(() => {
  if (!document.hidden) {
    this.checkSessionConflict();
  }
}, 5000); // Check every 5 seconds
```

---

**Made with Bob** 🤖

For more information, see:
- [API Documentation](API.md)
- [Examples](EXAMPLES.md)
- [Troubleshooting](TROUBLESHOOTING.md)