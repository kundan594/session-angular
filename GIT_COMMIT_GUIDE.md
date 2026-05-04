# Git Commit Guide - Step by Step

Follow these steps **in Command Prompt (cmd.exe)** to commit and push your code to GitHub.

## ⚠️ Important: Use Command Prompt, NOT PowerShell

1. Press `Win + R`
2. Type `cmd`
3. Press Enter
4. Navigate to project: `cd C:\Users\061295CA8\Desktop\angular-session-workspace`

## 📋 Step-by-Step Commands

### Step 1: Stop Any Running Git Commands

If git add is still running, press `Ctrl + C` to stop it.

### Step 2: Reset Git Staging

```cmd
git reset
```

### Step 3: Remove node_modules from Git (if tracked)

```cmd
git rm -r --cached node_modules
git rm -r --cached projects/session-management/node_modules
```

If you get "fatal: pathspec 'node_modules' did not match any files", that's OK - it means they weren't tracked.

### Step 4: Verify .gitignore

Check that .gitignore exists and contains node_modules:

```cmd
type .gitignore
```

You should see `/node_modules` in the output.

### Step 5: Check Git Status

```cmd
git status
```

This shows what will be committed. You should NOT see node_modules listed.

### Step 6: Add Files (Excluding node_modules)

```cmd
git add .gitignore
git add CHANGELOG.md
git add README.md
git add EXAMPLES.md
git add API.md
git add CONTRIBUTING.md
git add RUNNING_LOCALLY.md
git add quick-start.md
git add TROUBLESHOOTING.md
git add MULTI_TAB_SCENARIOS.md
git add VERSIONING.md
git add GIT_COMMIT_GUIDE.md
git add package.json
git add angular.json
git add tsconfig.json
git add projects/session-management/
git add projects/demo-app/
```

### Step 7: Verify What's Staged

```cmd
git status
```

Make sure node_modules is NOT in the list!

### Step 8: Commit with Version Message

```cmd
git commit -m "feat: initial release v1.0.0 with comprehensive documentation - Added complete session management library - Multi-tab session conflict detection - Comprehensive documentation (11 files, 5800+ lines) - Usage examples and API reference - Versioning and changelog system - Multi-user scenario handling - No backend required for demo"
```

### Step 9: Add Remote Repository

```cmd
git remote add origin https://github.com/kundan594/session-angular.git
```

If you get "remote origin already exists", remove it first:
```cmd
git remote remove origin
git remote add origin https://github.com/kundan594/session-angular.git
```

### Step 10: Set Main Branch

```cmd
git branch -M main
```

### Step 11: Push to GitHub

```cmd
git push -u origin main
```

You may be prompted for GitHub credentials. Use your GitHub username and a Personal Access Token (not password).

## ✅ Success Indicators

After successful push, you should see:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), X.XX MiB | X.XX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/kundan594/session-angular.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🔍 Verify on GitHub

1. Go to: https://github.com/kundan594/session-angular
2. You should see all your files EXCEPT node_modules
3. Check that documentation files are visible

## 📦 What's Being Committed

### Documentation Files (11 files):
- ✅ .gitignore
- ✅ CHANGELOG.md
- ✅ README.md
- ✅ EXAMPLES.md
- ✅ API.md
- ✅ CONTRIBUTING.md
- ✅ RUNNING_LOCALLY.md
- ✅ quick-start.md
- ✅ TROUBLESHOOTING.md
- ✅ MULTI_TAB_SCENARIOS.md
- ✅ VERSIONING.md
- ✅ GIT_COMMIT_GUIDE.md

### Source Code:
- ✅ projects/session-management/src/ (all library files)
- ✅ projects/demo-app/src/ (demo application)
- ✅ Configuration files (package.json, angular.json, etc.)

### Excluded (via .gitignore):
- ❌ node_modules/
- ❌ dist/
- ❌ .angular/
- ❌ Build artifacts

## 🚨 Troubleshooting

### Problem: "node_modules still being added"

**Solution:**
```cmd
git reset
git rm -r --cached node_modules
git rm -r --cached projects/session-management/node_modules
git add .gitignore
git commit -m "chore: add gitignore"
git push
```

Then add other files separately.

### Problem: "remote origin already exists"

**Solution:**
```cmd
git remote remove origin
git remote add origin https://github.com/kundan594/session-angular.git
```

### Problem: "failed to push some refs"

**Solution:**
```cmd
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Problem: "Authentication failed"

**Solution:**
1. Go to GitHub.com
2. Settings > Developer settings > Personal access tokens
3. Generate new token (classic)
4. Select scopes: repo (all)
5. Copy the token
6. Use token as password when pushing

## 📝 Version Information

- **Version**: 1.0.0
- **Release Date**: 2026-05-04
- **Commit Type**: feat (initial release)
- **Total Documentation**: 5,800+ lines across 11 files

## 🎉 After Successful Push

Your repository will be live at:
https://github.com/kundan594/session-angular

You can then:
1. View all documentation on GitHub
2. Create releases
3. Share with others
4. Continue development with proper version tracking

---

**Made with Bob** 🤖