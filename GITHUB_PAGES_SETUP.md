# 🚀 GitHub Pages Setup Guide

## 📋 Quick Setup (5 Minutes)

Follow these steps to enable automatic deployment of your demo app to GitHub Pages.

---

## Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/kundan594/session-angular
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Click **Save**

**Screenshot Guide:**
```
Settings → Pages → Source: GitHub Actions
```

---

## Step 2: Push CI/CD Files to GitHub

The CI/CD workflow files have been created. Now push them:

```bash
# Add the new workflow files
git add .github/workflows/

# Commit
git commit -m "ci: add GitHub Actions workflows for CI/CD

- Added deploy.yml for automatic GitHub Pages deployment
- Added ci.yml for build and test automation
- Demo app will be available at https://kundan594.github.io/session-angular/"

# Push to GitHub
git push origin main
```

---

## Step 3: Wait for Deployment (2-3 minutes)

After pushing, GitHub Actions will automatically:

1. ✅ Build the session-management library
2. ✅ Build the demo-app for production
3. ✅ Deploy to GitHub Pages
4. ✅ Make it live at: **https://kundan594.github.io/session-angular/**

**Check Progress:**
1. Go to: https://github.com/kundan594/session-angular/actions
2. You'll see the workflow running
3. Wait for green checkmark ✅

---

## Step 4: Access Your Live Demo

Once deployment completes (green checkmark), your demo will be live at:

🌐 **https://kundan594.github.io/session-angular/**

---

## 🎯 How It Works

### **Automatic Deployment Flow:**

```
You commit code
    ↓
Push to GitHub (main branch)
    ↓
GitHub Actions triggers automatically
    ↓
┌─────────────────────────────────────┐
│  Job 1: Build                       │
│  - Checkout code                    │
│  - Install dependencies (npm ci)    │
│  - Build library                    │
│  - Build demo app                   │
│  - Upload to GitHub Pages           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Job 2: Deploy                      │
│  - Deploy to GitHub Pages           │
│  - Update live site                 │
└─────────────────────────────────────┘
    ↓
✅ Live at: https://kundan594.github.io/session-angular/
```

**Total Time: 2-3 minutes**

---

## 📁 Files Created

### **1. `.github/workflows/deploy.yml`**
Handles automatic deployment to GitHub Pages when you push to main branch.

**What it does:**
- Builds the library
- Builds the demo app with production configuration
- Deploys to GitHub Pages
- Updates your live site

### **2. `.github/workflows/ci.yml`**
Runs tests and checks on every push and pull request.

**What it does:**
- Lints code
- Builds library
- Runs unit tests
- Builds demo app
- Checks for security issues

---

## 🔄 Workflow Triggers

### **Deploy Workflow (deploy.yml)**
Triggers on:
- ✅ Push to `main` branch
- ✅ Manual trigger (workflow_dispatch)

### **CI Workflow (ci.yml)**
Triggers on:
- ✅ Push to `main` or `develop` branch
- ✅ Pull requests to `main` branch

---

## 📊 Monitoring Deployments

### **View Workflow Status:**

1. Go to: https://github.com/kundan594/session-angular/actions
2. You'll see all workflow runs
3. Click on any run to see details

### **Workflow Badges:**

Add these to your README.md to show build status:

```markdown
![Deploy Status](https://github.com/kundan594/session-angular/actions/workflows/deploy.yml/badge.svg)
![CI Status](https://github.com/kundan594/session-angular/actions/workflows/ci.yml/badge.svg)
```

Result:
![Deploy Status](https://github.com/kundan594/session-angular/actions/workflows/deploy.yml/badge.svg)
![CI Status](https://github.com/kundan594/session-angular/actions/workflows/ci.yml/badge.svg)

---

## 🎨 Customizing the Demo App

### **Update Base URL (if needed)**

The demo app is configured with base-href: `/session-angular/`

If your repository name is different, update `.github/workflows/deploy.yml`:

```yaml
- name: Build demo app for production
  run: ng build demo-app --configuration production --base-href /YOUR-REPO-NAME/
```

---

## 🐛 Troubleshooting

### **Issue 1: Deployment Failed**

**Check:**
1. Go to Actions tab
2. Click on failed workflow
3. Read error messages

**Common fixes:**
- Ensure `package.json` has correct scripts
- Check if all dependencies are installed
- Verify Angular configuration

### **Issue 2: 404 Page Not Found**

**Fix:**
1. Check if GitHub Pages is enabled (Settings → Pages)
2. Verify source is set to "GitHub Actions"
3. Wait 2-3 minutes after deployment
4. Clear browser cache

### **Issue 3: Blank Page**

**Fix:**
1. Check browser console for errors
2. Verify base-href matches repository name
3. Check if all assets are loading

### **Issue 4: Workflow Not Triggering**

**Fix:**
1. Ensure workflow files are in `.github/workflows/`
2. Check file names: `deploy.yml` and `ci.yml`
3. Verify YAML syntax (no tabs, correct indentation)
4. Push to `main` branch

---

## 🔒 Permissions

The workflows use these permissions:

```yaml
permissions:
  contents: read      # Read repository content
  pages: write        # Write to GitHub Pages
  id-token: write     # Generate deployment token
```

These are automatically granted by GitHub Actions.

---

## 🎯 Testing the Setup

### **Test 1: Make a Small Change**

1. Edit `projects/demo-app/src/app/app.html`
2. Change the title or add text
3. Commit and push:
   ```bash
   git add .
   git commit -m "test: update demo app title"
   git push origin main
   ```
4. Wait 2-3 minutes
5. Refresh: https://kundan594.github.io/session-angular/
6. See your changes live! 🎉

### **Test 2: Check Workflow Logs**

1. Go to: https://github.com/kundan594/session-angular/actions
2. Click on latest workflow run
3. Expand each step to see logs
4. Verify all steps completed successfully

---

## 📈 What Happens on Each Commit

```
Commit & Push
    ↓
GitHub Actions Triggered
    ↓
┌─────────────────────────────────────┐
│  CI Workflow (ci.yml)               │
│  - Runs on Node 18.x and 20.x       │
│  - Lints code                       │
│  - Builds library                   │
│  - Runs tests                       │
│  - Checks security                  │
│  Duration: ~5 minutes               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Deploy Workflow (deploy.yml)       │
│  - Builds for production            │
│  - Deploys to GitHub Pages          │
│  - Updates live site                │
│  Duration: ~2 minutes               │
└─────────────────────────────────────┘
    ↓
✅ Changes Live!
```

---

## 🌟 Benefits

### **Before CI/CD:**
```
1. Build locally (5 min)
2. Test locally (10 min)
3. Manually upload to server (5 min)
4. Verify deployment (5 min)
Total: 25 minutes of manual work
```

### **After CI/CD:**
```
1. Commit and push (1 min)
2. Everything else automatic (7 min)
Total: 1 minute of your time!
```

### **Additional Benefits:**
✅ Automatic testing on every commit
✅ Consistent builds (no "works on my machine")
✅ Instant rollback (revert commit)
✅ Build status badges
✅ Deployment history
✅ No manual deployment steps

---

## 📚 Next Steps

### **1. Add More Tests**
```bash
# Add unit tests
npm run test

# Add E2E tests
npm run e2e
```

### **2. Add Code Coverage Badge**
Sign up for [Codecov](https://codecov.io/) and add badge to README.

### **3. Add Custom Domain (Optional)**
1. Buy a domain
2. Add CNAME file to demo app
3. Configure DNS
4. Update GitHub Pages settings

### **4. Add Staging Environment**
Create a `develop` branch for testing before production.

---

## 🎉 Success Checklist

- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Workflow files pushed to repository
- [ ] First deployment completed successfully
- [ ] Demo app accessible at https://kundan594.github.io/session-angular/
- [ ] Workflow badges added to README
- [ ] Tested making a change and seeing it live

---

## 📞 Support

**If you encounter issues:**

1. Check workflow logs: https://github.com/kundan594/session-angular/actions
2. Review this guide
3. Check GitHub Pages status: https://www.githubstatus.com/
4. Open an issue in the repository

---

## 🔗 Useful Links

- **Your Repository**: https://github.com/kundan594/session-angular
- **GitHub Actions**: https://github.com/kundan594/session-angular/actions
- **Live Demo**: https://kundan594.github.io/session-angular/
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions

---

**Created**: 2026-05-05  
**Version**: 1.0.0  
**Repository**: https://github.com/kundan594/session-angular

---

**Made with Bob** 🤖