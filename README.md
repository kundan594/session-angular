# Angular Session Management Workspace

A comprehensive Angular workspace containing a production-ready session management library with demo application.

## 📦 Projects

### Session Management Library (`projects/session-management`)

A powerful Angular library for managing user sessions with advanced features:

- ✅ **Session Timeout Management** - Configurable session expiration
- ✅ **Idle Detection** - Automatic user activity monitoring
- ✅ **Multi-Tab Synchronization** - Sync sessions across browser tabs
- ✅ **Keep-Alive Mechanism** - Automatic session extension
- ✅ **Token Management** - Automatic token refresh and rotation
- ✅ **HTTP Interceptor** - Seamless token injection
- ✅ **Warning Dialogs** - Customizable timeout warnings
- ✅ **Event System** - Observable-based lifecycle events

**[📖 Full Library Documentation](projects/session-management/README.md)**

### Demo Application (`projects/demo-app`)

A demonstration application showcasing the session management library features and usage patterns.

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/angular-session-workspace.git
cd angular-session-workspace

# Install dependencies
npm install
```

### Development

```bash
# Start the demo application
npm start

# The app will be available at http://localhost:4200/
```

### Build Library

```bash
# Build the session management library
ng build session-management

# Output will be in dist/session-management/
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests for specific project
ng test session-management
ng test demo-app
```

## 📚 Documentation

- **[Library README](projects/session-management/README.md)** - Complete library documentation
- **[Usage Examples](EXAMPLES.md)** - Comprehensive usage examples
- **[API Documentation](API.md)** - Detailed API reference
- **[Changelog](CHANGELOG.md)** - Version history and release notes
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

## 🎯 Features Overview

### Session Management
- Configurable session timeouts (default: 30 minutes)
- Automatic session extension on user activity
- Session state persistence across page reloads
- Multi-tab session synchronization

### Idle Detection
- Real-time user activity monitoring
- Configurable idle timeout periods
- Warning notifications before timeout
- Automatic logout on idle timeout

### Token Management
- Secure token storage (localStorage/sessionStorage)
- Automatic token refresh
- Token rotation support
- Bearer token injection in HTTP requests

### Security Features
- Automatic logout on 401/302 responses
- Session validation
- Cross-tab logout synchronization
- Configurable storage options

## 🔧 Configuration

### Basic Configuration

```typescript
import { SessionService } from '@your-org/session-management';

export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.initialize({
      sessionTimeoutInSeconds: 1800,      // 30 minutes
      warningTimeoutInSeconds: 120,       // 2 minutes
      enableIdleTimeout: true,
      enableMultiTabTracking: true,
      logoutRoute: '/login'
    });
  }
}
```

### Advanced Configuration

```typescript
this.sessionService.initialize({
  // Timeouts
  sessionTimeoutInSeconds: 3600,
  warningTimeoutInSeconds: 300,
  keepAliveIntervalInSeconds: 300,
  
  // Features
  enableIdleTimeout: true,
  enableMultiTabTracking: true,
  enableTokenRefresh: true,
  enableDebugLogging: false,
  
  // API Endpoints
  sendKeepAliveApiUrl: '/api/session/keep-alive',
  onLogOffSessionApiUrl: '/api/auth/logout',
  
  // Token Refresh
  tokenRefreshIntervalInSeconds: 600,
  
  // Storage
  storageType: 'localStorage',
  
  // Navigation
  logoutRoute: '/login'
});
```

## 📖 Usage Examples

### Starting a Session

```typescript
// After successful login
this.sessionService.startSession(
  userId,
  accessToken,
  refreshToken
);
```

### Monitoring Session Events

```typescript
this.sessionService.sessionEvent$.subscribe(event => {
  switch(event) {
    case SessionEvent.SESSION_STARTED:
      console.log('Session started');
      break;
    case SessionEvent.SESSION_WARNING:
      console.log('Session expiring soon');
      break;
    case SessionEvent.SESSION_EXPIRED:
      console.log('Session expired');
      break;
  }
});
```

### Extending Session

```typescript
// Manually extend session
this.sessionService.extendSession();
```

### Ending Session

```typescript
// Logout
this.sessionService.endSession('logout');
```

## 🛠️ Development

### Project Structure

```
angular-session-workspace/
├── projects/
│   ├── session-management/          # Library source code
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── services/       # Core services
│   │   │   │   ├── interceptors/   # HTTP interceptors
│   │   │   │   ├── components/     # UI components
│   │   │   │   └── models/         # TypeScript interfaces
│   │   │   └── public-api.ts       # Public API exports
│   │   ├── README.md               # Library documentation
│   │   └── package.json            # Library package config
│   │
│   └── demo-app/                    # Demo application
│       └── src/
│           └── app/
│
├── CHANGELOG.md                     # Version history
├── EXAMPLES.md                      # Usage examples
├── API.md                          # API documentation
├── CONTRIBUTING.md                 # Contributing guidelines
└── README.md                       # This file
```

### Available Scripts

```bash
# Development
npm start                    # Start demo app
npm run build               # Build all projects
npm run watch               # Watch mode for library

# Testing
npm test                    # Run all tests
npm run test:lib           # Test library only
npm run test:app           # Test demo app only

# Library
npm run build:lib          # Build library
npm run pack:lib           # Pack library for publishing
```

### Building for Production

```bash
# Build the library
ng build session-management --configuration production

# Navigate to dist folder
cd dist/session-management

# Publish to npm (if you have permissions)
npm publish
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
ng test --code-coverage

# Run specific project tests
ng test session-management
```

### Test Coverage

The library maintains high test coverage:
- Services: 90%+
- Components: 85%+
- Interceptors: 95%+

## 📦 Publishing

### Prepare for Publishing

1. Update version in `projects/session-management/package.json`
2. Update `CHANGELOG.md` with changes
3. Build the library: `ng build session-management`
4. Test the build: `cd dist/session-management && npm pack`

### Publish to npm

```bash
cd dist/session-management
npm publish --access public
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit changes: `git commit -am 'Add new feature'`
7. Push to branch: `git push origin feature/my-feature`
8. Submit a pull request

## 📋 Requirements

- Node.js 18.x or higher
- npm 11.x or higher
- Angular CLI 21.x or higher

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

**Note**: Multi-tab synchronization requires BroadcastChannel API support.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/your-org/angular-session-workspace
- **npm Package**: https://www.npmjs.com/package/@your-org/session-management
- **Documentation**: https://github.com/your-org/angular-session-workspace#readme
- **Issues**: https://github.com/your-org/angular-session-workspace/issues

## 📞 Support

- 📧 Email: support@your-org.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/angular-session-workspace/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/angular-session-workspace/discussions)

## 🙏 Acknowledgments

- Built with [Angular](https://angular.dev/)
- Powered by [RxJS](https://rxjs.dev/)
- Generated with [Angular CLI](https://github.com/angular/angular-cli)

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: ✅ Production Ready
- **Last Updated**: 2026-05-04
- **Maintained**: ✅ Actively Maintained

## 🗺️ Roadmap

### Version 1.1.0 (Planned)
- [ ] Server-side session validation
- [ ] Enhanced security features
- [ ] Custom warning dialog templates
- [ ] Session analytics

### Version 1.2.0 (Planned)
- [ ] Biometric authentication support
- [ ] WebSocket support for real-time updates
- [ ] Session migration between devices
- [ ] Advanced monitoring dashboard

### Version 2.0.0 (Future)
- [ ] Standalone components migration
- [ ] Enhanced TypeScript strict mode
- [ ] Performance optimizations
- [ ] Extended browser support

## 📈 Statistics

- **Total Downloads**: Coming soon
- **GitHub Stars**: ⭐ Star us on GitHub!
- **Contributors**: See [Contributors](https://github.com/your-org/angular-session-workspace/graphs/contributors)

---

**Made with ❤️ and Bob** 🤖

For detailed information about the session management library, see the [Library Documentation](projects/session-management/README.md).
