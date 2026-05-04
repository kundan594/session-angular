# Troubleshooting Guide

Common issues and solutions when running the Angular Session Management project.

## 🔴 PowerShell Execution Policy Error

### Error Message
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

### Solution

**Option 1: Run in Command Prompt (Recommended)**
1. Open Command Prompt (cmd.exe) instead of PowerShell
2. Navigate to project directory
3. Run commands normally:
   ```cmd
   npm install
   npm run build
   npm start
   ```

**Option 2: Enable PowerShell Scripts (Admin Required)**
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` to confirm
4. Close and reopen PowerShell
5. Run npm commands

**Option 3: Use Git Bash**
1. Install Git for Windows (includes Git Bash)
2. Open Git Bash
3. Run commands normally

---

## 🔴 Zone.js Import Error

### Error Message
```
Failed to resolve import "zone.js" from ".angular/vite-root/demo-app/main.js"
```

### Solution

**Step 1: Ensure zone.js is in package.json**

Check that `package.json` includes:
```json
"dependencies": {
  "zone.js": "~0.15.0"
}
```

**Step 2: Install dependencies**

Using Command Prompt (not PowerShell):
```cmd
npm install
```

**Step 3: Verify installation**
```cmd
npm list zone.js
```

Should show: `zone.js@0.15.x`

**Step 4: Clear cache if needed**
```cmd
npm cache clean --force
npm install
```

---

## 🔴 Cannot Find Module 'session-management'

### Error Message
```
Cannot find module 'session-management' or its corresponding type declarations
```

### Solution

The library needs to be built before running the demo:

```cmd
npm run build
```

This creates the distributable files in `dist/session-management/`

---

## 🔴 Port 4200 Already in Use

### Error Message
```
Port 4200 is already in use
```

### Solution

**Option 1: Use different port**
```cmd
ng serve demo-app --port 4300
```

**Option 2: Kill process using port 4200**

Windows Command Prompt:
```cmd
netstat -ano | findstr :4200
taskkill /PID <PID_NUMBER> /F
```

---

## 🔴 Build Errors

### Error: Module not found

**Solution:**
```cmd
# Clean install
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Error: TypeScript compilation errors

**Solution:**
```cmd
# Ensure TypeScript version matches
npm install typescript@~5.9.2 --save-dev
```

---

## 🔴 Demo App Not Loading

### Blank page or errors in console

**Solution:**

1. **Clear browser cache**
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Refresh page with `Ctrl + F5`

2. **Clear localStorage**
   - Open DevTools (F12)
   - Application tab > Local Storage
   - Right-click > Clear
   - Refresh page

3. **Check console for errors**
   - Open DevTools (F12)
   - Console tab
   - Look for error messages

4. **Rebuild everything**
   ```cmd
   npm run build
   npm start
   ```

---

## 🔴 Library Changes Not Reflecting

### Made changes to library but demo doesn't update

**Solution:**

**Option 1: Rebuild library**
```cmd
npm run build
```

**Option 2: Use watch mode**

Terminal 1 (watch library):
```cmd
npm run watch
```

Terminal 2 (run demo):
```cmd
npm start
```

---

## 🔴 HTTP Interceptor Not Working

### Tokens not being added to requests

**Solution:**

The demo app doesn't make real HTTP requests. To test the interceptor:

1. **Add a test endpoint** in `app.ts`:
   ```typescript
   testApi() {
     this.http.get('/api/test').subscribe({
       next: (data) => console.log('Success:', data),
       error: (err) => console.log('Error:', err)
     });
   }
   ```

2. **Check Network tab** in DevTools to see headers

3. **For full testing**, you need a backend API

---

## 🔴 Multi-Tab Sync Not Working

### Sessions not syncing across tabs

**Solution:**

1. **Check browser support**
   - BroadcastChannel API required
   - Works in Chrome, Firefox, Edge, Safari
   - Check: `typeof BroadcastChannel !== 'undefined'`

2. **Check localStorage**
   - DevTools > Application > Local Storage
   - Should see `sm_active_tabs` key

3. **Try different browser**
   - Some browsers block BroadcastChannel in certain modes

---

## 🔴 Session Not Timing Out

### Idle timeout not triggering

**Solution:**

1. **Check configuration**
   ```typescript
   this.sessionService.initialize({
     sessionTimeoutInSeconds: 300,  // 5 minutes
     enableIdleTimeout: true        // Must be true
   });
   ```

2. **Verify in console**
   - Enable debug logging: `enableDebugLogging: true`
   - Watch for activity events

3. **Test with shorter timeout**
   ```typescript
   sessionTimeoutInSeconds: 30,  // 30 seconds for testing
   warningTimeoutInSeconds: 10   // 10 seconds warning
   ```

---

## 🔴 Warning Dialog Not Showing

### No warning before session expires

**Solution:**

1. **Check component is included**
   ```typescript
   // In app.html
   <sm-session-warning-dialog></sm-session-warning-dialog>
   ```

2. **Check warning time configuration**
   ```typescript
   warningTimeoutInSeconds: 60  // Must be less than sessionTimeout
   ```

3. **Subscribe to warning observable**
   ```typescript
   this.sessionService.warningDialog$.subscribe(show => {
     console.log('Warning dialog:', show);
   });
   ```

---

## 🔴 Tests Failing

### Unit tests not passing

**Solution:**

1. **Install test dependencies**
   ```cmd
   npm install --save-dev vitest jsdom
   ```

2. **Run tests with verbose output**
   ```cmd
   npm test -- --reporter=verbose
   ```

3. **Check test configuration**
   - Verify `vitest.config.ts` exists
   - Check test file naming: `*.spec.ts`

---

## 🔴 Build for Production Fails

### Production build errors

**Solution:**

1. **Use production build command**
   ```cmd
   npm run build:prod
   ```

2. **Check for console.log statements**
   - Remove or comment out debug logs
   - Use `enableDebugLogging: false` in production

3. **Verify all imports**
   - Check for missing dependencies
   - Ensure all paths are correct

---

## 📋 Quick Diagnostic Checklist

Run these commands to diagnose issues:

```cmd
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 11+)
npm --version

# Check if zone.js is installed
npm list zone.js

# Check if Angular CLI is available
ng version

# List all installed packages
npm list --depth=0

# Check for outdated packages
npm outdated
```

---

## 🆘 Still Having Issues?

### Get Help

1. **Check existing issues**
   - [GitHub Issues](https://github.com/your-org/angular-session-workspace/issues)

2. **Create new issue**
   - Include error messages
   - Include Node.js and npm versions
   - Include steps to reproduce

3. **Ask in discussions**
   - [GitHub Discussions](https://github.com/your-org/angular-session-workspace/discussions)

4. **Contact support**
   - Email: support@your-org.com

---

## 💡 Best Practices to Avoid Issues

1. **Always use Command Prompt on Windows** (not PowerShell)
2. **Build library before running demo**: `npm run build`
3. **Clear cache when switching branches**: `npm cache clean --force`
4. **Use Node.js LTS version** (18.x or higher)
5. **Keep dependencies updated**: `npm update`
6. **Use watch mode during development**: `npm run watch`
7. **Clear browser cache regularly** during development
8. **Check console for errors** before reporting issues

---

## 🔧 Complete Reset Procedure

If all else fails, start fresh:

```cmd
# 1. Delete node_modules and lock file
rmdir /s /q node_modules
del package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Build library
npm run build

# 5. Start demo
npm start
```

---

**Made with Bob** 🤖

For more help, see:
- [Quick Start Guide](quick-start.md)
- [Running Locally Guide](RUNNING_LOCALLY.md)
- [Contributing Guide](CONTRIBUTING.md)