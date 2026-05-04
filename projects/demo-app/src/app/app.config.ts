import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { SessionManagementModule } from 'session-management';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // Import session management module with configuration
    ...SessionManagementModule.forRoot({
      sessionTimeoutInSeconds: 300, // 5 minutes for demo
      warningTimeoutInSeconds: 60, // 1 minute warning
      keepAliveIntervalInSeconds: 120, // 2 minutes
      enableIdleTimeout: true,
      enableMultiTabTracking: true,
      logoutRoute: '/login',
      storageType: 'localStorage',
      enableDebugLogging: true,
    }).providers || [],
  ],
};

// Made with Bob
