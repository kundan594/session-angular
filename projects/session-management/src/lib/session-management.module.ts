import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SessionConfig } from './models/session-config.model';
import { SessionService } from './services/session.service';
import { SessionStorageService } from './services/session-storage.service';
import { IdleTimeoutService } from './services/idle-timeout.service';
import { SessionHttpInterceptor } from './interceptors/session-http.interceptor';
import { SessionWarningDialogComponent } from './components/session-warning-dialog.component';

/**
 * Session Management Module
 * Provides session management functionality for Angular applications
 */
@NgModule({
  imports: [SessionWarningDialogComponent],
  exports: [SessionWarningDialogComponent],
})
export class SessionManagementModule {
  /**
   * Configure the session management module with custom configuration
   */
  static forRoot(config?: SessionConfig): ModuleWithProviders<SessionManagementModule> {
    return {
      ngModule: SessionManagementModule,
      providers: [
        SessionService,
        SessionStorageService,
        IdleTimeoutService,
        {
          provide: 'SESSION_CONFIG',
          useValue: config,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SessionHttpInterceptor,
          multi: true,
        },
      ],
    };
  }
}

// Made with Bob
