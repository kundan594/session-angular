# Changelog

All notable changes to the Angular Session Management library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-04

### Added
- **Core Session Management**
  - Session lifecycle management (start, extend, end)
  - Configurable session timeout with default 30 minutes
  - Session state persistence using localStorage/sessionStorage
  - Session validation and state tracking
  - User authentication token management
  - Refresh token support

- **Idle Timeout Detection**
  - Automatic user activity monitoring (mouse, keyboard, touch, scroll)
  - Configurable idle timeout period
  - Warning notification before session expires (default 2 minutes)
  - Debounced activity detection for performance optimization
  - Real-time countdown timer for remaining session time
  - NgZone optimization for better performance

- **Multi-Tab Synchronization**
  - BroadcastChannel API for cross-tab communication
  - Active tab counting and tracking
  - Synchronized logout across all tabs
  - Tab lifecycle event handling (beforeunload, pagehide)
  - Unique tab ID generation for message filtering

- **Keep-Alive Mechanism**
  - Configurable keep-alive ping intervals (default 5 minutes)
  - Automatic session extension on API calls
  - Customizable keep-alive endpoint
  - Failed keep-alive error handling

- **Token Management**
  - Automatic token refresh with configurable intervals
  - Refresh token rotation support
  - Token expiration handling
  - Secure token storage

- **HTTP Interceptor**
  - Automatic Bearer token injection in HTTP requests
  - Session extension on successful API calls
  - 401/302 error handling for expired sessions
  - Automatic logout on authentication failures

- **Session Warning Dialog**
  - Customizable warning component
  - Real-time countdown display
  - Extend session functionality
  - Logout option

- **Configuration System**
  - Comprehensive configuration interface
  - Default configuration values
  - Runtime configuration override
  - Configuration persistence
  - Dependency injection support

- **Event System**
  - Observable-based event emissions
  - Session lifecycle events (started, extended, expired, terminated)
  - User activity events
  - Keep-alive and token refresh events
  - Multi-tab detection events

- **Storage Service**
  - Abstracted storage layer (localStorage/sessionStorage)
  - Session state management
  - Configuration persistence
  - Active tab counting
  - Last activity timestamp tracking

- **Debug Logging**
  - Optional debug logging mode
  - Detailed operation logging
  - Error tracking and reporting

### Features
- ✅ Session timeout management
- ✅ Idle user detection
- ✅ Multi-tab session synchronization
- ✅ Automatic keep-alive
- ✅ Token refresh mechanism
- ✅ HTTP request interceptor
- ✅ Warning dialog before timeout
- ✅ Configurable storage (localStorage/sessionStorage)
- ✅ Event-driven architecture
- ✅ TypeScript support with full type definitions
- ✅ Angular 21+ compatibility
- ✅ RxJS 7+ integration
- ✅ Tree-shakeable module design

### Technical Details
- Built with Angular 21.2.0
- Uses RxJS 7.8.0 for reactive programming
- Implements BroadcastChannel API for multi-tab support
- NgZone optimization for performance
- Standalone component support
- Modular architecture with separate services
- Comprehensive TypeScript interfaces and enums

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- BroadcastChannel API required for multi-tab features

### Dependencies
- @angular/common: ^21.2.0
- @angular/core: ^21.2.0
- @angular/router: ^21.2.0
- rxjs: ^7.8.0

---

## [Unreleased]

### Planned Features
- Server-side session validation
- Biometric authentication support
- Session analytics and reporting
- Custom warning dialog templates
- Session migration between devices
- Enhanced security features
- WebSocket support for real-time updates

---

## Version History

### Version Numbering
- **Major version (X.0.0)**: Breaking changes, major feature additions
- **Minor version (0.X.0)**: New features, backward compatible
- **Patch version (0.0.X)**: Bug fixes, minor improvements

### Release Notes
Each version includes:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features marked for removal
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

## Migration Guide

### From Pre-release to 1.0.0
This is the initial stable release. No migration needed.

---

## Support

For issues, questions, or contributions, please visit:
- GitHub Issues: https://github.com/your-org/session-management/issues
- Documentation: https://github.com/your-org/session-management#readme

---

**Note**: This changelog will be updated with each release. Please check back for the latest changes and updates.