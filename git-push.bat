@echo off
echo ========================================
echo Git Commit and Push Script
echo Version: 1.0.0
echo ========================================
echo.

REM Step 1: Reset any staged files
echo [1/11] Resetting Git staging area...
git reset
echo.

REM Step 2: Remove node_modules from cache if tracked
echo [2/11] Removing node_modules from Git cache (if tracked)...
git rm -r --cached node_modules 2>nul
git rm -r --cached projects/session-management/node_modules 2>nul
echo.

REM Step 3: Check Git status
echo [3/11] Checking Git status...
git status
echo.
echo Press any key to continue if node_modules is NOT listed above...
pause >nul
echo.

REM Step 4: Add .gitignore first
echo [4/11] Adding .gitignore...
git add .gitignore
echo.

REM Step 5: Add documentation files
echo [5/11] Adding documentation files...
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
echo.

REM Step 6: Add configuration files
echo [6/11] Adding configuration files...
git add package.json
git add angular.json
git add tsconfig.json
git add .editorconfig
git add .prettierrc
echo.

REM Step 7: Add project files
echo [7/11] Adding project files...
git add projects/session-management/
git add projects/demo-app/
echo.

REM Step 8: Verify staged files
echo [8/11] Verifying staged files...
git status
echo.
echo Press any key to continue if everything looks correct...
pause >nul
echo.

REM Step 9: Commit
echo [9/11] Committing changes...
git commit -m "feat: initial release v1.0.0 with comprehensive documentation - Added complete session management library - Multi-tab session conflict detection - Comprehensive documentation (11 files, 5800+ lines) - Usage examples and API reference - Versioning and changelog system - Multi-user scenario handling - No backend required for demo"
echo.

REM Step 10: Add remote (remove if exists)
echo [10/11] Setting up remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/kundan594/session-angular.git
git branch -M main
echo.

REM Step 11: Push
echo [11/11] Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo Done! Check the output above for any errors.
echo ========================================
pause

@REM Made with Bob
