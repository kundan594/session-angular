import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

/**
 * Service for detecting user idle time and activity
 */
@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService {
  private idleTimer$: Observable<number> | null = null;
  private idleSubscription: Subscription | null = null;
  private activityEvents$: Observable<any> | null = null;
  private activitySubscription: Subscription | null = null;

  private idleTimeoutSubject = new Subject<void>();
  private userActivitySubject = new Subject<void>();
  private warningSubject = new Subject<number>();

  public idleTimeout$ = this.idleTimeoutSubject.asObservable();
  public userActivity$ = this.userActivitySubject.asObservable();
  public warning$ = this.warningSubject.asObservable();

  private idleTimeInSeconds = 1800; // 30 minutes default
  private warningTimeInSeconds = 120; // 2 minutes default
  private lastActivityTime = Date.now();
  private isEnabled = false;
  private warningTimer: any = null;

  constructor(private ngZone: NgZone) {}

  /**
   * Start idle timeout detection
   */
  startWatching(
    idleTimeInSeconds: number,
    warningTimeInSeconds: number = 120
  ): void {
    this.idleTimeInSeconds = idleTimeInSeconds;
    this.warningTimeInSeconds = warningTimeInSeconds;
    this.isEnabled = true;
    this.lastActivityTime = Date.now();

    this.setupActivityListeners();
    this.startIdleTimer();
  }

  /**
   * Stop idle timeout detection
   */
  stopWatching(): void {
    this.isEnabled = false;
    this.cleanup();
  }

  /**
   * Reset idle timer (called on user activity)
   */
  resetTimer(): void {
    if (!this.isEnabled) return;

    this.lastActivityTime = Date.now();
    this.userActivitySubject.next();
    this.clearWarningTimer();
    this.restartIdleTimer();
  }

  /**
   * Get time remaining until idle timeout (in seconds)
   */
  getTimeRemaining(): number {
    const elapsed = (Date.now() - this.lastActivityTime) / 1000;
    return Math.max(0, this.idleTimeInSeconds - elapsed);
  }

  /**
   * Get last activity timestamp
   */
  getLastActivityTime(): number {
    return this.lastActivityTime;
  }

  /**
   * Check if user is currently idle
   */
  isIdle(): boolean {
    return this.getTimeRemaining() === 0;
  }

  /**
   * Setup activity event listeners
   */
  private setupActivityListeners(): void {
    // Run outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      // List of events that indicate user activity
      const events = [
        'mousedown',
        'mousemove',
        'keydown',
        'scroll',
        'touchstart',
        'click',
        'wheel',
      ];

      // Create observables for each event
      const eventObservables = events.map((event) =>
        fromEvent(document, event)
      );

      // Merge all events and debounce to avoid excessive triggers
      this.activityEvents$ = merge(...eventObservables).pipe(
        debounceTime(1000), // Debounce for 1 second
        tap(() => {
          // Run the reset timer inside Angular zone
          this.ngZone.run(() => {
            this.resetTimer();
          });
        })
      );

      this.activitySubscription = this.activityEvents$.subscribe();
    });
  }

  /**
   * Start the idle timer
   */
  private startIdleTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      // Check every second
      this.idleTimer$ = timer(0, 1000);

      this.idleSubscription = this.idleTimer$.subscribe(() => {
        const timeRemaining = this.getTimeRemaining();

        // Check if warning should be shown
        if (
          timeRemaining <= this.warningTimeInSeconds &&
          timeRemaining > 0 &&
          !this.warningTimer
        ) {
          this.ngZone.run(() => {
            this.showWarning(timeRemaining);
          });
        }

        // Check if idle timeout reached
        if (timeRemaining === 0) {
          this.ngZone.run(() => {
            this.onIdleTimeout();
          });
        }
      });
    });
  }

  /**
   * Restart the idle timer
   */
  private restartIdleTimer(): void {
    this.cleanup();
    this.startIdleTimer();
  }

  /**
   * Show warning before timeout
   */
  private showWarning(timeRemaining: number): void {
    this.warningTimer = setInterval(() => {
      const remaining = this.getTimeRemaining();
      if (remaining > 0) {
        this.warningSubject.next(remaining);
      } else {
        this.clearWarningTimer();
      }
    }, 1000);

    this.warningSubject.next(timeRemaining);
  }

  /**
   * Clear warning timer
   */
  private clearWarningTimer(): void {
    if (this.warningTimer) {
      clearInterval(this.warningTimer);
      this.warningTimer = null;
    }
  }

  /**
   * Handle idle timeout
   */
  private onIdleTimeout(): void {
    this.clearWarningTimer();
    this.idleTimeoutSubject.next();
    this.stopWatching();
  }

  /**
   * Cleanup subscriptions and timers
   */
  private cleanup(): void {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
      this.idleSubscription = null;
    }

    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      this.activitySubscription = null;
    }

    this.clearWarningTimer();
  }

  /**
   * Destroy service and cleanup
   */
  ngOnDestroy(): void {
    this.stopWatching();
    this.idleTimeoutSubject.complete();
    this.userActivitySubject.complete();
    this.warningSubject.complete();
  }
}

// Made with Bob
