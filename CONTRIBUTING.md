# Contributing to Angular Session Management

Thank you for your interest in contributing to the Angular Session Management library! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)
8. [Submitting Changes](#submitting-changes)
9. [Release Process](#release-process)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

### Enforcement

Violations of the code of conduct may result in temporary or permanent ban from the project. Report issues to: conduct@your-org.com

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18.x or higher
- npm 11.x or higher
- Git
- A GitHub account
- Basic knowledge of Angular and TypeScript

### Finding Issues to Work On

1. Check the [Issues](https://github.com/your-org/angular-session-workspace/issues) page
2. Look for issues labeled:
   - `good first issue` - Great for newcomers
   - `help wanted` - We need community help
   - `bug` - Bug fixes needed
   - `enhancement` - New features or improvements

3. Comment on the issue to express interest before starting work

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/angular-session-workspace.git
cd angular-session-workspace

# Add upstream remote
git remote add upstream https://github.com/your-org/angular-session-workspace.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 4. Verify Setup

```bash
# Build the library
npm run build

# Run tests
npm test

# Start demo app
npm start
```

---

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-biometric-auth`)
- `fix/` - Bug fixes (e.g., `fix/session-timeout-issue`)
- `docs/` - Documentation updates (e.g., `docs/update-api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-storage-service`)
- `test/` - Test additions/updates (e.g., `test/add-idle-service-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Making Changes

1. **Keep changes focused**: One feature or fix per pull request
2. **Write clean code**: Follow our coding standards
3. **Add tests**: Ensure your changes are tested
4. **Update documentation**: Keep docs in sync with code
5. **Commit regularly**: Make small, logical commits

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(session): add biometric authentication support

Add support for WebAuthn biometric authentication as an additional
session security layer.

Closes #123
```

```bash
fix(idle): correct timer reset on user activity

Fixed an issue where the idle timer wasn't properly resetting
when user activity was detected in certain edge cases.

Fixes #456
```

```bash
docs(readme): update installation instructions

Updated the README with clearer installation steps and
added troubleshooting section.
```

---

## Coding Standards

### TypeScript Style Guide

#### 1. Naming Conventions

```typescript
// Classes: PascalCase
class SessionService { }

// Interfaces: PascalCase with 'I' prefix (optional)
interface SessionConfig { }

// Enums: PascalCase
enum SessionEvent { }

// Variables and functions: camelCase
const sessionTimeout = 1800;
function startSession() { }

// Constants: UPPER_SNAKE_CASE
const DEFAULT_TIMEOUT = 1800;

// Private members: prefix with underscore
private _sessionState: SessionState;
```

#### 2. File Naming

```
// Services: kebab-case with .service.ts
session.service.ts
idle-timeout.service.ts

// Components: kebab-case with .component.ts
session-warning-dialog.component.ts

// Models: kebab-case with .model.ts
session-config.model.ts

// Interceptors: kebab-case with .interceptor.ts
session-http.interceptor.ts
```

#### 3. Code Organization

```typescript
// Order of class members:
export class SessionService {
  // 1. Public properties
  public sessionState$: Observable<SessionState>;
  
  // 2. Private properties
  private config: SessionConfig;
  private sessionState: SessionState | null = null;
  
  // 3. Constructor
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  
  // 4. Lifecycle hooks
  ngOnInit() { }
  ngOnDestroy() { }
  
  // 5. Public methods
  public initialize() { }
  public startSession() { }
  
  // 6. Private methods
  private setupIdleTimeout() { }
  private log() { }
}
```

#### 4. Documentation

```typescript
/**
 * Main session management service
 * 
 * Provides comprehensive session management including:
 * - Session lifecycle management
 * - Idle timeout detection
 * - Multi-tab synchronization
 * 
 * @example
 * ```typescript
 * sessionService.initialize({
 *   sessionTimeoutInSeconds: 1800
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  /**
   * Initialize session management with configuration
   * 
   * @param config - Optional configuration to override defaults
   */
  initialize(config?: Partial<SessionConfig>): void {
    // Implementation
  }
}
```

#### 5. Type Safety

```typescript
// Always use explicit types
function calculateTimeout(seconds: number): number {
  return seconds * 1000;
}

// Use interfaces for object parameters
interface LoginCredentials {
  username: string;
  password: string;
}

function login(credentials: LoginCredentials): Observable<LoginResponse> {
  // Implementation
}

// Avoid 'any' - use specific types or generics
function processData<T>(data: T): T {
  return data;
}
```

### Angular Best Practices

#### 1. Dependency Injection

```typescript
// Use constructor injection
constructor(
  private http: HttpClient,
  private router: Router,
  @Optional() @Inject('CONFIG') private config?: Config
) {}
```

#### 2. Observables

```typescript
// Always unsubscribe to prevent memory leaks
private destroy$ = new Subject<void>();

ngOnInit() {
  this.sessionService.sessionState$
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      // Handle state
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

#### 3. Error Handling

```typescript
// Always handle errors in observables
this.http.post('/api/data', data).pipe(
  tap(response => console.log('Success')),
  catchError(error => {
    console.error('Error:', error);
    return throwError(() => error);
  })
).subscribe();
```

### Code Formatting

We use Prettier for code formatting. Configuration is in `.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

**Format your code before committing:**

```bash
npm run format
```

---

## Testing Guidelines

### Test Structure

```typescript
describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('startSession', () => {
    it('should start a new session', () => {
      // Arrange
      const userId = 'user123';
      const token = 'token123';

      // Act
      service.startSession(userId, token);

      // Assert
      expect(service.isSessionValid()).toBe(true);
      expect(service.getSessionState()?.userId).toBe(userId);
    });

    it('should emit SESSION_STARTED event', (done) => {
      // Arrange & Act
      service.sessionEvent$.subscribe(event => {
        // Assert
        expect(event).toBe(SessionEvent.SESSION_STARTED);
        done();
      });

      service.startSession('user123', 'token123');
    });
  });
});
```

### Test Coverage Requirements

- **Minimum coverage**: 80% overall
- **Services**: 90%+ coverage
- **Components**: 85%+ coverage
- **Interceptors**: 95%+ coverage

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- session.service.spec.ts

# Run in watch mode
npm test -- --watch
```

### Writing Good Tests

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Follow AAA pattern** (Arrange, Act, Assert)
4. **Test edge cases and error conditions**
5. **Mock external dependencies**
6. **Keep tests independent**

---

## Documentation

### Documentation Requirements

All contributions must include appropriate documentation:

1. **Code Comments**: Document complex logic
2. **JSDoc**: Document public APIs
3. **README Updates**: Update if adding features
4. **API Documentation**: Update API.md for API changes
5. **Examples**: Add examples for new features
6. **Changelog**: Update CHANGELOG.md

### Documentation Style

```typescript
/**
 * Brief description of the function
 * 
 * Detailed description if needed. Explain what the function does,
 * any important behavior, and usage notes.
 * 
 * @param paramName - Description of parameter
 * @param optionalParam - Description of optional parameter
 * @returns Description of return value
 * 
 * @example
 * ```typescript
 * const result = myFunction('value', 123);
 * console.log(result);
 * ```
 * 
 * @throws {Error} When invalid input is provided
 * @see {@link RelatedFunction} for related functionality
 */
function myFunction(paramName: string, optionalParam?: number): ReturnType {
  // Implementation
}
```

---

## Submitting Changes

### Before Submitting

1. **Run tests**: Ensure all tests pass
   ```bash
   npm test
   ```

2. **Check formatting**: Format your code
   ```bash
   npm run format
   ```

3. **Build successfully**: Ensure library builds
   ```bash
   npm run build
   ```

4. **Update documentation**: Keep docs in sync

5. **Update changelog**: Add entry to CHANGELOG.md

### Creating a Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**:
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Title Format**:
   ```
   feat(scope): brief description
   ```

4. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] All tests passing
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   - [ ] Tests added for changes

   ## Related Issues
   Closes #123
   ```

### PR Review Process

1. **Automated checks**: CI/CD runs tests and linting
2. **Code review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: PR approved by maintainers
5. **Merge**: PR merged into main branch

### Responding to Feedback

- Be open to suggestions
- Ask questions if unclear
- Make requested changes promptly
- Push updates to the same branch
- Re-request review after changes

---

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features (backward compatible)
- **PATCH** (0.0.X): Bug fixes

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Build library
5. Create git tag
6. Push to GitHub
7. Publish to npm
8. Create GitHub release

### Publishing (Maintainers Only)

```bash
# Update version
npm version patch|minor|major

# Build library
ng build session-management --configuration production

# Navigate to dist
cd dist/session-management

# Publish to npm
npm publish --access public

# Create git tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## Getting Help

### Resources

- **Documentation**: [README.md](README.md)
- **API Reference**: [API.md](API.md)
- **Examples**: [EXAMPLES.md](EXAMPLES.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/angular-session-workspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/angular-session-workspace/discussions)

### Contact

- **Email**: dev@your-org.com
- **Discord**: [Join our server](https://discord.gg/your-server)
- **Twitter**: [@YourOrg](https://twitter.com/yourorg)

---

## Recognition

### Contributors

All contributors are recognized in:
- GitHub contributors page
- CHANGELOG.md (for significant contributions)
- Project README.md

### Hall of Fame

Outstanding contributors may be featured in our Hall of Fame with special recognition.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🎉

Thank you for contributing to Angular Session Management! Your efforts help make this library better for everyone.

**Questions?** Don't hesitate to ask in [GitHub Discussions](https://github.com/your-org/angular-session-workspace/discussions).

---

**Made with ❤️ and Bob** 🤖