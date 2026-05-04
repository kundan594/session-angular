# Versioning Guide

Complete guide for version management, release process, and changelog maintenance for the Angular Session Management library.

## 📋 Table of Contents

1. [Semantic Versioning](#semantic-versioning)
2. [Version History](#version-history)
3. [Release Process](#release-process)
4. [Changelog Management](#changelog-management)
5. [Git Workflow](#git-workflow)
6. [NPM Publishing](#npm-publishing)
7. [Version Upgrade Guide](#version-upgrade-guide)

---

## Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/) (SemVer).

### Version Format: MAJOR.MINOR.PATCH

```
1.2.3
│ │ │
│ │ └─── PATCH: Bug fixes (backward compatible)
│ └───── MINOR: New features (backward compatible)
└─────── MAJOR: Breaking changes (not backward compatible)
```

### When to Increment

#### MAJOR Version (X.0.0)

Increment when you make **incompatible API changes**:

- Removing public APIs
- Changing method signatures
- Changing default behavior that breaks existing code
- Removing or renaming configuration options
- Changing observable return types

**Examples:**
- `1.5.3` → `2.0.0`: Removed `SessionService.getToken()` method
- `2.1.0` → `3.0.0`: Changed `initialize()` to require configuration parameter

#### MINOR Version (0.X.0)

Increment when you add **new features** in a backward-compatible manner:

- Adding new public methods
- Adding new configuration options (with defaults)
- Adding new events
- Adding new components
- Deprecating features (but not removing them)

**Examples:**
- `1.2.3` → `1.3.0`: Added biometric authentication support
- `1.3.0` → `1.4.0`: Added session analytics feature

#### PATCH Version (0.0.X)

Increment when you make **backward-compatible bug fixes**:

- Fixing bugs
- Performance improvements
- Documentation updates
- Internal refactoring
- Dependency updates (non-breaking)

**Examples:**
- `1.2.3` → `1.2.4`: Fixed idle timer not resetting
- `1.2.4` → `1.2.5`: Improved memory leak in subscription cleanup

---

## Version History

### Current Version: 1.0.0

#### Version 1.0.0 (2026-05-04) - Initial Release

**Added:**
- Core session management functionality
- Idle timeout detection
- Multi-tab synchronization
- Keep-alive mechanism
- Token management and refresh
- HTTP interceptor
- Warning dialog component
- Event system
- Storage service
- Comprehensive documentation

**Technical Details:**
- Angular 21.2.0+ support
- RxJS 7.8.0+ support
- TypeScript 5.9.2+ support
- Zone.js 0.15.0+ support

---

## Release Process

### Step-by-Step Release Checklist

#### 1. Pre-Release Preparation

```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Ensure all tests pass
npm test

# Ensure build succeeds
npm run build

# Check for outdated dependencies
npm outdated
```

#### 2. Update Version Number

**Option A: Using npm version command (Recommended)**

```bash
# For patch release (1.0.0 → 1.0.1)
npm version patch

# For minor release (1.0.0 → 1.1.0)
npm version minor

# For major release (1.0.0 → 2.0.0)
npm version major
```

This automatically:
- Updates `package.json` version
- Creates a git commit
- Creates a git tag

**Option B: Manual update**

Edit `projects/session-management/package.json`:
```json
{
  "name": "@your-org/session-management",
  "version": "1.1.0",  // Update this
  ...
}
```

#### 3. Update CHANGELOG.md

Add new version section at the top:

```markdown
## [1.1.0] - 2026-05-15

### Added
- New biometric authentication support
- Session analytics dashboard
- Custom warning dialog templates

### Changed
- Improved idle detection performance
- Updated dependencies to latest versions

### Fixed
- Fixed memory leak in subscription cleanup
- Fixed multi-tab sync issue in Safari

### Deprecated
- `getToken()` method (use `getSessionState().token` instead)

### Security
- Enhanced token encryption
- Added CSRF protection
```

#### 4. Update Documentation

Update version references in:
- `README.md`
- `projects/session-management/README.md`
- `API.md`
- Any version-specific documentation

#### 5. Commit Changes

```bash
# Stage all changes
git add .

# Commit with version message
git commit -m "chore: release version 1.1.0"

# Create git tag
git tag -a v1.1.0 -m "Release version 1.1.0"
```

#### 6. Build for Production

```bash
# Build library with production configuration
npm run build:prod

# Verify build output
cd dist/session-management
ls -la
```

#### 7. Test the Build

```bash
# In dist/session-management directory
npm pack

# This creates a .tgz file
# Test it in a separate project
cd /path/to/test-project
npm install /path/to/session-management-1.1.0.tgz
```

#### 8. Push to Repository

```bash
# Push commits
git push origin main

# Push tags
git push origin v1.1.0

# Or push all tags
git push origin --tags
```

#### 9. Publish to npm

```bash
# Navigate to dist directory
cd dist/session-management

# Login to npm (if not already)
npm login

# Publish (public package)
npm publish --access public

# Or for scoped private package
npm publish
```

#### 10. Create GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Select tag: `v1.1.0`
4. Release title: `Version 1.1.0`
5. Description: Copy from CHANGELOG.md
6. Attach build artifacts (optional)
7. Click "Publish release"

---

## Changelog Management

### Changelog Format

We follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

### Changelog Structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Features in development

## [1.1.0] - 2026-05-15

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Features marked for removal

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements

## [1.0.0] - 2026-05-04

Initial release
```

### Changelog Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Added** | New features | Added biometric authentication |
| **Changed** | Changes to existing functionality | Updated idle detection algorithm |
| **Deprecated** | Features marked for removal | Deprecated `getToken()` method |
| **Removed** | Removed features | Removed legacy storage adapter |
| **Fixed** | Bug fixes | Fixed memory leak in subscriptions |
| **Security** | Security improvements | Enhanced token encryption |

### Maintaining Unreleased Section

Keep an "Unreleased" section at the top for ongoing development:

```markdown
## [Unreleased]

### Added
- Session migration between devices (in progress)
- WebSocket support for real-time updates (planned)

### Changed
- Improved error handling (in progress)
```

When releasing, move items from "Unreleased" to the new version section.

---

## Git Workflow

### Branch Strategy

```
main (production)
  ├── develop (integration)
  │   ├── feature/biometric-auth
  │   ├── feature/session-analytics
  │   └── fix/memory-leak
  └── hotfix/critical-bug
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

**Examples:**

```bash
feat(auth): add biometric authentication support

Implemented WebAuthn API integration for biometric authentication.
Supports fingerprint and face recognition on supported devices.

Closes #123

---

fix(idle): correct timer reset on user activity

Fixed an issue where the idle timer wasn't properly resetting
when user activity was detected in certain edge cases.

Fixes #456

---

docs(readme): update installation instructions

Updated the README with clearer installation steps and
added troubleshooting section.
```

### Version Tags

```bash
# Create annotated tag
git tag -a v1.1.0 -m "Release version 1.1.0"

# Push tag
git push origin v1.1.0

# List all tags
git tag -l

# Delete tag (if needed)
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0
```

---

## NPM Publishing

### Package Configuration

Ensure `projects/session-management/package.json` is properly configured:

```json
{
  "name": "@your-org/session-management",
  "version": "1.1.0",
  "description": "Angular session management library",
  "keywords": [
    "angular",
    "session",
    "authentication",
    "idle-timeout"
  ],
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/session-management.git"
  },
  "homepage": "https://github.com/your-org/session-management#readme",
  "bugs": {
    "url": "https://github.com/your-org/session-management/issues"
  },
  "peerDependencies": {
    "@angular/common": "^21.2.0",
    "@angular/core": "^21.2.0",
    "rxjs": "^7.8.0"
  }
}
```

### Publishing Steps

```bash
# 1. Build for production
npm run build:prod

# 2. Navigate to dist
cd dist/session-management

# 3. Verify package contents
npm pack --dry-run

# 4. Login to npm
npm login

# 5. Publish
npm publish --access public

# 6. Verify publication
npm view @your-org/session-management
```

### Publishing Checklist

- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] Documentation updated
- [ ] All tests passing
- [ ] Build successful
- [ ] Git tag created
- [ ] Changes pushed to GitHub
- [ ] Package published to npm
- [ ] GitHub release created
- [ ] Announcement made (if applicable)

---

## Version Upgrade Guide

### For Library Maintainers

#### Upgrading from 1.0.x to 1.1.x (Minor Update)

**No breaking changes. Safe to upgrade.**

```bash
npm install @your-org/session-management@^1.1.0
```

**New Features:**
- Biometric authentication support
- Session analytics
- Custom warning templates

**Migration Steps:**
1. Update package: `npm install @your-org/session-management@latest`
2. Review new features in CHANGELOG.md
3. Optionally adopt new features
4. Test your application

#### Upgrading from 1.x to 2.0.0 (Major Update)

**Breaking changes. Review carefully.**

**Breaking Changes:**
- Removed `getToken()` method
- Changed `initialize()` signature
- Renamed configuration options

**Migration Steps:**

1. **Update package:**
   ```bash
   npm install @your-org/session-management@^2.0.0
   ```

2. **Update code:**

   **Before (v1.x):**
   ```typescript
   const token = this.sessionService.getToken();
   
   this.sessionService.initialize();
   ```

   **After (v2.0):**
   ```typescript
   const token = this.sessionService.getSessionState()?.token;
   
   this.sessionService.initialize({
     sessionTimeoutInSeconds: 1800
   });
   ```

3. **Update configuration:**

   **Before (v1.x):**
   ```typescript
   {
     timeout: 1800,
     enableIdle: true
   }
   ```

   **After (v2.0):**
   ```typescript
   {
     sessionTimeoutInSeconds: 1800,
     enableIdleTimeout: true
   }
   ```

4. **Test thoroughly:**
   ```bash
   npm test
   npm start
   ```

### For Library Users

#### Checking Current Version

```bash
# Check installed version
npm list @your-org/session-management

# Check latest version
npm view @your-org/session-management version

# Check all available versions
npm view @your-org/session-management versions
```

#### Updating to Latest Version

```bash
# Update to latest minor/patch (safe)
npm update @your-org/session-management

# Update to specific version
npm install @your-org/session-management@1.2.0

# Update to latest (including major)
npm install @your-org/session-management@latest
```

---

## Version Compatibility Matrix

| Library Version | Angular Version | RxJS Version | TypeScript Version | Node.js Version |
|----------------|-----------------|--------------|-------------------|-----------------|
| 1.0.x | 21.2.0+ | 7.8.0+ | 5.9.2+ | 18.x+ |
| 1.1.x | 21.2.0+ | 7.8.0+ | 5.9.2+ | 18.x+ |
| 2.0.x | 22.0.0+ | 8.0.0+ | 5.10.0+ | 20.x+ |

---

## Deprecation Policy

### Deprecation Process

1. **Announce deprecation** in CHANGELOG.md
2. **Add deprecation warning** in code
3. **Update documentation** with migration guide
4. **Keep deprecated feature** for at least one major version
5. **Remove in next major version**

### Example Deprecation

```typescript
/**
 * @deprecated Use getSessionState().token instead. Will be removed in v2.0.0
 */
getToken(): string | undefined {
  console.warn('getToken() is deprecated. Use getSessionState().token instead.');
  return this.sessionState?.token;
}
```

---

## Release Schedule

### Regular Releases

- **Patch releases**: As needed (bug fixes)
- **Minor releases**: Monthly (new features)
- **Major releases**: Annually (breaking changes)

### Security Releases

- **Critical**: Within 24 hours
- **High**: Within 1 week
- **Medium**: Next regular release
- **Low**: Next major release

---

## Rollback Procedure

If a release has critical issues:

### 1. Unpublish from npm (within 72 hours)

```bash
npm unpublish @your-org/session-management@1.1.0
```

### 2. Revert Git Changes

```bash
git revert <commit-hash>
git push origin main
```

### 3. Delete Git Tag

```bash
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0
```

### 4. Publish Fixed Version

```bash
# Increment patch version
npm version patch
npm run build:prod
cd dist/session-management
npm publish --access public
```

---

## Version Documentation

### Maintaining Version-Specific Docs

Create version-specific documentation branches:

```bash
# Create docs branch for v1.0
git checkout -b docs/v1.0 v1.0.0

# Create docs branch for v1.1
git checkout -b docs/v1.1 v1.1.0
```

### Documentation Versioning

```
docs/
  ├── v1.0/
  │   ├── README.md
  │   ├── API.md
  │   └── EXAMPLES.md
  ├── v1.1/
  │   ├── README.md
  │   ├── API.md
  │   └── EXAMPLES.md
  └── latest/ (symlink to current version)
```

---

## Automated Versioning

### Using GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build:prod
        
      - name: Publish to npm
        run: |
          cd dist/session-management
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

---

**Made with Bob** 🤖

For more information, see:
- [Changelog](CHANGELOG.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Release Notes](https://github.com/your-org/session-management/releases)