@echo off
echo ========================================
echo Git Cleanup Script - Remove node_modules
echo ========================================
echo.
echo This script will remove ALL node_modules from Git tracking.
echo Your local files will NOT be deleted.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul
echo.

REM Step 1: Reset staging area
echo [1/6] Resetting Git staging area...
git reset
echo.

REM Step 2: Remove ALL node_modules from Git cache recursively
echo [2/6] Removing node_modules from Git cache...
git rm -r --cached node_modules
git rm -r --cached projects/session-management/node_modules
git rm -r --cached projects/demo-app/node_modules
echo.

REM Step 3: Add updated .gitignore
echo [3/6] Adding updated .gitignore...
git add .gitignore
echo.

REM Step 4: Commit the removal
echo [4/6] Committing node_modules removal...
git commit -m "chore: remove node_modules from Git tracking"
echo.

REM Step 5: Check status
echo [5/6] Checking Git status...
git status
echo.

REM Step 6: Verify no node_modules
echo [6/6] Verifying node_modules are not tracked...
git ls-files | findstr /i "node_modules"
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Some node_modules files are still tracked!
    echo Please review the output above.
) else (
    echo SUCCESS: No node_modules files are tracked!
)
echo.

echo ========================================
echo Cleanup complete!
echo Now you can run git-push.bat to push to GitHub.
echo ========================================
pause

@REM Made with Bob
