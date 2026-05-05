# 🔍 Deployment Monitoring Guide

## 📊 How to Check Deployment Status

After you push code to GitHub, here's exactly how to monitor the deployment and understand each phase.

---

## 🚀 Step 1: Go to Actions Tab

### **URL:**
```
https://github.com/kundan594/session-angular/actions
```

### **Or Navigate:**
1. Go to your repository: https://github.com/kundan594/session-angular
2. Click the **"Actions"** tab (top menu bar)
   ```
   Code | Issues | Pull requests | Actions | Projects | ...
                                     ↑
                                 Click here
   ```

---

## 📋 Step 2: View Workflow Runs

You'll see a list of all workflow runs:

```
┌─────────────────────────────────────────────────────────┐
│  All workflows                                          │
├─────────────────────────────────────────────────────────┤
│  🟡 Deploy Demo to GitHub Pages                         │
│     release: version 1.1.0 - CI/CD automation          │
│     #1 · main · 2 minutes ago                          │
│                                                         │
│  🟡 CI - Build and Test                                 │
│     release: version 1.1.0 - CI/CD automation          │
│     #1 · main · 2 minutes ago                          │
└─────────────────────────────────────────────────────────┘
```

### **Status Icons:**
- 🟡 **Yellow circle** = Running
- ✅ **Green checkmark** = Success
- ❌ **Red X** = Failed
- ⚪ **Gray circle** = Queued/Waiting

---

## 🔍 Step 3: Click on a Workflow Run

Click on "Deploy Demo to GitHub Pages" to see detailed progress.

---

## 📊 Deployment Phases Explained

### **Phase 1: Build Job (2-3 minutes)**

```
┌─────────────────────────────────────────────────────────┐
│  build                                                  │
│  Run on: ubuntu-latest                                  │
├─────────────────────────────────────────────────────────┤
│  ✅ Set up job                              0s          │
│  ✅ Checkout repository                     2s          │
│  ✅ Setup Node.js                           5s          │
│  🟡 Install dependencies                   45s          │
│  ⚪ Build session-management library       30s          │
│  ⚪ Build demo app for production          40s          │
│  ⚪ Setup Pages                             2s          │
│  ⚪ Upload artifact                         10s         │
└─────────────────────────────────────────────────────────┘
```

**What's Happening:**

1. **Set up job** (0s)
   - Initializes the runner (Ubuntu virtual machine)
   - Prepares environment

2. **Checkout repository** (2s)
   - Downloads your code from GitHub
   - Checks out the main branch

3. **Setup Node.js** (5s)
   - Installs Node.js 20.x
   - Sets up npm
   - Restores npm cache if available

4. **Install dependencies** (45s)
   - Runs `npm ci` (clean install)
   - Downloads all packages from package.json
   - Creates node_modules folder

5. **Build session-management library** (30s)
   - Runs `ng build session-management`
   - Compiles TypeScript to JavaScript
   - Creates dist/session-management folder
   - Generates package for npm

6. **Build demo app for production** (40s)
   - Runs `ng build demo-app --configuration production`
   - Optimizes for production (minification, tree-shaking)
   - Sets base-href to /session-angular/
   - Creates dist/demo-app/browser folder

7. **Setup Pages** (2s)
   - Configures GitHub Pages deployment
   - Prepares artifact for upload

8. **Upload artifact** (10s)
   - Packages dist/demo-app/browser
   - Uploads to GitHub Pages artifact storage

---

### **Phase 2: Deploy Job (1 minute)**

```
┌─────────────────────────────────────────────────────────┐
│  deploy                                                 │
│  Run on: ubuntu-latest                                  │
│  Needs: build                                           │
├─────────────────────────────────────────────────────────┤
│  ✅ Set up job                              0s          │
│  🟡 Deploy to GitHub Pages                 60s          │
│  ⚪ Complete job                            0s          │
└─────────────────────────────────────────────────────────┘
```

**What's Happening:**

1. **Set up job** (0s)
   - Waits for build job to complete
   - Initializes deployment environment

2. **Deploy to GitHub Pages** (60s)
   - Downloads artifact from build job
   - Deploys to GitHub Pages
   - Updates gh-pages branch
   - Configures CDN
   - Makes site live

3. **Complete job** (0s)
   - Cleanup
   - Marks deployment as successful

---

## 🎯 Real-Time Progress View

### **Click on Any Step to See Live Logs:**

Example: Click "Install dependencies" to see:

```
Run npm ci
npm WARN deprecated inflight@1.0.6: This module is not supported
npm WARN deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
added 1234 packages in 42s

234 packages are looking for funding
  run `npm fund` for details
```

### **Click "Build demo app for production" to see:**

```
Run ng build demo-app --configuration production --base-href /session-angular/

Initial chunk files | Names         |  Raw size | Estimated transfer size
main-ABCD1234.js    | main          | 245.67 kB |                67.89 kB
polyfills-EFGH5678.js| polyfills    |  33.21 kB |                10.87 kB
styles-IJKL9012.css | styles        |   2.45 kB |                 0.89 kB

                    | Initial total | 281.33 kB |                79.65 kB

Build at: 2026-05-05T14:25:00.000Z - Hash: abcd1234efgh5678 - Time: 38542ms

✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Output location: dist/demo-app/browser
```

---

## 📈 CI Workflow Phases (Parallel)

The CI workflow runs **at the same time** as deployment:

```
┌─────────────────────────────────────────────────────────┐
│  lint-and-test (Node 18.x)                              │
├─────────────────────────────────────────────────────────┤
│  ✅ Checkout repository                     2s          │
│  ✅ Setup Node.js 18.x                      5s          │
│  ✅ Install dependencies                   45s          │
│  🟡 Lint code                               15s         │
│  ⚪ Build session-management library       30s          │
│  ⚪ Run unit tests                          60s         │
│  ⚪ Build demo app                          40s         │
│  ⚪ Upload coverage reports                 5s          │
│  ⚪ Security audit                          10s         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  lint-and-test (Node 20.x)                              │
├─────────────────────────────────────────────────────────┤
│  ✅ Checkout repository                     2s          │
│  ✅ Setup Node.js 20.x                      5s          │
│  🟡 Install dependencies                   45s          │
│  ⚪ Lint code                               15s         │
│  ⚪ Build session-management library       30s          │
│  ⚪ Run unit tests                          60s         │
│  ⚪ Build demo app                          40s         │
│  ⚪ Upload coverage reports                 5s          │
│  ⚪ Security audit                          10s         │
└─────────────────────────────────────────────────────────┘
```

**What's Happening:**

1. **Lint code** (15s)
   - Runs ESLint
   - Checks code quality
   - Verifies formatting

2. **Run unit tests** (60s)
   - Runs Jasmine/Karma tests
   - Generates code coverage report
   - Checks coverage threshold (80%)

3. **Upload coverage reports** (5s)
   - Uploads to Codecov
   - Generates coverage badge

4. **Security audit** (10s)
   - Runs `npm audit`
   - Checks for vulnerabilities
   - Reports security issues

---

## 🎨 Visual Timeline

```
Time    Deploy Workflow              CI Workflow (18.x & 20.x)
─────────────────────────────────────────────────────────────
0:00    🟡 Checkout code             🟡 Checkout code
0:02    🟡 Setup Node.js             🟡 Setup Node.js
0:07    🟡 Install dependencies      🟡 Install dependencies
0:52    🟡 Build library             🟡 Lint code
1:22    🟡 Build demo app            🟡 Build library
2:02    🟡 Upload artifact           🟡 Run tests
2:12    ✅ Build complete            🟡 Build demo
2:12    🟡 Deploy to Pages           🟡 Upload coverage
3:12    ✅ Deploy complete           🟡 Security audit
3:12    🎉 LIVE!                     ✅ CI complete
```

---

## 📊 How to Read the Status Page

### **Overall Status:**

```
┌─────────────────────────────────────────────────────────┐
│  Deploy Demo to GitHub Pages                            │
│  ✅ Success in 3m 15s                                   │
│                                                         │
│  Triggered by: push                                     │
│  Branch: main                                           │
│  Commit: abcd1234 "release: version 1.1.0"             │
│  Author: kundan594                                      │
└─────────────────────────────────────────────────────────┘
```

### **Job Summary:**

```
Jobs
├── build (2m 10s) ✅
└── deploy (1m 5s) ✅
```

### **Artifacts:**

```
Artifacts
└── github-pages (12.3 MB)
    Uploaded 2 minutes ago
    Expires in 90 days
```

---

## 🔔 Notifications

### **Email Notifications:**

You'll receive emails for:
- ✅ Successful deployments
- ❌ Failed deployments
- ⚠️ Workflow warnings

### **GitHub Notifications:**

Check the bell icon (🔔) in GitHub for:
- Workflow status updates
- Deployment notifications
- Action required alerts

---

## 🐛 Troubleshooting Failed Deployments

### **If Build Fails:**

1. **Click on the failed step** (red X)
2. **Read the error message**
3. **Common issues:**

```
Error: Cannot find module '@angular/core'
→ Solution: npm install missing

Error: Build failed with exit code 1
→ Solution: Check TypeScript errors

Error: ENOSPC: no space left on device
→ Solution: Clear cache, retry
```

### **If Deploy Fails:**

1. **Check Pages settings**
   - Settings → Pages → Source: GitHub Actions
2. **Verify permissions**
   - Workflow has pages: write permission
3. **Check artifact**
   - Artifact was uploaded successfully

---

## 📱 Mobile Monitoring

### **GitHub Mobile App:**

1. Download GitHub app
2. Go to your repository
3. Tap "Actions" tab
4. See real-time updates
5. Get push notifications

---

## 🎯 Success Indicators

### **Deployment Successful When:**

✅ All steps show green checkmarks
✅ "Deploy to GitHub Pages" shows success
✅ Artifact uploaded successfully
✅ No error messages in logs
✅ Site accessible at: https://kundan594.github.io/session-angular/

### **How to Verify:**

1. **Check Actions tab** - All green ✅
2. **Visit live site** - Loads correctly
3. **Check browser console** - No errors
4. **Test functionality** - Everything works

---

## 📊 Deployment Metrics

### **Typical Timings:**

| Phase | Duration | What's Happening |
|-------|----------|------------------|
| Checkout | 2s | Download code |
| Setup | 5s | Install Node.js |
| Install | 45s | npm ci |
| Build Library | 30s | Compile library |
| Build Demo | 40s | Compile demo |
| Upload | 10s | Package artifact |
| Deploy | 60s | Publish to Pages |
| **Total** | **~3 min** | **End to end** |

### **Performance Tips:**

- ✅ Caching enabled (saves 30s on subsequent runs)
- ✅ Parallel jobs (CI runs simultaneously)
- ✅ Optimized builds (production mode)

---

## 🔍 Advanced Monitoring

### **View Raw Logs:**

Click "View raw logs" button to download complete log file.

### **Re-run Failed Jobs:**

Click "Re-run jobs" button to retry failed deployment.

### **Cancel Running Workflow:**

Click "Cancel workflow" button to stop deployment.

---

## 📈 Deployment History

### **View All Deployments:**

```
Actions → Workflows → Deploy Demo to GitHub Pages
```

You'll see:
- All past deployments
- Success/failure rate
- Average deployment time
- Commit history

### **Compare Deployments:**

Click on different runs to compare:
- Build times
- Artifact sizes
- Error patterns

---

## 🎉 What Success Looks Like

```
┌─────────────────────────────────────────────────────────┐
│  Deploy Demo to GitHub Pages                            │
│  ✅ Success in 3m 12s                                   │
│                                                         │
│  build (2m 8s) ✅                                       │
│  ├─ Set up job ✅                                       │
│  ├─ Checkout repository ✅                              │
│  ├─ Setup Node.js ✅                                    │
│  ├─ Install dependencies ✅                             │
│  ├─ Build session-management library ✅                 │
│  ├─ Build demo app for production ✅                    │
│  ├─ Setup Pages ✅                                      │
│  └─ Upload artifact ✅                                  │
│                                                         │
│  deploy (1m 4s) ✅                                      │
│  ├─ Set up job ✅                                       │
│  └─ Deploy to GitHub Pages ✅                           │
│                                                         │
│  🌐 Your site is live!                                  │
│  https://kundan594.github.io/session-angular/          │
└─────────────────────────────────────────────────────────┘
```

---

## 📞 Quick Reference

### **URLs to Bookmark:**

- **Actions Dashboard**: https://github.com/kundan594/session-angular/actions
- **Deploy Workflow**: https://github.com/kundan594/session-angular/actions/workflows/deploy.yml
- **CI Workflow**: https://github.com/kundan594/session-angular/actions/workflows/ci.yml
- **Live Demo**: https://kundan594.github.io/session-angular/

### **Keyboard Shortcuts:**

- `g` + `a` = Go to Actions
- `?` = Show keyboard shortcuts
- `/` = Search

---

**Created**: 2026-05-05  
**Version**: 1.0.0  
**Repository**: https://github.com/kundan594/session-angular