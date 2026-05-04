# Running the Project Locally - No Backend Required! 🚀

This guide will help you run the Angular Session Management demo application locally **without any backend API**. The demo is completely self-contained and simulates all session management features.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.x or higher
- **npm**: Version 11.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Check Your Versions

```bash
node --version   # Should be v18.x or higher
npm --version    # Should be v11.x or higher
```

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/angular-session-workspace.git
cd angular-session-workspace

# Install all dependencies
npm install
```

This will install all required packages for both the library and demo app.

### Step 2: Build the Library

```bash
# Build the session management library
npm run build

# Or use the Angular CLI directly
ng build session-management
```

**Note**: You must build the library first before running the demo app, as the demo app imports from the library.

### Step 3: Start the Demo App

```bash
# Start the development server
npm start

# Or use Angular CLI
ng serve demo-app
```

The app will automatically open in your browser at `http://localhost:4200/`

## 🎯 What You'll See

### Login Screen

When you first open the app, you'll see:
- Welcome message
- List of features
- **"Login to Start Demo"** button

**Click the button** - No credentials needed! This simulates a login without any backend.

### Dashboard

After "logging in", you'll see:
- **Session Information Panel**: Shows real-time session data
  - User ID (auto-generated)
  - Session validity status
  - Active tabs count
  - Session start time
  - Last activity time
  - Warning status

- **Test Features Panel**: Instructions for testing each feature
  - Idle timeout detection
  - Multi-tab synchronization
  - Session extension
  - Browser storage inspection

- **Action Buttons**:
  - **Extend Session**: Manually reset the idle timer
  - **Logout**: End the session

## 🧪 Testing Features (No Backend Required)

### 1. Idle Timeout Detection

**How to Test:**
1. Click "Login to Start Demo"
2. Stop moving your mouse and don't touch the keyboard
3. Wait for 4 minutes (demo is configured for 5-minute timeout)
4. At 1 minute remaining, a warning dialog will appear
5. You can either:
   - Click "Continue Session" to extend
   - Click "Logout" to end session
   - Do nothing and session will expire

**What's Happening:**
- The library monitors mouse, keyboard, scroll, and touch events
- After 4 minutes of inactivity, warning appears
- After 5 minutes total, automatic logout occurs
- All without any backend API calls!

### 2. Multi-Tab Synchronization

**How to Test:**
1. Login in the first tab
2. Open the same URL in a new tab: `http://localhost:4200/`
3. Notice both tabs show "Active Tabs: 2"
4. Click "Logout" in one tab
5. Watch the other tab automatically logout too!

**What's Happening:**
- Uses BroadcastChannel API for cross-tab communication
- Session state is synchronized via localStorage
- No server communication needed

### 3. Session Extension

**How to Test:**
1. Login to the demo
2. Note the "Last Activity" timestamp
3. Click "Extend Session" button
4. Watch the "Last Activity" timestamp update
5. Or simply move your mouse - activity is auto-detected!

**What's Happening:**
- Manual extension via button click
- Automatic extension on user activity
- Idle timer resets
- All client-side, no API calls

### 4. Browser Storage Inspection

**How to Test:**
1. Login to the demo
2. Open Chrome DevTools (F12 or Right-click > Inspect)
3. Go to: **Application** tab > **Local Storage** > `http://localhost:4200`
4. You'll see keys like:
   - `sm_session_state` - Current session data
   - `sm_session_config` - Configuration
   - `sm_active_tabs` - Tab count
   - `sm_last_activity` - Last activity timestamp

**What's Happening:**
- All session data stored in browser
- No server-side session storage
- Persists across page refreshes

### 5. Console Logging

**How to Test:**
1. Open Chrome DevTools Console (F12)
2. Login to the demo
3. Watch real-time logs appear:
   ```
   [SessionService] Session management initialized
   [SessionService] Session started
   [SessionService] Session extended
   [SessionService] Warning dialog shown
   ```

**What's Happening:**
- Debug logging enabled in demo
- Shows all session events
- Helps understand library behavior

## 🔧 Configuration

The demo app is pre-configured with these settings (no backend needed):

```typescript
{
  sessionTimeoutInSeconds: 300,      // 5 minutes
  warningTimeoutInSeconds: 60,       // 1 minute warning
  enableIdleTimeout: true,           // Monitor user activity
  enableMultiTabTracking: true,      // Sync across tabs
  enableDebugLogging: true,          // Show console logs
  storageType: 'localStorage'        // Use localStorage
}
```

### Customizing Timeouts

Want to test with different timeouts? Edit `projects/demo-app/src/app/app.ts`:

```typescript
// For faster testing (30 seconds timeout, 10 seconds warning)
this.sessionService.initialize({
  sessionTimeoutInSeconds: 30,
  warningTimeoutInSeconds: 10,
  enableIdleTimeout: true,
  enableMultiTabTracking: true,
  enableDebugLogging: true,
});
```

Then restart the dev server:
```bash
# Stop the server (Ctrl+C)
# Start again
npm start
```

## ❓ FAQ

### Q: Do I need a backend server?

**A: No!** The demo is completely self-contained. It simulates:
- User login (generates fake user ID and token)
- Session management (all client-side)
- Token storage (in browser storage)
- Session events (all handled by the library)

### Q: Why do I need to build the library first?

**A:** The demo app imports the session management library as a dependency. Building the library creates the distributable files that the demo app needs.

### Q: Can I test the HTTP interceptor without a backend?

**A:** The interceptor is included but won't make actual API calls in the demo. To test it:
1. The interceptor automatically adds tokens to requests
2. It extends session on successful responses
3. It handles 401/302 errors

For full testing, you'd need a backend, but the core session features work without one!

### Q: What if I see "Cannot find module 'session-management'"?

**A:** This means the library hasn't been built yet. Run:
```bash
ng build session-management
```

### Q: How do I reset everything?

**A:** Clear browser storage:
1. Open DevTools (F12)
2. Application tab > Local Storage
3. Right-click > Clear
4. Refresh the page

Or use incognito/private browsing mode for a clean slate.

### Q: Can I use this in production?

**A:** The demo is for testing only. For production:
1. Build the library: `ng build session-management --configuration production`
2. Integrate with your real backend APIs
3. Configure proper authentication endpoints
4. Use secure token storage (httpOnly cookies recommended)
5. Enable HTTPS

## 🎨 Customizing the Demo

### Change Session Timeout

Edit `projects/demo-app/src/app/app.ts` line 46:

```typescript
sessionTimeoutInSeconds: 300,  // Change to your desired seconds
```

### Change Warning Time

Edit line 47:

```typescript
warningTimeoutInSeconds: 60,   // Change to your desired seconds
```

### Disable Multi-Tab Tracking

Edit line 49:

```typescript
enableMultiTabTracking: false,  // Set to false
```

### Use Session Storage Instead

Edit line 50 (add this line):

```typescript
storageType: 'sessionStorage',  // Instead of localStorage
```

## 🐛 Troubleshooting

### Port 4200 Already in Use

```bash
# Use a different port
ng serve demo-app --port 4300
```

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
ng build session-management
```

### Library Changes Not Reflecting

```bash
# Rebuild the library
ng build session-management --watch

# In another terminal, run the demo
npm start
```

### Browser Console Errors

1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage (DevTools > Application > Clear)
3. Refresh the page (Ctrl+F5)

## 📊 Demo Features Summary

| Feature | Works Without Backend | How to Test |
|---------|----------------------|-------------|
| Login/Logout | ✅ Yes | Click buttons |
| Session Timeout | ✅ Yes | Wait 5 minutes |
| Idle Detection | ✅ Yes | Stop interacting |
| Warning Dialog | ✅ Yes | Wait for warning |
| Multi-Tab Sync | ✅ Yes | Open multiple tabs |
| Session Extension | ✅ Yes | Click button or move mouse |
| Storage Management | ✅ Yes | Check DevTools |
| Event Logging | ✅ Yes | Check Console |
| HTTP Interceptor | ⚠️ Partial | Needs backend for full test |
| Keep-Alive | ⚠️ Partial | Needs backend endpoint |
| Token Refresh | ⚠️ Partial | Needs backend endpoint |

## 🚀 Next Steps

### For Development

1. **Explore the Code**: Check `projects/session-management/src/lib/`
2. **Read Documentation**: See [README.md](README.md) and [API.md](API.md)
3. **Try Examples**: Check [EXAMPLES.md](EXAMPLES.md)
4. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md)

### For Production Use

1. **Build the Library**: `ng build session-management --configuration production`
2. **Publish to npm**: Follow [Publishing Guide](projects/session-management/README.md#publishing)
3. **Integrate Backend**: Configure API endpoints in your app
4. **Add Authentication**: Implement real login/logout APIs
5. **Secure Tokens**: Use httpOnly cookies or secure storage

## 📞 Need Help?

- **Issues**: [GitHub Issues](https://github.com/your-org/angular-session-workspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/angular-session-workspace/discussions)
- **Email**: support@your-org.com

## 🎉 Success!

If you can see the demo app running and can login/logout, you're all set! The session management library is working perfectly without any backend.

---

**Made with ❤️ and Bob** 🤖

**Happy Testing!** 🚀