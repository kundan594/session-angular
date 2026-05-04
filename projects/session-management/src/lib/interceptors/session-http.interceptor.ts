import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SessionService } from '../services/session.service';

/**
 * HTTP Interceptor for session management
 * - Adds authentication token to requests
 * - Handles 401/302 responses (session expired)
 * - Extends session on successful API calls
 */
@Injectable()
export class SessionHttpInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get current session state
    const sessionState = this.sessionService.getSessionState();

    // Clone request and add authorization header if token exists
    let modifiedRequest = request;
    if (sessionState?.token && sessionState.isValidSession) {
      modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${sessionState.token}`,
        },
      });
    }

    // Handle the request
    return next.handle(modifiedRequest).pipe(
      tap(() => {
        // Extend session on successful API call
        if (sessionState?.isValidSession) {
          this.sessionService.extendSession();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle authentication errors
        if (error.status === 401 || error.status === 302) {
          // Session expired or unauthorized
          this.sessionService.endSession('expired');
        }

        return throwError(() => error);
      })
    );
  }
}

// Made with Bob
